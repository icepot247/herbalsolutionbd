import {dateTimeFormatterMixin} from "./mixins/dateTimeFormatterMixin";

window.Vue = require('vue').default;
import App from './App.vue';
import VueAxios from 'vue-axios';
import VueRouter from 'vue-router';
import axios from 'axios';
import {routes} from './routes';

import LocalStore from './plugins/LocalStore';
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueSweetalert2 from 'vue-sweetalert2';
import Swal from 'sweetalert2'
// import moment from "moment";
import Vuex from 'vuex'
Vue.use(Vuex)
import storeData from "./store/index"
const store = new Vuex.Store(storeData)
window.store = store;
require('./bootstrap');


import VueToastr2 from 'vue-toastr-2'
import 'vue-toastr-2/dist/vue-toastr-2.min.css'
import VueHtmlToPaper from 'vue-html-to-paper';

// axios.defaults.headers.common.proxy = {  protocol: 'http',  host: 'http://123.200.20.20',  port: 5124 }
// axios.defaults.headers.common.proxy = {  protocol: 'http',  host: 'http://192.168.78.69',  port: 9999 }
axios.defaults.headers.common.proxy = {  protocol: 'http',  host: 'http://'+process.env.APP_BASE_IP,  port: process.env.APP_BASE_PORT }
// axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
// axios.defaults.headers.put["Content-Type"] = "multipart/form-data";
// axios.defaults.withCredentials = true
// axios.defaults.baseURL = process.env.MIX_API_URL;

// --------------------Response interceptor for API calls----------------------

//const axiosApiInstance = axios.create();
// var token= '';
// const refresh=false;
axios.interceptors.response.use((response) => {
        return response
    }, async (error) => {
        //console.log("Response Error Details:-",error);
        const orginalRequest = error.config;
        //var perviousToken = LocalStore.getStorage('token');
        var perviousRefreshToken = LocalStore.getStorage('refresh_token')
        var replay = false;

        if (error.response !== null) {
            if (error.response.data.code === 999) {
                return  Promise.reject(error);

            }
            if (error.response.data.code === 401) {

                LocalStore.removeAllStorage();
                LocalStore.removeStorage('user')
                LocalStore.removeStorage('token')
                this.$store.dispatch("removeUser"); //set state in storage
                this.$router.replace({ name: "login" });
                window.location.href = "/avis/login";

//---------------------------Using Refresh Token Api----------------//

                /*try {
                    const params = {
                        refresh_token: perviousRefreshToken
                    }
                    axios.post(process.env.MIX_API_URL + '/auth/login/refresh-token', params, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ''
                        }
                    }).then(response => {  
                       var data = response.data; 
                       LocalStore.setStorage('token',data.token);  
                       var currentToken=this.$store.getters.getToken; 
                      // axios.defaults.headers.common['Authorization'] = 'Bearer ' + currentToken;
                       this.axios = this.axiosApiInstance;
                       window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + currentToken 
                       replay = true;
                       return axios(orginalRequest);
   
                    }).catch(error => {
                        //console.log('errorerror error ', error)
                        if(error.response.data.code === 408){
                            LocalStore.removeAllStorage();
                            LocalStore.removeStorage('user')
                            LocalStore.removeStorage('token')
                            this.$store.dispatch("removeUser"); //set state in storage
                            Promise.reject(error.response.data);
                            this.$router.replace({ name: "login" });
                            window.location.href = "/app/login";
                        }
                        Promise.reject(error.response.data);
                    })
                    .finally({ })

                }
                catch (e) {
                    if (e.response && e.response.data) {
                        this.axios = this.axiosApiInstance;
                        return Promise.reject(e.response.data);
                    }
                    return Promise.reject(e);
                }*/
            }
            
            return  Promise.reject(error);

        }
        // if(replay) {
        //     return axios.request(orginalRequest);
        // } else {
        //     return Promise.reject(error);
        // }
    });

//----------------------------------------

Vue.config.productionTip = false

window.toastr = require('toastr')
Vue.use(VueToastr2)

Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.use(VueSweetalert2);

Vue.use(VueHtmlToPaper);
Vue.component("v-select", vSelect);




const router = new VueRouter({
    mode: 'history',
    base:"/avis",
    routes: routes
});

// const Swal = require('sweetalert2');
window.Swal = Swal;


const app = new Vue({
    el: '#app',
    router,
    store,
    LocalStore,
    render: h => h(App),
    mounted() {
        window.toastr.options.closeButton = true;
    },
    created() {
    },
    methods:{
        hasAccess(componentName='', permissionType=''){
            if(window.isLoggedIn()){
                //super admin
                if(this.$store.getters.getUser.data.user_type_id == '1'){
                    return true;
                }

                var userMenus =  LocalStore.getStorage('menu');
                if(userMenus != null){
                    var permMenu = null;
                    var permissionStatus = false;

                    if(componentName.length > 0 && ["add",  "edit", "delete", "view"].includes(permissionType)){
                        userMenus.filter((v, i) => {
                            //main menu
                            if(v.main_menu_component_name === componentName){
                                permMenu = v;
                            }

                            //child menu
                            if (v.childs.length > 0) {
                                v.childs.filter((cv, ci) => {
                                    if(cv.menu_component_name === componentName){
                                        permMenu = cv;
                                    }
                                });
                            }
                        });

                        //check permission
                        if(permMenu != null){

                            switch (permissionType) {
                                case "add":
                                    if(permMenu.user_menu_insert_status == 'Y' || (permMenu.user_menu_insert_status == null && permMenu.role_id != null)){
                                        permissionStatus = true;
                                    }else{
                                        permissionStatus = false;
                                    }
                                    break;
                                case "edit":
                                    if(permMenu.user_menu_edit_status == 'Y' || (permMenu.user_menu_edit_status == null && permMenu.role_id != null)){
                                        permissionStatus = true;
                                    }else{
                                        permissionStatus = false;
                                    }
                                    break;
                                case "delete":
                                    if(permMenu.user_menu_delete_status == 'Y' || (permMenu.user_menu_delete_status == null && permMenu.role_id != null)){
                                        permissionStatus = true;
                                    }else{
                                        permissionStatus = false;
                                    }
                                    break;
                                case "view":
                                    if(permMenu.user_menu_view_status == 'Y' || (permMenu.user_menu_view_status == null && permMenu.role_id != null)){
                                        permissionStatus = true;
                                    }else{
                                        permissionStatus = false;
                                    }
                                    break;
                                default:
                                    permissionStatus = false;
                                    break;
                            }
                            return permissionStatus;
                        }else{
                            return false;
                        }
                    }else{
                        console.log('invalid hasAccess component name '+componentName+' or invalid permission type '+permissionType)
                        return false;
                    }
                }else{
                    console.log('No menu data found on hasAccess');
                    return false;
                }
            }else{
                console.log('User not logged in on hasAccess')
                return false;
            }

        }
    }
});


router.beforeEach((to, from, next) => {
    console.log('Resource loading..')

    if(window.hasPagPermission( '/'+to.name)){
        next();
    }else{
        next({ path: '/login'  });
    }
});


export default router;
