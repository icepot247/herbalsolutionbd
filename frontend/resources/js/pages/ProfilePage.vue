<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb :title="pageTitle"/>
                    <div class="row">
                        <div class="col-md-3">
                            <div class="card">
                                <div class="card-body">
                                    <div class="d-flex flex-column align-items-center text-center">
                                        <img class="img-thumbnail rounded-circle avatar-xl" :src="avatar">
                                        <div class="mt-3"><h4>{{name}}</h4>
                                            <p class="text-secondary mb-1">{{username}}</p>
                                            <p class="text-muted font-size-sm">{{userType}}</p>
                                            <a href="/avis/home" class="btn btn-outline-success">Home</a>
                                            <a href="/avis/logout" class="btn btn-outline-danger">Logout</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-9">
                            <div class="card" style="min-height: 320px">
                                <div class="card-body">
                                    <div class="row">
                                        <p class="h6 col-md-12 pb-2 border-bottom">Basic Information</p>

                                        <div class="col-12" v-if="name">
                                            <div class="row">
                                                <label class="col-sm-2 mt-2">Name </label>
                                                <label class="col-sm-1 mt-2 d-none d-sm-block">: </label>
                                                <div class="col-sm-9 mt-2">
                                                    <p>{{name}}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12" v-if="email">
                                            <div class="row">
                                                <label class="col-sm-2 mt-2">Email </label>
                                                <label class="col-sm-1 mt-2 d-none d-sm-block">: </label>
                                                <div class="col-sm-9 mt-2">
                                                    <p>{{email}}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-12" v-if="(status=='Y')">
                                            <div class="row">
                                                <label class="col-sm-2 mt-2">Status </label>
                                                <label class="col-sm-1 mt-2 d-none d-sm-block">: </label>
                                                <div class="col-sm-9 mt-2">
                                                    <p>{{((status=='Y')?'Active':'Inactive')}}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12" v-if="userType">
                                            <div class="row">
                                                <label class="col-sm-2 mt-2">User Type </label>
                                                <label class="col-sm-1 mt-2 d-none d-sm-block">: </label>
                                                <div class="col-sm-9 mt-2">
                                                    <p>{{userType}}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-12" v-if="username">
                                            <div class="row">
                                                <label class="col-sm-2 mt-2">Username </label>
                                                <label class="col-sm-1 mt-2 d-none d-sm-block">: </label>
                                                <div class="col-sm-9 mt-2">
                                                    <p>{{username}}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="userTypeId != 6" class="col-md-3">
                            <div class="card">
                                <div class="card-body">
                                    <div class="row">
                                        <p class="h6 pb-2 border-bottom">Change Password</p>
                                        <form action="">
                                            <div class="mb-1">
                                                <label class="form-label mt-2">Old Password </label>
                                                <div class="input-group auth-pass-inputgroup">
                                                    <input v-model="oldPassword"
                                                           :class="[(v$.oldPassword.$error)?'is-invalid':'']"
                                                           :type="(passType[0]!=null)?passType[0]:'password'"
                                                           class="form-control" placeholder="Old Password">
                                                    <button @click="changePassType(0)"  class="btn btn-light border" type="button">
                                                        <i :class="(passType[0]==null)?'mdi mdi-eye-outline': (passType[0]=='password')? 'mdi mdi-eye-outline' : 'mdi mdi-eye-off-outline' "></i></button>
                                                </div>
                                                <ul v-if="v$.oldPassword.$error" class="parsley-errors-list filled">
                                                    <li class="parsley-required">The field is required.</li>
                                                </ul>
                                            </div>
                                            <div class="mb-1">
                                                <label class="form-label">New Password :</label>
                                                <div class="input-group auth-pass-inputgroup">
                                                    <input v-model="password"
                                                           :class="[(v$.password.$error)?'is-invalid':'']"
                                                           :type="(passType[1]!=null)?passType[1]:'password'"
                                                           class="form-control" placeholder="New Password">
                                                    <button  @click="changePassType(1)"   class="btn btn-light  border" type="button">
                                                        <i :class="(passType[1]==null)?'mdi mdi-eye-outline': (passType[1]=='password')? 'mdi mdi-eye-outline' : 'mdi mdi-eye-off-outline' " ></i></button>
                                                </div>
<!--                                                <ul v-if="v$.password.$error" class="parsley-errors-list filled">-->
<!--                                                    <li v-if="v$.password.$error && v$.password.required.$invalid"-->
<!--                                                        class="parsley-required">The field is required.-->
<!--                                                    </li>-->
<!--                                                    <li v-if="v$.password.$error && v$.password.minLength.$invalid"-->
<!--                                                        class="parsley-required">Password should be at least-->
<!--                                                        {{v$.password.minLength.$params.min}} characters long-->
<!--                                                    </li>-->
<!--                                                </ul>-->
                                                <ul v-if="v$.password.$error" class="parsley-errors-list filled">
                                                    <li v-for="(value , key) in v$.password.$errors" :key="key"
                                                        class="parsley-required">{{value.$message}}
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="mb-1">
                                                <label class="form-label ">Retype Password :</label>
                                                <div class="input-group auth-pass-inputgroup">
                                                    <input v-model="retypePassword"
                                                           :class="[(v$.retypePassword.$error)?'is-invalid':'']"
                                                           :type="(passType[2]!=null)?passType[2]:'password'"
                                                           class="form-control" placeholder="Retype Password">
                                                    <button  @click="changePassType(2)" class="btn btn-light  border" type="button">
                                                        <i :class="(passType[2]==null)?'mdi mdi-eye-outline': (passType[2]=='password')? 'mdi mdi-eye-outline' : 'mdi mdi-eye-off-outline' " ></i></button>
                                                </div>
<!--                                                <ul v-if="v$.retypePassword.$error" class="parsley-errors-list filled">-->
<!--                                                    <li v-if="v$.retypePassword.$error && v$.retypePassword.sameAsPassword.$invalid"-->
<!--                                                        class="parsley-required">Password Didn't Match!-->
<!--                                                    </li>-->
<!--                                                </ul>-->
                                                <ul v-if="v$.retypePassword.$error" class="parsley-errors-list filled">
                                                    <li v-for="(value , key) in v$.retypePassword.$errors" :key="key"
                                                        class="parsley-required">{{value.$message}}
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="mb-1 mt-2">
                                                <button type="button" @click="changePassword" class=" btn btn-primary mt-2 float-end">
                                                    Update
                                                </button>
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="userTypeId != 6" class="col-md-9">
                            <div class="card" v-if="counter_id" style="min-height: 353px">
                                <div class="card-body">
                                    <div class="row">
                                        <p class="h6 col-md-12 pb-2 border-bottom">Additional Information</p>
                                        <div class="col-12" v-if="centerName">
                                            <div class="row">
                                                <label class="col-sm-2 mt-2">Center </label>
                                                <label class="col-sm-1 mt-2 d-none d-sm-block">: </label>
                                                <div class="col-sm-9 mt-2">
                                                    <p>{{centerName}}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12" v-if="boothName">
                                            <div class="row">
                                                <label class="col-sm-2 mt-2">Booth </label>
                                                <label class="col-sm-1 mt-2 d-none d-sm-block">: </label>
                                                <div class="col-sm-9 mt-2">
                                                    <p>{{boothName}}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12" v-if="counterNo">
                                            <div class="row">
                                                <label class="col-sm-2 mt-2">Counter No. </label>
                                                <label class="col-sm-1 mt-2 d-none d-sm-block">: </label>
                                                <div class="col-sm-9 mt-2">
                                                    <p>{{counterNo}}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12" v-if="laneNo">
                                            <div class="row">
                                                <label class="col-sm-2 mt-2">Lane No. </label>
                                                <label class="col-sm-1 mt-2 d-none d-sm-block">: </label>
                                                <div class="col-sm-9 mt-2">
                                                    <p>{{laneNo}}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12" v-if="slot">
                                            <div class="row">
                                                <label class="col-sm-2 mt-2">Shift Slot</label>
                                                <label class="col-sm-1 mt-2 d-none d-sm-block">: </label>
                                                <div class="col-sm-9 mt-2">
                                                    <p>{{slot}}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Breadcrumb from "../components/common/Breadcrumb";
    import DefaultLayout from "../layouts/DefaultLayout";
    import useVuelidate from "@vuelidate/core";
    import {required, sameAs, minLength, helpers} from "@vuelidate/validators";
    import {dateTimeFormatterMixin} from "../mixins/dateTimeFormatterMixin";
    export default {
        name: "ProfilePage",
        components: {Breadcrumb},
        mixins: [dateTimeFormatterMixin],
        data() {
            return {
                pageTitle: 'Profile',
                formData: [],
                sendToForm: [],
                avatar: 'assets/images/users/no-photo.jpg',
                name: null,
                username: null,
                email: null,
                status: null,
                userType: null,
                centerName: null,
                boothName: null,
                counterNo: null,
                laneNo: null,
                slot: null,
                oldPassword: null,
                password: null,
                retypePassword: null,
                passMatched: null,
                counter_id: null,
                userTypeId: null,
                passType: [],
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                oldPassword: {required},
                password: {
                    required,
                    minLength: minLength(8),
                    isUpperLowerNumberSpecial:(this.oldPassword !== null)?helpers.withMessage("Password must contain 8 or more characters with at least one number, one uppercase, one lowercase and one special character", function (value) {
                        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
                    }):false,
                },
                retypePassword: {
                    sameAsPassword: sameAs(this.password),
                    isUpperLowerNumberSpecial:(this.password !== null)?helpers.withMessage("Password must contain 8 or more characters with at least one number, one uppercase, one lowercase and one special character", function (value) {
                        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
                    }):false,
                },
            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {
            this.getUserDetails();
        },
        methods: {
            getUserDetails() {
                this.counter_id = (this.$store.getters.getUser.data.center_id) ? this.$store.getters.getUser.data.center_id : null;
                this.avatar = (this.$store.getters.getUser.data.avatar && this.$store.getters.getUser.data.avatar_type) ?  this.$store.getters.getUser.data.avatar : this.avatar;
                this.name = (this.$store.getters.getUser.data.name) ? this.$store.getters.getUser.data.name : null;
                this.username = (this.$store.getters.getUser.data.username) ? this.$store.getters.getUser.data.username : null;
                this.email = (this.$store.getters.getUser.data.email) ? this.$store.getters.getUser.data.email : null;
                this.status = (this.$store.getters.getUser.data.active_yn) ? this.$store.getters.getUser.data.active_yn : null;
                this.userType = (this.$store.getters.getUser.data.user_type) ? this.$store.getters.getUser.data.user_type : null;
                this.centerName = (this.$store.getters.getUser.data.center) ? this.$store.getters.getUser.data.center.center_name : null;
                this.laneNo = (this.$store.getters.getUser.data.lane) ? this.$store.getters.getUser.data.lane.lane_no : null;
                this.boothName = (this.$store.getters.getUser.data.booth) ? this.$store.getters.getUser.data.booth.booth_name : null;
                this.counterNo = (this.$store.getters.getUser.data.counter) ? this.$store.getters.getUser.data.counter.counter_no : null;
                this.slot = (this.$store.getters.getUser.data.shift) ? (this.mixinFormatTime(this.$store.getters.getUser.data.shift.shift_start) + '-' + this.mixinFormatTime(this.$store.getters.getUser.data.shift.shift_end)) : null;
                this.userTypeId = (this.$store.getters.getUser.data.user_type_id) ? this.$store.getters.getUser.data.user_type_id : null;

            },
            changePassword() {
                this.v$.$validate()
                if (!this.v$.retypePassword.$error && !this.v$.password.$error) {
                    Swal.fire({
                        title: 'Are you sure ?',
                        icon: 'warning',
                        showCancelButton: true,
                        cancelButtonText: 'Close',
                        cancelButtonColor: '#dd3333',
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#007bff',

                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.isLoading = true;
                            const params = {
                                p_old_password: this.oldPassword,
                                p_new_password: this.password,
                            };
                            this.axios.post(process.env.MIX_API_URL + '/users/change-password', params)
                                .then(response => {
                                    if(response.data.status){
                                        this.$toastr.success(response.data.message);
                                        this.resetForm();
                                        setInterval(()=>{
                                            window.location.href = 'logout'
                                        },3000)
                                    }else{
                                        this.$toastr.error(response.data.message)
                                    }
                                    this.isLoading = false;
                                })
                                .catch(error => {
                                    this.isLoading = false;
                                    this.$toastr.error(error.response.data.message);
                                })
                                .finally(() => {
                                    this.isLoading = false;
                                });
                        }
                    });
                }
            },
            resetForm() {
                this.v$.$reset();
                this.oldPassword = null;
                this.password = null;
                this.retypePassword = null;
            },
            changePassType(index){
                this.passType[index] = (this.passType[index] == 'text')? 'password' : 'text';
                this.$forceUpdate();
            }
        }
    }
</script>
