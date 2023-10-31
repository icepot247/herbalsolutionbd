<template>
    <div>
        <div id="layout-wrapper">
            <header id="page-topbar">
                <div class="navbar-header">
                    <div class="d-flex">
                        <!-- LOGO -->
                        <div class="navbar-brand-box ">
                            <a href="/home" class="logo logo-dark">
                                AVIS
                                <span class="logo-sm">
                                    <img src="assets/images/logo.svg" alt="" height="22">
                                </span>
                                <span class="logo-lg pr-3">
                                    <img src="assets/images/logo-light.png" alt="" height="17">
                                </span>
                            </a>

                            <a href="/home" class="logo logo-light">
                                <span class="logo-sm">
                                    <img src="assets/images/logo-light.svg" alt="" height="22">
                                </span>
                                <span class="logo-lg pr-3">
                                    <img src="assets/images/logo-light.png" alt="" height="22" style="height: 50px">
                                </span>
                            </a>
                        </div>

                        <button type="button" class="btn btn-sm px-3 font-size-16 header-item waves-effect"
                                id="vertical-menu-btn">
                            <i class="fa fa-fw fa-bars"></i>
                        </button>

                    </div>

                    <div class="d-flex flex-column text-center">
                        <h5 class="text-secondary m-0 p-0">{{userCenter}}</h5>
                        <p class="text-secondary m-0 p-0 ">{{address}}</p>
                    </div>

                    <div class="d-flex">
                        <div v-if="isNotification" @click="checkNotification()" class="dropdown d-inline-block">
                            <button  type="button" class="btn header-item noti-icon"
                                    id="page-header-notifications-dropdown" data-bs-toggle="dropdown"
                                    aria-haspopup="true" aria-expanded="false">
                                <i class="bx bx-bell " :class="((this.$store.getters.getNotifications !==null)? (this.$store.getters.getNotifications.totalPendingStatus>0) : false )?' bx-tada' : ''"></i>
                                <span v-if="(((this.$store.getters.getNotifications !==null)? (this.$store.getters.getNotifications.totalPendingStatus>0) : false ))" style="background-color: #f46a6a!important;top: -15px;right: 9px"
                                      class="badge bg-danger rounded-pill">{{this.$store.getters.getNotifications.totalPendingStatus}}</span>
                            </button>
                            <div v-if="(((this.$store.getters.getNotifications !==null)? !(this.$store.getters.getNotifications.totalPendingStatus>0) : false ))" class="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                                 aria-labelledby="page-header-notifications-dropdown">
                                <div class="p-3 border-bottom">
                                    <div class="row align-items-center">
<!--                                        <div class="col">-->
<!--                                            <h6 class="m-0" key="t-notifications"> Pending Workflow </h6>-->
<!--                                        </div>-->
<!--                                        <div class="col-auto">-->
<!--                                            <a href="/workflow-dashboard" class="small" key="t-view-all"> View-->
<!--                                                All</a>-->
<!--                                        </div>-->
                                    </div>
                                </div>
                                <div data-simplebar="init" style="max-height: 230px;">
                                    <div class="simplebar-wrapper" style="margin: 0px;">
                                        <div class="simplebar-height-auto-observer-wrapper">
                                            <div class="simplebar-height-auto-observer"></div>
                                        </div>
                                        <div class="simplebar-mask">
                                            <div class="simplebar-offset" style="right: 0px; bottom: 0px;">
                                                <div class="simplebar-content-wrapper"
                                                     style="height: auto; overflow: hidden;">
                                                    <div  class="simplebar-content" style="padding: 0px;">
                                                        <a  href="javascript: void(0);"
                                                           class="text-reset notification-item">
                                                            <div class="d-flex">

                                                                <div class="flex-grow-1 my-auto text-danger">
                                                                    <small class="my-auto" > THERE IS NO PENDING REQUEST TO SHOW</small>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="simplebar-placeholder" style="width: 0px; height: 0px;"></div>
                                    </div>
                                    <div class="simplebar-track simplebar-horizontal" style="visibility: hidden;">
                                        <div class="simplebar-scrollbar"
                                             style="transform: translate3d(0px, 0px, 0px); display: none;"></div>
                                    </div>
                                    <div class="simplebar-track simplebar-vertical" style="visibility: hidden;">
                                        <div class="simplebar-scrollbar"
                                             style="transform: translate3d(0px, 0px, 0px); display: none;"></div>
                                    </div>
                                </div>

                            </div>
                            <div v-if="(((this.$store.getters.getNotifications !==null)? (this.$store.getters.getNotifications.totalPendingStatus>0) : false ))" class="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                                 aria-labelledby="page-header-notifications-dropdown">
                                <div class="p-3 border-bottom">
                                    <div class="row align-items-center">
                                        <div class="col">
                                            <h6 class="m-0" key="t-notifications"> Pending Workflow </h6>
                                        </div>
                                        <div class="col-auto">
                                            <a href="/workflow-dashboard" class="small" key="t-view-all"> View
                                                All</a>
                                        </div>
                                    </div>
                                </div>
                                <div data-simplebar="init" style="max-height: 230px;">
                                    <div class="simplebar-wrapper" style="margin: 0px;">
                                        <div class="simplebar-height-auto-observer-wrapper">
                                            <div class="simplebar-height-auto-observer"></div>
                                        </div>
                                        <div class="simplebar-mask">
                                            <div class="simplebar-offset" style="right: 0px; bottom: 0px;">
                                                <div class="simplebar-content-wrapper"
                                                     style="height: auto; overflow: hidden;">
                                                    <div  class="simplebar-content" style="padding: 0px;">
                                                        <a v-for="(val,key) in this.$store.getters.getNotifications.workflowStatusDataList"  @click="redirectTo()" href="javascript: void(0);"
                                                           class="text-reset notification-item">
                                                            <div class="d-flex">
                                                                <div class="avatar-xs me-3">
                                                                    <span class="avatar-title bg-secondary rounded-circle font-size-16">
                                                                        <i class="bx bx-badge-check"></i>
                                                                    </span>
                                                                </div>
                                                                <div class="flex-grow-1 my-auto">
                                                                    <span class="my-auto" :key="'workflow_name_'+key">{{val.workFlowTypeName}} </span>
                                                                </div>
                                                                <div class="avatar-xs">
                                                                    <span class="avatar-title bg-success rounded-circle font-size-16">
                                                                       {{val.pendingStatusCount}}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="simplebar-placeholder" style="width: 0px; height: 0px;"></div>
                                    </div>
                                    <div class="simplebar-track simplebar-horizontal" style="visibility: hidden;">
                                        <div class="simplebar-scrollbar"
                                             style="transform: translate3d(0px, 0px, 0px); display: none;"></div>
                                    </div>
                                    <div class="simplebar-track simplebar-vertical" style="visibility: hidden;">
                                        <div class="simplebar-scrollbar"
                                             style="transform: translate3d(0px, 0px, 0px); display: none;"></div>
                                    </div>
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
                                <router-link to="/profile" class="dropdown-item"><i
                                        class="bx bx-user font-size-16 align-middle me-1"></i> <span key="t-profile">Profile</span>
                                </router-link>
                                <router-link target="_blank"
                                             v-if="user && user.hasOwnProperty('center_id') &&  user.center_id != null && $root.hasAccess( 'ScreenPage', 'add')"
                                             :to="'/screen?center_id='+user.center_id" class="dropdown-item"><i
                                        class="mdi mdi-monitor fa-xs font-size-16 align-middle me-1"></i> <span
                                        key="t-screen">Screen</span></router-link>
                                <div class="dropdown-divider"></div>
                                <router-link to="/logout" class="dropdown-item text-danger"><i
                                        class="bx bx-power-off font-size-16 align-middle me-1 text-danger"></i> <span
                                        key="t-logout">Logout</span></router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div class="vertical-menu">
                <div data-simplebar class="h-100">
                    <div id="sidebar-menu">
                        <ul class="metismenu list-unstyled" id="side-menu">
                            <li>
                                <router-link to="/home" class="waves-effect pl-1">
                                    <i class="bx bx-home"></i>
                                    <span key="t-maps">Home</span>
                                </router-link>
                            </li>

                            <li v-if="side_menu.length>0 && menu.childs.length>0" v-for="(menu, i) in side_menu">
                                <router-link :to="menu.main_menu_url" :class="[ menu.childs.length> 0?'has-arrow':'']"
                                             class="waves-effect pl-1">
                                    <i class="bx"
                                       :class="[ menu.main_menu_icon.length> 0?menu.main_menu_icon:'bx-chevron-right']"></i>
                                    <span key="t-maps">{{menu.main_menu_name}}</span>
                                </router-link>

                                <ul class="sub-menu" aria-expanded="false" v-if=" menu.childs.length>0">
                                    <li v-for="(submenu, j) in menu.childs" :class="(currentPath==submenu.menu_url)?'mm-active':''" v-if="submenu.part_menu_yn == 'N'">
                                        <router-link :to="submenu.menu_url" key="t-g-maps" class=" pl-3">
                                            <i class="bx"
                                               :class="[ submenu.menu_icon.length> 0?submenu.menu_icon:'bx-subdirectory-right']"></i>
                                            {{submenu.menu_name}}
                                        </router-link>
                                    </li>
                                </ul>

                            </li>
                        </ul>
                    </div>
                </div>
            </div>


            <slot/>
            <Footer/>
        </div>
        <!--        <slot/>-->
    </div>
</template>


<script>
    import Footer from "../components/common/Footer";
    import LocalStore from "../plugins/LocalStore";

    export default {
        name: 'defaultLayout',
        components: {Footer},
        data() {
            return {
                'side_menu': [],
                'user': null,
                'userName': '',
                'userAvatar': '',
                'userCenter': '',
                'userBranch': '',
                address: '',
                onlineCounter: 0,
                isNotification: false,
                totalPendingWorkflow: null,
                workflowStatusDataList: [],
                noApprovalPending: false,
                currentPath: window.location.pathname,
            }
        },
        created() {
            // console.log(this.side_menu)
            // this.side_menu = [{"main_menu_id":"1","main_menu_name":"Home","active_yn":"Y","sl_no":"1","menu_url":"\/home","menu_icon":"bx-home","visible_yn":"N","childs":[]},{"main_menu_id":"2","main_menu_name":"Setup","active_yn":"Y","sl_no":"2","menu_url":"#","menu_icon":"bx-cog","visible_yn":"N","childs":[{"menu_id":"2006","menu_name":"Vehicle Class Mapping","main_menu_id":"2","menu_url":"\/class-wise-item-mapping","permission_wise_yn":"N","active_yn":"Y","sl_no":"6","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"2007","menu_name":"Lane Type Mapping","main_menu_id":"2","menu_url":"\/lane-type-mapping","permission_wise_yn":"N","active_yn":"Y","sl_no":"10","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"2008","menu_name":"Sub Test Type","main_menu_id":"2","menu_url":"\/sub-test-type","permission_wise_yn":"N","active_yn":"Y","sl_no":"11","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"2001","menu_name":"Center","main_menu_id":"2","menu_url":"\/center","permission_wise_yn":"N","active_yn":"Y","sl_no":"1","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"2002","menu_name":"Booth","main_menu_id":"2","menu_url":"\/booth","permission_wise_yn":"N","active_yn":"Y","sl_no":"2","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"2003","menu_name":"Lane","main_menu_id":"2","menu_url":"\/lane","permission_wise_yn":"N","active_yn":"Y","sl_no":"3","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"2004","menu_name":"Device","main_menu_id":"2","menu_url":"\/device-setup","permission_wise_yn":"N","active_yn":"Y","sl_no":"4","menu_icon":"bx-subdirectory-right","visible_yn":"N"}]},{"main_menu_id":"3","main_menu_name":"User Management","active_yn":"Y","sl_no":"3","menu_url":"#","menu_icon":"bxs-user-detail","visible_yn":"N","childs":[{"menu_id":"3002","menu_name":"Users","main_menu_id":"3","menu_url":"\/users","permission_wise_yn":"N","active_yn":"Y","sl_no":"2","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"3003","menu_name":"Shifting","main_menu_id":"3","menu_url":"\/shift-management","permission_wise_yn":"N","active_yn":"Y","sl_no":"3","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"3001","menu_name":"Roles","main_menu_id":"3","menu_url":"\/roles","permission_wise_yn":"N","active_yn":"Y","sl_no":"1","menu_icon":"bx-subdirectory-right","visible_yn":"N"}]},{"main_menu_id":"4","main_menu_name":"Inspection","active_yn":"Y","sl_no":"4","menu_url":"#","menu_icon":"bx-bookmark-plus","visible_yn":"N","childs":[{"menu_id":"4002","menu_name":"Check Appointment","main_menu_id":"4","menu_url":"\/check-appointment","permission_wise_yn":"N","active_yn":"Y","sl_no":"2","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"4003","menu_name":"Results Publishing","main_menu_id":"4","menu_url":"\/results","permission_wise_yn":"N","active_yn":"Y","sl_no":"3","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"4004","menu_name":"Certification","main_menu_id":"4","menu_url":"\/certificates","permission_wise_yn":"N","active_yn":"Y","sl_no":"4","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"4005","menu_name":"Queue Cancellation","main_menu_id":"4","menu_url":"\/queue-cancel","permission_wise_yn":"N","active_yn":"Y","sl_no":"5","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"4001","menu_name":"New Appointment","main_menu_id":"4","menu_url":"\/new-appointment","permission_wise_yn":"N","active_yn":"Y","sl_no":"1","menu_icon":"bx-subdirectory-right","visible_yn":"N"}]},{"main_menu_id":"5","main_menu_name":"Inventory","active_yn":"Y","sl_no":"5","menu_url":"#","menu_icon":"bx-detail","visible_yn":"N","childs":[{"menu_id":"5001","menu_name":"Inventory Receive","main_menu_id":"5","menu_url":"\/inventory","permission_wise_yn":"N","active_yn":"Y","sl_no":"1","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"5002","menu_name":"Skip Page","main_menu_id":"5","menu_url":"\/pad","permission_wise_yn":"N","active_yn":"Y","sl_no":"2","menu_icon":"bx-subdirectory-right","visible_yn":"N"}]},{"main_menu_id":"6","main_menu_name":"Reports","active_yn":"Y","sl_no":"6","menu_url":"#","menu_icon":"bx-detail","visible_yn":"N","childs":[{"menu_id":"6001","menu_name":"Report-1","main_menu_id":"6","menu_url":"#","permission_wise_yn":"N","active_yn":"Y","sl_no":"1","menu_icon":"bx-subdirectory-right","visible_yn":"N"}]},{"main_menu_id":"7","main_menu_name":"Logs","active_yn":"Y","sl_no":"7","menu_url":"#","menu_icon":"bx-paint-roll","visible_yn":"N","childs":[{"menu_id":"7001","menu_name":"API Log","main_menu_id":"7","menu_url":"\/api-access-log","permission_wise_yn":"N","active_yn":"Y","sl_no":"1","menu_icon":"bx-subdirectory-right","visible_yn":"N"},{"menu_id":"7002","menu_name":"Activity Log","main_menu_id":"7","menu_url":"\/activity-log","permission_wise_yn":"N","active_yn":"Y","sl_no":"2","menu_icon":"bx-subdirectory-right","visible_yn":"N"}]}];
            // this.side_menu = [{"main_menu_id":"1","main_menu_name":"Home","active_yn":"Y","sl_no":"1","menu_url":"\/home","menu_icon":"bx-home","visible_yn":"N","childs":[]}];
            // this.getUserMenu();
            //check internet

        },
        mounted() {
            this.checkInternet();
            this.getUserData();
            this.getWorkflowNotification();
            this.checkNotification();
            setInterval(()=>{
                this.getWorkflowNotification();
            },600000)
            this.showNotification();
        },
        watch: {
            menuData(newCount, oldCount) {
                this.side_menu = newCount
            }
        },
        computed: {
            menuData() {
                return this.$store.getters.getMenu;
            }
        },
        methods: {
            getUserData() {
                var res = LocalStore.getStorage('user');
                if (res) {
                    this.user = res.data;
                    this.userName = res.data.name;
                    // this.userAvatar = process.env.MIX_BASE_URL+'/'+res.data.avatar;
                    // this.userAvatar = res.data.avatar;
                    if (res.data.avatar && res.data.avatar_type) {
                        this.userAvatar = res.data.avatar;
                    } else {
                        this.userAvatar = 'assets/images/users/no-photo.jpg';
                    }
                    this.userCenter = res.data.center_id != null ? res.data.center.center_name : '';
                    this.address = res.data.center_id != null ? res.data.center.location_address : '';

                    this.$store.dispatch("setMenu"); //set state in storage

                    this.side_menu = this.$store.getters.getMenu;

                    // console.log(this.$store.getters.getMenu)


                    // this.getUserMenu();
                }
                // console.log(this.user)
            },

            getUserMenu() {
                this.axios
                    .get(process.env.MIX_API_URL + '/access/menus/', {})
                    .then(response => {
                        this.side_menu = (response.data.status) ? response.data.data : [];
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                        this.side_menu = [];
                    })
                    .finally(() => {
                    });
            },

            checkInternet() {
                /*this.timeInterval = setInterval(()=>{
                    if(!navigator.onLine){
                        if(this.onlineCounter ==0){
                            Swal.fire({
                                title: 'No Internet!!',
                                icon: 'error',
                                text: "Please Check Your Internet Connection.",
                                showConfirmButton: false,
                                showCancelButton: false,
                                confirmButtonColor: '#d33',
                                cancelButtonColor: '#d33',
                                allowOutsideClick:false
                            }).then((result) => {
                                if (result.isConfirmed) {

                                }
                            });
                        }
                        this.onlineCounter = this.onlineCounter + 1;
                    }else{
                        this.onlineCounter = 0;
                        Swal.close();
                    }
                },10000);*/


            },
            redirectTo() {
                // this.$router.push({name: 'class-wise-item-mapping'});
                // this.$router.push({path:"/class-wise-item-mapping"});
                // this.$router.replace("/class-wise-item-mapping");
                window.location.href = "/workflow-dashboard"
            },
            getWorkflowNotification() {
                let res = LocalStore.getStorage('user');
                if(res){
                    this.$store.dispatch("setNotifications");
                    this.totalPendingWorkflow = (this.$store.getters.getNotifications !==null)?this.$store.getters.getNotifications.totalPendingStatus : null;
                    this.workflowStatusDataList =  (this.$store.getters.getNotifications !==null)? this.$store.getters.getNotifications.workflowStatusDataList :null;
                }

            },
            checkNotification(){
                let res = LocalStore.getStorage('user');
                if(res){

                    this.$store.dispatch("setNotifications");
                    this.totalPendingWorkflow = (this.$store.getters.getNotifications !==null)?this.$store.getters.getNotifications.totalPendingStatus : null;
                    this.workflowStatusDataList =  (this.$store.getters.getNotifications !==null)? this.$store.getters.getNotifications.workflowStatusDataList :null;
                    if(!(this.totalPendingWorkflow>0)){
                        this.noApprovalPending = true;
                    }else{
                        this.noApprovalPending = false;
                    }
                }

            },
            showNotification(){
                let res = LocalStore.getStorage('user');
                if(res){
                    this.isNotification =  (this.$store.getters.getUser.data.user_type_id == 6|| this.$store.getters.getUser.data.user_type_id ==9)
                }
            }
        }
    }
</script>
