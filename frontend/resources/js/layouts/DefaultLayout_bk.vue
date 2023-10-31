<template>
    <div>
        <div id="layout-wrapper">
            <header id="page-topbar">
                <div class="navbar-header">
                    <div class="d-flex">
                        <!-- LOGO -->
                        <div class="navbar-brand-box">
                            <a href="#" class="logo logo-dark">
                                AVIS
                                <span class="logo-sm">
                                    <img src="assets/images/logo.svg" alt="" height="22">
                                </span>
                                <span class="logo-lg">
                                    <img src="assets/images/logo-light.png" alt="" height="17">
                                </span>
                            </a>

                            <a href="#" class="logo logo-light">
                                <span class="logo-sm">
                                    <img src="assets/images/logo-light.svg" alt="" height="22">
                                </span>
                                <span class="logo-lg">
                                    <img src="assets/images/logo-light.png" alt="" height="22" style="height: 50px">
                                </span>
                            </a>
                        </div>

                        <button type="button" class="btn btn-sm px-3 font-size-16 header-item waves-effect" id="vertical-menu-btn">
                            <i class="fa fa-fw fa-bars"></i>
                        </button>

                    </div>

                    <div class="d-flex flex-column text-center">
                        <h5 class="text-secondary m-0 p-0">{{userCenter}}</h5>
<!--                        <p class="text-dark m-0 p-0">Branch Name</p>-->
                    </div>

                    <div class="d-flex" >
                        <div class="dropdown d-inline-block" style="display: none !important;">
                            <button type="button" class="btn header-item noti-icon waves-effect" id="page-header-notifications-dropdown"
                                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="bx bx-bell bx-tada"></i>
                                <span class="badge bg-danger rounded-pill">1</span>
                            </button>
                            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                                 aria-labelledby="page-header-notifications-dropdown">
                                <div class="p-3">
                                    <div class="row align-items-center">
                                        <div class="col">
                                            <h6 class="m-0" key="t-notifications"> Notifications </h6>
                                        </div>
                                        <div class="col-auto">
                                            <a href="#" class="small" key="t-view-all"> View All</a>
                                        </div>
                                    </div>
                                </div>
                                <div data-simplebar style="max-height: 230px;">
                                    <a href="javascript: void(0);" class="text-reset notification-item">
                                        <div class="d-flex">
                                            <div class="avatar-xs me-3">
                                                <span class="avatar-title bg-primary rounded-circle font-size-16">
                                                    <i class="bx bx-bell bx-tada"></i>
                                                </span>
                                            </div>
                                            <div class="flex-grow-1">
                                                <h6 class="mb-1" key="t-your-order">Your notification title</h6>
                                                <div class="font-size-12 text-muted">
                                                    <p class="mb-1" key="t-grammer">Notification details</p>
                                                    <p class="mb-0"><i class="mdi mdi-clock-outline"></i> <span key="t-min-ago">11:15PM 25/02/2022</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="p-2 border-top d-grid">
                                    <a class="btn btn-sm btn-link font-size-14 text-center" href="javascript:void(0)">
                                        <i class="mdi mdi-arrow-right-circle me-1"></i> <span key="t-view-more">View More..</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div class="dropdown d-inline-block">
                            <button type="button" class="btn header-item waves-effect" id="page-header-user-dropdown"
                                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img class="rounded-circle header-profile-user" :src="userAvatar"
                                     alt="Header Avatar">
                                <span class="d-none d-xl-inline-block ms-1" key="t-henry">{{userName}}</span>
                                <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
                            </button>
                            <div class="dropdown-menu dropdown-menu-end">
                                <!-- item-->
                                <router-link to="/profile"  class="dropdown-item"> <i class="bx bx-user font-size-16 align-middle me-1"></i> <span key="t-profile">Profile</span></router-link>
                                <div class="dropdown-divider"></div>
                                <router-link to="/logout" class="dropdown-item text-danger"><i class="bx bx-power-off font-size-16 align-middle me-1 text-danger"></i> <span key="t-logout">Logout</span></router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div class="vertical-menu">
                <div data-simplebar class="h-100">
                    <div id="sidebar-menu">
                        <ul class="metismenu list-unstyled" id="side-menu">
                            <li v-if="side_menu.length>0"  v-for="(menu, i) in side_menu">
                                <router-link :to="menu.menu_url" :class="[ menu.childs.length> 0?'has-arrow':'']" class="waves-effect">
                                    <i  class="bx" :class="[ menu.menu_icon.length> 0?menu.menu_icon:'bx-chevron-right']"></i>
                                    <span key="t-maps">{{menu.main_menu_name}}</span>
                                </router-link>

                                <ul class="sub-menu" aria-expanded="false" v-if=" menu.childs.length>0">
                                    <li v-for="(submenu, j) in menu.childs" v-if="submenu.part_menu_yn == 'N'">
                                        <router-link :to="submenu.menu_url"  key="t-g-maps">
                                            <i class="bx" :class="[ submenu.menu_icon.length> 0?submenu.menu_icon:'bx-subdirectory-right']"></i>
                                            {{submenu.menu_name}}
                                        </router-link>
                                    </li>
                                </ul>

                            </li>
                        </ul>
                    </div>
                </div>
            </div>




            <slot />
            <Footer/>
        </div>
<!--        <slot/>-->
    </div>
</template>


<script>
    import Footer from "../components/common/Footer";
    import LocalStore from "../plugins/LocalStore";
    export default {
        name:'defaultLayout',
        components: {Footer},

        data(){
            return {
                'side_menu':[],
                'user':null,
                'userName':'',
                'userAvatar':'',
                'userCenter':'',
                'userBranch':'',
            }
        },
        created() {
            // console.log(this.side_menu)
            // this.side_menu = [{"main_menu_id":"1","main_menu_name":"Home","active_yn":"Y","sl_no":"1","menu_url":"\/home","menu_icon":"bx-home","visible_yn":"N","childs":[]},{"main_menu_id":"2","main_menu_name":"Setup","active_yn":"Y","sl_no":"2","menu_url":"#","menu_icon":"bx-cog","visible_yn":"N","childs":[{"menu_id":"2006","menu_name":"Vehicle Class Mapping","main_menu_id":"2","menu_url":"\/class-wise-item-mapping","permission_wise_yn":"N","active_yn":"Y","sl_no":"6","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"2007","menu_name":"Lane Type Mapping","main_menu_id":"2","menu_url":"\/lane-type-mapping","permission_wise_yn":"N","active_yn":"Y","sl_no":"10","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"2008","menu_name":"Sub Test Type","main_menu_id":"2","menu_url":"\/sub-test-type","permission_wise_yn":"N","active_yn":"Y","sl_no":"11","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"2001","menu_name":"Center","main_menu_id":"2","menu_url":"\/center","permission_wise_yn":"N","active_yn":"Y","sl_no":"1","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"2002","menu_name":"Booth","main_menu_id":"2","menu_url":"\/booth","permission_wise_yn":"N","active_yn":"Y","sl_no":"2","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"2003","menu_name":"Lane","main_menu_id":"2","menu_url":"\/lane","permission_wise_yn":"N","active_yn":"Y","sl_no":"3","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"2004","menu_name":"Device","main_menu_id":"2","menu_url":"\/device-setup","permission_wise_yn":"N","active_yn":"Y","sl_no":"4","menu_icon":"bx-subdirectory-right","visible_yn":"N"}]},{"main_menu_id":"3","main_menu_name":"User Management","active_yn":"Y","sl_no":"3","menu_url":"#","menu_icon":"bxs-user-detail","visible_yn":"N","childs":[{"menu_id":"3002","menu_name":"Users","main_menu_id":"3","menu_url":"\/users","permission_wise_yn":"N","active_yn":"Y","sl_no":"2","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"3003","menu_name":"Shifting","main_menu_id":"3","menu_url":"\/shift-management","permission_wise_yn":"N","active_yn":"Y","sl_no":"3","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"3001","menu_name":"Roles","main_menu_id":"3","menu_url":"\/roles","permission_wise_yn":"N","active_yn":"Y","sl_no":"1","menu_icon":"bx-subdirectory-right","visible_yn":"N"}]},{"main_menu_id":"4","main_menu_name":"Inspection","active_yn":"Y","sl_no":"4","menu_url":"#","menu_icon":"bx-bookmark-plus","visible_yn":"N","childs":[{"menu_id":"4002","menu_name":"Check Appointment","main_menu_id":"4","menu_url":"\/check-appointment","permission_wise_yn":"N","active_yn":"Y","sl_no":"2","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"4003","menu_name":"Results Publishing","main_menu_id":"4","menu_url":"\/results","permission_wise_yn":"N","active_yn":"Y","sl_no":"3","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"4004","menu_name":"Certification","main_menu_id":"4","menu_url":"\/certificates","permission_wise_yn":"N","active_yn":"Y","sl_no":"4","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"4005","menu_name":"Queue Cancellation","main_menu_id":"4","menu_url":"\/queue-cancel","permission_wise_yn":"N","active_yn":"Y","sl_no":"5","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"4001","menu_name":"New Appointment","main_menu_id":"4","menu_url":"\/new-appointment","permission_wise_yn":"N","active_yn":"Y","sl_no":"1","menu_icon":"bx-subdirectory-right","visible_yn":"N"}]},{"main_menu_id":"5","main_menu_name":"Inventory","active_yn":"Y","sl_no":"5","menu_url":"#","menu_icon":"bx-detail","visible_yn":"N","childs":[{"menu_id":"5001","menu_name":"Inventory Receive","main_menu_id":"5","menu_url":"\/inventory","permission_wise_yn":"N","active_yn":"Y","sl_no":"1","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"5002","menu_name":"Skip Page","main_menu_id":"5","menu_url":"\/pad","permission_wise_yn":"N","active_yn":"Y","sl_no":"2","menu_icon":"bx-subdirectory-right","visible_yn":"N"}]},{"main_menu_id":"6","main_menu_name":"Reports","active_yn":"Y","sl_no":"6","menu_url":"#","menu_icon":"bx-detail","visible_yn":"N","childs":[{"menu_id":"6001","menu_name":"Report-1","main_menu_id":"6","menu_url":"#","permission_wise_yn":"N","active_yn":"Y","sl_no":"1","menu_icon":"bx-subdirectory-right","visible_yn":"N"}]},{"main_menu_id":"7","main_menu_name":"Logs","active_yn":"Y","sl_no":"7","menu_url":"#","menu_icon":"bx-paint-roll","visible_yn":"N","childs":[{"menu_id":"7001","menu_name":"API Log","main_menu_id":"7","menu_url":"\/api-access-log","permission_wise_yn":"N","active_yn":"Y","sl_no":"1","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"7002","menu_name":"Activity Log","main_menu_id":"7","menu_url":"\/activity-log","permission_wise_yn":"N","active_yn":"Y","sl_no":"2","menu_icon":"bx-subdirectory-right","visible_yn":"N"}]}];
            // this.side_menu = [{"main_menu_id":"1","main_menu_name":"Home","active_yn":"Y","sl_no":"1","menu_url":"\/home","menu_icon":"bx-home","visible_yn":"N","childs":[]}];
            // this.getUserMenu();
        },
        mounted() {
            this.getUserData()
        },
        watch:{
            menuData(newCount, oldCount){
                this.side_menu =newCount
            }
        },
        computed:{
            menuData(){
               return this.$store.getters.getMenu;
            }
        },
        methods: {
            getUserData(){
               var res = LocalStore.getStorage('user');
               if(res){
                   this.user = res.data;
                   this.userName = res.data.name;
                   this.userAvatar = res.data.avatar;
                   this.userCenter = res.data.center_id != null?res.data.center.center_name:'';

                   this.$store.dispatch("setMenu"); //set state in storage
                   this.side_menu =this.$store.getters.getMenu;

                   // console.log(this.$store.getters.getMenu)


                   // this.getUserMenu();
               }
                // console.log(this.user)
            },

            getUserMenu() {
                this.axios
                    .get(process.env.MIX_API_URL + '/access/menus/', {})
                    .then(response => {
                        this.side_menu = (response.data.status)?response.data.data:[];
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                        this.side_menu =[];
                    })
                    .finally(() => {
                    });
            },
        }
    }
</script>
