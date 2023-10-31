import LocalStore from "./plugins/LocalStore";
import router from "./app";
import axios from "axios";

window._ = require('lodash');
try {
    window.Popper = require('popper.js').default;
    window.$ = window.jQuery = require('jquery');
    require('bootstrap');
} catch (e) {
}

window.axios = require('axios');
window.axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// window.axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
// window.axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
let token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
    var tokenData = LocalStore.getStorage('token');
    if (tokenData) {
        // window.store.dispatch("setUser"); //set state in storage
        // console.log(window.store.dispatch("setUser"))
        window.axios.defaults.headers.common['Authorization'] = tokenData.type + ' ' + tokenData.token
    }
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo';

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     encrypted: true
// });

//Permission set and verify


try {
    // console.log('Bootstrap loading..')
    window.isLoggedIn = () => {
        return ((LocalStore.getStorage('token') && LocalStore.getStorage('user') && LocalStore.getStorage('menu')) != null);
    }

    window.hasPagPermission = (pagePath) => {
        if(LocalStore.getStorage('user') && LocalStore.getStorage('user').data.user_type_id == '1'){
            return true;
        }

        var defaultPermittedPagePaths = ["/login",  "/logout", "/screen"];

        //need to update from user menu permission i.e store/api
        var protectedPagePaths = [
            "/profile"
        ];

        var mainMenus =  LocalStore.getStorage('menu');
        if(mainMenus != null) {
            mainMenus.filter((v, i) => {
                protectedPagePaths.push(v.main_menu_url);
                if (v.childs.length > 0) {
                    v.childs.filter((cv, ci) => {
                        protectedPagePaths.push(cv.menu_url);
                    });
                }
            });
        }

        if(defaultPermittedPagePaths.includes(pagePath) || (window.isLoggedIn() && protectedPagePaths.includes(pagePath))){
            return true;
        }else{
            return false;
        }
    }

    //calling page permission on load
    if( window.location.pathname !='/login' && !window.hasPagPermission(window.location.pathname)){
        window.location.href = "/avis/login";
    }

} catch (e) {
    console.log('Bootstrap permission', e)
}
