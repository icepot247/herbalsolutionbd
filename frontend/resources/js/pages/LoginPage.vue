<template>
    <div>
        <div>
            <div class="container-fluid ">
                <div class="row g-0">

                    <div class="col-xl-9 col-md-8 p-0">
                        <div class="auth-full-bg pt-lg-5">
                            <div class="w-100">
                                <div class="bg-overlay"></div>
                                <div class="d-flex h-100 flex-column">
                                    <div class="">
                                        <div class="justify-content-start">
                                            <div class="col-lg-7">
                                                <div class="text-lg-left">
                                                    <a class="navbar-brand" href="/avis/login">
                                                        <img src="assets/images/light-logo.png" class="vic-logo"
                                                             alt="logo">
                                                    </a>

                                                </div>
                                                <div class="text-lg-left">
                                                    <div class="d-flex flex-column welcome-tag">
                                                        <h1 class="text-white">Welcome!</h1>
<!--                                                        <p class="text-white">Welcome to Automated Vehicle Inspection-->
<!--                                                            System.</p>-->

                                                      <p class="text-white">To Automated Vehicle Inspection
                                                        System.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- end col -->

                    <div class="col-xl-3 col-md-4 border-right-custom">
                        <div class="auth-full-page-content p-md-4 p-4">
                            <div class="w-100">

                                <div class="d-flex flex-column h-100">

                                    <div class="row mb-5 mt-5">
                                        <div class="col-6 text-center">
                                            <img src="assets/images/logo/brta.png" class=""
                                                 style="width: 100px;height: auto" alt="brta logo">

                                        </div>
                                        <div class="col-6  text-center">
                                            <img src="assets/images/logo/bdgovt.png" class=""
                                                 style="width: 100px;height: auto" alt=" avis logo">

                                        </div>
                                    </div>

                                    <div class=" m-0 mt-5">
                                        <div v-if="loginStep==1">
                                            <p class="text-muted">Please log in for further procedure.</p>
                                        </div>

                                        <div v-if="loginStep==2">
                                            <h5 class="text-dark">Welcome <a href="/" v-if="loginStep==2"
                                                                             class="text-primary"><u>{{fullName}}</u></a>!
                                            </h5>
                                        </div>
                                        <div class="mt-4">
                                            <form action="#">
                                                <div class="mb-3" v-if="loginStep==1">
                                                    <label for="username" class="form-label">Username</label>
                                                    <div class="input-group auth-pass-inputgroup">
                                                        <input @keyup.enter="login" type="text" class="form-control"
                                                               :class="[(v$.user.username.$error)?'is-invalid':'']"
                                                               v-model="user.username"
                                                               id="username" placeholder="Enter username">
                                                    </div>
                                                    <ul v-if="v$.user.username.$error"
                                                        class="parsley-errors-list filled">
                                                        <li class="parsley-required">The field is required.</li>
                                                    </ul>

                                                </div>
                                                <div class="mb-3" v-if="loginStep==1">
                                                    <label class="form-label">Password</label>
                                                    <div class="input-group auth-pass-inputgroup">
                                                        <input @keyup.enter="login" autocomplete="off" type="password"
                                                               @focus="changeFieldType"
                                                               class="form-control"
                                                               :type="(fieldType=='password')?fieldType:'text'"
                                                               :class="[(v$.user.password.$error)?'is-invalid':'']"
                                                               placeholder="Enter password" v-model="user.password"
                                                               aria-label="Password">
                                                      <button @click="changePasswordView"  class="btn border border-left-0" type="button">
                                                        <i :class="(fieldType=='password')? 'mdi mdi-eye-outline' : 'mdi mdi-eye-off-outline' "></i></button>
                                                    </div>
                                                    <ul v-if="v$.user.password.$error" class="parsley-errors-list filled">
                                                        <li v-for="(value,key) in v$.user.password.$errors" :key="key" class="parsley-required">{{value.$message}}</li>
                                                    </ul>
                                                </div>


                                                <div class="mb-3" v-if="loginStep==2">
                                                    <label class="form-label">Center</label>
                                                    <b-form-select @keyup.enter="login" class="form-control"
                                                                   v-model="user.center_id" :options="centerList"
                                                                   id="center_id" name="center_id"></b-form-select>
                                                </div>

                                                <div class="mt-3 d-grid">
                                                    <button v-if="!isLoading" class="btn  btn-login "
                                                            type="button" @click="login()">Next
                                                    </button>

                                                    <button v-if="isLoading" class="btn btn-login" type="button"
                                                            :disabled="true">
                                                        <div class="spinner-border"
                                                             style="height: 1rem !important; width: 1rem !important;">
                                                            <span class="visually-hidden">Processing...</span>
                                                        </div>
                                                    </button>
                                                </div>

                                                <!-- <button   class="btn  btn-login "
                                                           type="button" @click="testApi()">Test
                                                 </button>-->
                                            </form>
                                        </div>
                                    </div>

                                    <div class="mt-auto text-center mb-0">
                                        <p class="mb-0">© 2023. Developed by CNS Limited.</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <!-- end col -->
                </div>
                <!-- end row -->
            </div>
            <!-- end container-fluid -->
        </div>
    </div>
</template>

<script>
    import AuthLayout from "../layouts/AuthLayout";
    import LocalStore from "../plugins/LocalStore";
    import Loader from "../components/common/Loader";
    import useVuelidate from "@vuelidate/core";
    import {required,minLength,helpers} from "@vuelidate/validators";
    import axios from "axios";


    export default {
        name: 'LoginPage',
        components: {Loader},
        data() {
            return {
                loginStep: 1,
                fullName: '',
                isLoading: false,
                user: {
                    username: "",
                    password: "",
                    center_id: "",
                    ipAddress: "",
                },
                centerList: [],
                fieldType: "text",
            }
        },
        created() {
            this.$emit(`update:layout`, AuthLayout);
            // this.getIPAddress();

        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                user: {
                    username: {
                        required
                    },
                    password: {
                        required,
                    }
                },
            }
        },
        mounted() {
            this.checkLogin();
        },
        methods: {
           async login() {
                if ( await this.v$.$validate()) {
                    this.isLoading = true;
                    this.axios
                        .post(process.env.MIX_API_URL + '/auth/login', this.user, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(response => {
                            var data = response.data;
                            if (data.status) {
                              //console.log("data.Status:- ",data.status)
                                if (data.token !== undefined) {
                                    this.isLoading = true;
                                    LocalStore.setStorage('user', data);
                                    LocalStore.setStorage('token', data.token.token);
                                    LocalStore.setStorage('tokenType', data.token.type);
                                    LocalStore.setStorage('refresh_token',data.token.refresh_token);
                                    // this.$toastr.success(data.message);
                                    this.$store.dispatch("setUser"); //set state in storage
                                    this.$store.dispatch("setMenu"); //set state in storage

                                    window.location.href = '/avis/home'

                                    
                                    // this.$router.replace({ name: "home" });
                                } else {
                                    this.loginStep = 2;
                                    this.fullName = data.full_name
                                    this.centerList = data.centers
                                    this.user.center_id = data.centers[0].value;
                                }
                            } else {
                                this.$toastr.error(data.message);
                                this.isLoading = false;
                            }
                        })
                        .catch(error => {
                          this.$toastr.error(error.response.data.message);
                            this.isLoading = false;
                        })
                        .finally(() => {
                            this.isLoading = false;
                        });
                }
            },

            checkLogin() {
                if (LocalStore.getStorage('token') && LocalStore.getStorage('user')) {
                    this.$router.replace("home");
                } else {
                    this.$store.dispatch("removeUser"); //set state in storage
                    this.$store.dispatch("removeMenu"); //set state in storage
                }
            },
            changeFieldType() {
                this.fieldType = "password";
            },
            // getIPAddress(){
            //    this.axios
            //        .get("https://api.ipify.org?format=json")
            //        .then(response =>{
            //            let ipDetails = JSON.parse(response) ;
            //            this.user.ipAddress = ipDetails.ip;
            //        })
            //     .catch(error =>{
            //          var xmlHttp = new XMLHttpRequest();
            //          xmlHttp.open( "GET", "https://api.ipify.org?format=json", false );
            //          xmlHttp.send( null );
            //          let ipDetails = JSON.parse(xmlHttp.responseText) ;
            //         this.user.ipAddress = ipDetails.ip;
            //     })
            //     .finally(()=>{
            //
            //     })
            // }
          changePasswordView() {
            this.fieldType = (this.fieldType =="password")?"text":"password";
          },
            getIPAddress(){
               this.axios
                   .get("https://api.ipify.org?format=json")
                   .then(response =>{
                       let ipDetails = JSON.parse(response) ;
                       this.user.ipAddress = ipDetails.ip;
                   })
                .catch(error =>{
                     var xmlHttp = new XMLHttpRequest();
                     xmlHttp.open( "GET", "https://api.ipify.org?format=json", false );
                     xmlHttp.send( null );
                     let ipDetails = JSON.parse(xmlHttp.responseText) ;
                    this.user.ipAddress = ipDetails.ip;
                })
                .finally(()=>{

                })
            }
            /*testApi(){
                /!*this.user = {
                    "email": "eve.holt@reqres.in",
                    "password": "cityslicka"
                };*!/

                this.axios
                    // .post('https://reqres.in/api/login', this.user)
                    // .post('https://reqres.in/api/login', this.user)
                    .post('http://192.168.78.69:9999/api/v1/auth/login', this.user)
                    // .get('https://reqres.in/api/users?page=2')
                    .then(data => {
                        console.log(data)
                    })
                    .catch(error => {
                        console.log('error');
                        console.log(error)
                    })
                    .finally(() => {
                        console.log('finally');
                    });
            }*/

        },
    }
</script>


<style lang="scss">

</style>

