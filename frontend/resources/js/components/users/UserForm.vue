<template>
    <div>

        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-12">
                        <div class="row">
                            <div class="col-xl-10 col-lg-12   col-md-12 col-sm-12">
                                <div class="row">
                                    <div class="col-md-4" v-if="(userTypeId==1&&showCenter)">
                                        <div class="mb-3">
                                            <label class="form-label required">Select Center <span
                                                    class="text-danger">*</span></label>
                                            <b-form-select :disabled="(this.user_id !==null)" class="form-select"
                                                           v-model="center_id" :options="centerList"
                                                           name="center_id">
                                                <template #first>
                                                    <b-form-select-option :value="null">-- Please select a Center --
                                                    </b-form-select-option>
                                                </template>
                                            </b-form-select>
                                            <ul v-if="v$.center_id.$error" class="parsley-errors-list filled">
                                                <li class="parsley-required">The field is required.</li>
                                            </ul>

                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label required">Select User Type <span
                                                    class="text-danger">*</span></label>
                                            <b-form-select :disabled="(this.user_id !==null)" class="form-select"
                                                           v-model="users_type_id"
                                                           name="users_type_id"
                                                           @change="checkUserType">
                                                <template #first>
                                                    <b-form-select-option :value="null">-- Please select a User Type
                                                        --
                                                    </b-form-select-option>
                                                    <b-form-select-option v-for="(val,key) in userTypeList" :key="key"
                                                                          :value="val.value" :disabled="!val.status"
                                                                          :class="(!val.status)?'text-mute':' font-weight-bold'">
                                                        {{val.text}}
                                                    </b-form-select-option>
                                                </template>
                                            </b-form-select>
                                            <ul v-if="v$.users_type_id.$error" class="parsley-errors-list filled">
                                                <li class="parsley-required">The field is required.</li>
                                            </ul>

                                        </div>
                                    </div>
                                    <!-- <div class="col-md-4" v-if="isHiddenU">
                                        <div class="mb-3">
                                            <b-form-group id="input-group-1" label="Login ID" >
                                                <b-form-input v-model="login_id" type="text" placeholder="Enter LOGIN ID" required></b-form-input>

                                                <ul v-if="v$.login_id.$error" class="parsley-errors-list filled">
                                                    <li class="parsley-required">The field is required.</li>
                                                </ul>
                                            </b-form-group>
                                        </div>
                                    </div> -->
                                    <div class="col-md-4" v-if="isHiddenU">
                                        <div class="mb-3">
                                            <label class="form-label required">Enter Password <span
                                                    class="text-danger">*</span>

                                                <span tabindex="0" v-b-tooltip.hover
                                                      title="Password must contain 8 or more characters with at least one number, one uppercase, one lowercase and one special character">
<!--                                                        <svg height="16" width="16" viewBox="0 0 16 16">-->
                                                    <!--                                                            <path fill="#02bfe7" d="M8 0c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM8.9 13h-2v-2h2v2zM11 8.1c-0.4 0.4-0.8 0.6-1.2 0.7-0.6 0.4-0.8 0.2-0.8 1.2h-2c0-2 1.2-2.6 2-3 0.3-0.1 0.5-0.2 0.7-0.4 0.1-0.1 0.3-0.3 0.1-0.7-0.2-0.5-0.8-1-1.7-1-1.4 0-1.6 1.2-1.7 1.5l-2-0.3c0.1-1.1 1-3.2 3.6-3.2 1.6 0 3 0.9 3.6 2.2 0.4 1.1 0.2 2.2-0.6 3z">-->
                                                    <!--                                                        </path>-->
                                                    <!--                                                        </svg>-->
                                                       <i class="fas fa-info-circle text-info"></i>
                                                    </span>
                                            </label>
                                            <!--                                            <b-form-input name="password"-->
                                            <!--                                                          autocomplete="off"-->
                                            <!--                                                          :type="fieldType" minlength="6"-->
                                            <!--                                                          @focus="changeFieldType"-->
                                            <!--                                                          :class="[(v$.password.$error)?'is-invalid':'']"-->
                                            <!--                                                          v-model="password"-->
                                            <!--                                                          placeholder="Enter Password" required></b-form-input>-->
                                            <div class="input-group auth-pass-inputgroup">
                                                <input v-model="password"
                                                       @focus="changeFieldType"
                                                       minlength="8"
                                                       :class="[(v$.password.$error)?'is-invalid':'']"
                                                       :type="(fieldType=='password')?fieldType:'text'"
                                                       class="form-control" placeholder="Enter Password">
                                                <button @click="changePasswordView" class="btn btn-light border"
                                                        type="button">
                                                    <i :class="(fieldType=='password')? 'mdi mdi-eye-outline' : 'mdi mdi-eye-off-outline' "></i>
                                                </button>
                                            </div>
                                            <ul v-if="v$.password.$error" class="parsley-errors-list filled">
                                                <li v-for="(value , key) in v$.password.$errors" :key="key"
                                                    class="parsley-required">{{value.$message}}
                                                </li>
                                            </ul>

                                        </div>
                                    </div>
                                    <div class="col-md-4" v-if="isBrtaEmp">
                                        <div class="mb-3">
                                            <label class="form-label required">BRTA Employee ID <span
                                                    class="text-danger">*</span></label>
                                            <b-form-input :disabled="(this.user_id !==null)" v-model="brta_employee_id"
                                                          type="text"
                                                          placeholder="Enter BRTA Employee ID" required></b-form-input>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label">Name <span class="text-danger">*</span></label>
                                            <b-form-input ref="name" v-model="name" type="text"
                                                          placeholder="Enter name" required></b-form-input>
                                            <ul v-if="v$.name.$error" class="parsley-errors-list filled">
                                                <li class="parsley-required">The field is required.</li>
                                            </ul>

                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label">Email address <span
                                                    class="text-danger">*</span></label>
                                            <b-form-input v-model="email" type="email"
                                                          placeholder="Enter email"></b-form-input>

                                            <ul v-if="v$.email.$error.email" class="parsley-errors-list filled">
                                                <li class="parsley-required">Valid Email is required.</li>
                                            </ul>
                                            <ul v-if="v$.email.$error" class="parsley-errors-list filled">
                                                <li class="parsley-required">Valid Email is required.</li>
                                            </ul>

                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label">Mobile Number <span
                                                    class="text-danger">*</span></label>

                                            <b-form-input v-model="mobile_no" type="text"
                                                          placeholder="Enter Mobile Number" maxlength="11"
                                                          @keypress="isNumber($event)"
                                                          minlength="11"
                                                          required></b-form-input>
                                            <!-- <ul v-if="!v$.mobile_no.minLength" class="parsley-errors-list filled">
                                               <li class="parsley-required">Mobile Number should be 11 digit.</li>
                                           </ul>
                                            <ul v-if="!v$.mobile_no.maxLength" class="parsley-errors-list filled">
                                               <li class="parsley-required">Mobile Number should be 11 digit.</li>
                                           </ul> -->
                                            <ul v-if="v$.mobile_no.$error" class="parsley-errors-list filled">
                                                <li v-for="(value , key) in v$.mobile_no.$errors" :key="key"
                                                    class="parsley-required">{{value.$message}}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label">Date of Birth</label>

                                            <b-form-input v-model="date_of_birth" type="date"
                                                          placeholder=""></b-form-input>

                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label">Enter NID <span
                                                    class="text-danger">*</span></label>

                                            <b-form-input v-model="nid" type="text"
                                                          placeholder="Enter NID Number"
                                                          @keypress="isNumber($event)"
                                                          maxlength="17" minlength="10" required>

                                            </b-form-input>
                                            <!--                                            <ul v-if="v$.nid.$error" class="parsley-errors-list filled">-->
                                            <!--                                                <li class="parsley-required">National ID 10/17 digit is required.</li>-->
                                            <!--                                            </ul>-->
                                            <ul v-if="v$.nid.$error" class="parsley-errors-list filled">
                                                <li v-for="(value , key) in v$.nid.$errors" :key="key"
                                                    class="parsley-required">{{value.$message}}
                                                </li>
                                            </ul>

                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label">User Status <span
                                                    class="text-danger">*</span></label>
                                            <b-form-select class="form-select"
                                                           :class="[(v$.status.$error)?'parsley-error':'']"
                                                           v-model="status" :options="statusOptions"
                                                           name="status"></b-form-select>
                                            <ul v-if="v$.status.$error" class="parsley-errors-list filled">
                                                <li class="parsley-required">User Status field is required.</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label">Division <span
                                                    class="text-danger">*</span></label>
                                            <b-form-select class="form-select" v-model="division"
                                                           :options="divisionList" @change="getDistrict()"
                                                           name="division">
                                                <template #first>
                                                    <b-form-select-option :value="null">-- Select Division
                                                        --
                                                    </b-form-select-option>
                                                </template>
                                            </b-form-select>
                                            <ul v-if="v$.division.$error"
                                                class="parsley-errors-list filled">
                                                <li class="parsley-required">The field is required.</li>
                                            </ul>

                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label">District <span
                                                    class="text-danger">*</span></label>
                                            <b-form-select class="form-select"
                                                           v-model="district" :options="districtList"
                                                           @change="getThana()"
                                                           name="district">
                                                <template #first>
                                                    <b-form-select-option :value="null">-- Select District
                                                        --
                                                    </b-form-select-option>
                                                </template>
                                            </b-form-select>

                                            <ul v-if="v$.district.$error"
                                                class="parsley-errors-list filled">
                                                <li class="parsley-required">The field is required.</li>
                                            </ul>

                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label">Thana <span
                                                    class="text-danger">*</span></label>
                                            <b-form-select class="form-select"
                                                           :class="[(v$.thana.$error)?'is-invalid':'']"
                                                           v-model="thana" :options="thanList" name="thana">
                                                <template #first>
                                                    <b-form-select-option :value="null">-- Select Thana --
                                                    </b-form-select-option>
                                                </template>
                                            </b-form-select>

                                            <ul v-if="v$.thana.$error" class="parsley-errors-list filled">
                                                <li class="parsley-required">The field is required.</li>
                                            </ul>

                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label">Address</label>
                                            <textarea class="form-control" v-model="address"
                                                      name="" cols="1" rows="1"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-2 col-lg-12 col-md-12 col-sm-12 d-flex flex-column mb-2">
                                <img refs="avater" :src="avater" alt="" class="img-thumbnail rounded-circle mx-auto"
                                     :style="{'width':'190px', 'height':'185px', 'object-fit':'cover'}">
                                <input type="file" ref="file" name="avater" v-on:change="uploadFile"
                                       class="form-control form-control-sm mt-4" id="formFileSm" accept="image/*">
                                <small class="font-size-13 mt-1">Hints: Only jpeg, jpg, png type image is allowed</small>
                                <ul v-if="v$.imageFileName.$error" class="parsley-errors-list filled">
                                    <li v-for="(value , key) in v$.imageFileName.$errors" :key="key"
                                        class="parsley-required">{{value.$message}}
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
                <div>
                    <button v-if="!isLoading"
                            :disabled="!(this.userTypeList.find(item=>item.value== users_type_id) ? this.userTypeList.find(item=>item.value== users_type_id).status : false)"
                            :class="(!(this.userTypeList.find(item=>item.value== users_type_id) ? this.userTypeList.find(item=>item.value== users_type_id).status : false))?'btn btn-secondary float-end' : ''"
                            class="btn btn-primary float-end"
                            type="button" @click="submitForm()">{{this.btnName}}
                    </button>
                    <button v-if="isLoading" class="btn btn-primary float-end" type="button">
                        <div class="spinner-border" style="height: 1rem !important; width: 1rem !important;">
                            <span class="visually-hidden">Processing...</span>
                        </div>
                    </button>
                    <button v-if="!isLoading" @click="resetForm" class="btn btn-danger mr-2 float-end"
                            type="button">Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import useVuelidate from '@vuelidate/core';
    import {required, minLength, maxLength, requiredIf, email, numeric, helpers} from '@vuelidate/validators';
    import LocalStore from "../../plugins/LocalStore";

    export default {
        name: 'CreateForm',
        props: ['formPage'],
        data() {
            return {
                isHiddenU: true,
                isBrtaEmp: false,
                centerList: [],
                userTypeList: [],
                divisionList: [],
                districtList: [],
                thanList: [],
                user_id: null,
                isValidPhoneNumber: true,
                isLoading: null,
                users_type_id: null,
                center_id: null,
                password: null,
                brta_employee_id: null,
                name: null,
                email: null,
                mobile_no: null,
                date_of_birth: null,
                nid: null,
                address: null,
                division: null,
                district: null,
                thana: null,
                avater: 'assets/images/users/no-photo.jpg',
                upavader: null,
                status: null,
                userTypeId: LocalStore.getStorage('user').data.user_type_id,
                user: null,
                statusOptions: [
                    {value: null, text: 'Please select an option'},
                    {value: 'Y', text: 'Active'},
                    {value: 'N', text: 'Inactive'},
                ],
                btnName: 'Save',
                imageFileName: null,
                showCenter: true,
                fieldType: "text",
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                users_type_id: {required},
                center_id: {required},
                password: {
                    required: requiredIf(() => {
                        return (this.user_id == null)
                    }),
                    minLength: (this.user_id == null) ? minLength(8) : false,
                    // containsUppercase: (this.user_id == null)?helpers.withMessage("Password must contain a upper case latter", function (value) {
                    //         return /[A-Z]/.test(value)
                    // }):false,
                    // containsLowercase:(this.user_id == null)?helpers.withMessage("Password must contain a upper case latter", function (value) {
                    //     return /[a-z]/.test(value)
                    // }):false,
                    // containsNumber:(this.user_id == null)?helpers.withMessage("Password must contain a upper case latter", function (value) {
                    //     return /[a-z]/.test(value)
                    // }):false,
                    // containsSpecial:(this.user_id == null)?helpers.withMessage("Password must contain a upper case latter", function (value) {
                    //     return /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(value)
                    // }):false,
                    isUpperLowerNumberSpecial: (this.password != '' && this.password !==null) ? helpers.withMessage("Password must contain 8 or more characters with at least one number, one uppercase, one lowercase and one special character", function (value) {
                        // return /(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[!\"#$%&'()*+,-./:;<=>?@\\[\\]^_`{|}~]).{8,}/.test(value)
                        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
                    }) : false,
                },
                // brta_employee_id: {required},
                name: {required},
                email: {required, email},
                mobile_no: {
                    required, numeric,
                    minLength: minLength(11),
                    maxLength: maxLength(11),
                    isValidNumber:helpers.withMessage("Mobile number is not valid", function (value) {
                        return /^(?:\+88|88)?(01[3-9]\d{8})$/.test(value)
                    })
                },
                // date_of_birth: {required},
                nid: {
                    required, numeric, minLength: minLength(10),
                    maxLength: maxLength(17)
                },
                // address: {required},
                division: {required},
                district: {required},
                thana: {required},
                // avater: {required},
                status: {required},
                imageFileName: {
                    isImage: (this.imageFileName !== null) ? helpers.withMessage("Only jpeg,png,gif type allowed", function () {
                        const fileType = this.imageFileName['type'];
                        const validImageTypes = ['image/jpeg', 'image/png'];
                        return validImageTypes.includes(fileType);
                    }) : false
                }

            }
        },
        created() {

        },
        watch: {
            formPage(newData, oldData) {
                this.getCenterList();
                if (newData) {
                    this.user_id = newData.user_id;
                    this.center_id = (newData.center_user) ? newData.center_user.center_info.center_id : null;
                    this.name = newData.name;
                    this.status = newData.active_yn;
                    this.mobile_no = newData.mobile_no;


                    this.email = newData.email;
                    this.brta_employee_id = newData.brta_employee_id;
                    this.date_of_birth = newData.dob;
                    this.nid = newData.nid;
                    this.address = newData.address_details;
                    this.division = newData.division_id;
                    this.district = newData.district_id;
                    this.users_type_id = newData.user_type_id;
                    //  this.center_id = newData.center_id;
                    this.thana = newData.thana_id;
                    if (newData.avatar) {
                        this.avater = newData.avatar;
                    } else {
                        this.avater = 'assets/images/users/no-photo.jpg';
                    }

                    this.getDistrict();
                    this.getThana();
                    this.getUserTypeList();
                    this.btnName = 'Update';
                    this.showCenter = (this.users_type_id == 9) ? false : true;
                    if (this.users_type_id == 6 || this.users_type_id == 9) {
                        this.isHiddenU = false;
                        this.isBrtaEmp = true;
                    } else {
                        this.isHiddenU = true;
                        this.isBrtaEmp = false;
                    }

                    this.$refs.name.focus();
                    this.$refs.avater;
                }
            }

        },
        mounted() {
            this.getUserTypeList();
            this.getDivision();
            this.getCenterList();
            this.user = this.$store.getters.getUser.data;
            this.userTypeId = this.$store.getters.getUser.data.user_type_id;
            if (this.userTypeId != 1) {
                this.center_id = this.user.center_id;
            }

        },
        methods: {
            getUserTypeList() {
                this.axios.get(process.env.MIX_API_URL + '/users/get-utype-by-id/' + this.userTypeId, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(response => {
                        const res = response.data;

                        if (res.status) {
                            //  console.log(res.data);
                            this.userTypeList = res.data;
                        }
                    })
                    .catch(error => {
                            this.$toastr.error(error.response.data.message);
                        }
                    )
                    .finally();
            },
            getCenterList() {
                this.axios.get(process.env.MIX_API_URL + '/common/center', {})
                    .then(response => {
                        const res = response.data;

                        if (res.status) {
                            this.centerList = res.data;
                        }
                    })
                    .catch(error => {
                            this.$toastr.error(error.response.data.message);
                        }
                    )
                    .finally();
            },
            getDivision() {
                this.axios
                    .get(process.env.MIX_API_URL + '/common/division', {})
                    .then(response => {
                        const res = response.data;
                        if (res.status) {
                            this.divisionList = res.data
                        }
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },
            getDistrict() {
                this.axios
                    .get(process.env.MIX_API_URL + '/common/district/' + this.division, {})
                    .then(response => {
                        const res = response.data;
                        if (res.status) {
                            this.districtList = res.data
                        }
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },
            checkUserType() {
                this.axios.get(process.env.MIX_API_URL + '/users/get-type/' + this.users_type_id, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(params => {
                            const res = params.data;

                            if (res.data.brta_emp_yn == 'Y') {
                                this.isHiddenU = false;
                                this.isBrtaEmp = true;
                            } else {
                                this.isHiddenU = true;
                                this.isBrtaEmp = false;
                            }

                        }
                    )
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });


            },
            getThana() {
                this.axios
                    .get(process.env.MIX_API_URL + '/common/thana/' + this.district, {})
                    .then(response => {
                        const res = response.data;
                        if (res.status) {
                            this.thanList = res.data
                        }
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },
            uploadFile(e) {
                //  this.avater = this.$avater.file.files[0];
                //console.log(e.target.files[0]);
                //return false;
                // let file = e.target.files[0];
                // this.avater = URL.createObjectURL(file);
                // this.upavader = e.target.files[0];

                this.imageFileName = e.target.files[0];
                this.avater = URL.createObjectURL(this.imageFileName);
                this.upavader = e.target.files[0];
                //console.log(createObjectURL(file));

            },
            async submitForm() {
                if (await this.v$.$validate()) {
                    this.isLoading = true;
                    const params = {
                        user_type_id: this.users_type_id,
                        center_id: this.center_id,
                        password: this.password,
                        brta_employee_id: this.brta_employee_id,
                        name: this.name,
                        email: this.email,
                        moblie_no: this.mobile_no,
                        date_of_birth: this.date_of_birth,
                        nid: this.nid,
                        active_yn: this.status,
                        address: this.address,
                        division_id: this.division,
                        district_id: this.district,
                        thana_id: this.thana,
                        avater: this.upavader,
                        user_id: this.user_id

                    };
                    //return false;
                    const headers = {'content-type': 'multipart/form-data'};

                    // if (this.user_id) {
                    //     const new_header = {
                    //         headers: { 'content-type': 'multipart/form-data' }
                    //     };
                    //     var axiosObj = this.axios.post(process.env.MIX_API_URL + '/users/creates/' + this.user_id,{params: params, headers: new_header})
                    // } else {
                    var axiosObj = this.axios.post(process.env.MIX_API_URL + '/users/create', params, {headers: headers})
                    // }
                    axiosObj.then(response => {
                        var data = response.data;
                        if (data.status) {
                            this.$toastr.success(data.message);
                            this.isLoading = false;
                            this.resetForm()
                            this.sendToTable(data);
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
                            //console.log('Loading off');
                            this.isLoading = false;
                        });
                }
            },
            resetForm() {
                this.v$.$reset()
                this.name = null;
                this.email = null;
                this.user_id = null;
                this.center_id = this.user.center_id;
                if (this.userTypeId == 1) {
                    this.center_id = null;
                }

                this.users_type_id = null;
                this.mobile_no = null;
                this.nid = null;
                this.date_of_birth = null;
                this.address = null;
                this.division = null;
                this.district = null;
                this.thana = null;
                this.brta_employee_id = null;
                this.status = null;
                this.upavater = null;
                this.avater = '';
                // this.login_id = null;
                this.avater = 'assets/images/users/no-photo.jpg',
                    this.password = null;
                //  this.avater = null;
                this.btnName = 'Save';
                this.resetTitle();
                this.$refs.file.value = ""; //remove file name from input field
                this.fieldType = "text";
            },
            sendToTable(data) {
                this.$emit('formUpdated', data);
            },
            resetTitle() {
                this.$emit('resetPageTitle', true)
            },
            changeFieldType() {
                this.fieldType = "password";
            },
            changePasswordView() {
                this.fieldType = (this.fieldType == "password") ? "text" : "password";
            },
            isNumber(evt) {
                evt = (evt) ? evt : window.event;
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
                    evt.preventDefault();
                } else {
                    return true;
                }
            },

        }
    }
</script>

