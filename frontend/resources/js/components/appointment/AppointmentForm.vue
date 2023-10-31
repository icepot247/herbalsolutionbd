<template>
    <div class="card">
        <div class="card-body">
            <div class="row">

                <div class="col-xl-12 align-items-center justify-content-center">
                    <div>
                        <div class="row mb-3 justify-content-center">
                            <label for="registration_number" class="col-md-2 col-form-label">Registration Number</label>
                            <div class="col-md-4 p-0">
<!--                                <input type="text" class="form-control p-2"-->
<!--                                       v-model="registration_number" name="registration_number"-->
<!--                                       :class="[(v$.registration_number.$error)?'is-invalid':'']"-->
<!--                                       id="registration_number" @blur="searchForm()">-->
<!--                                <ul v-if="v$.registration_number.$error" class="parsley-errors-list filled">-->
<!--                                    <li class="parsley-required">Registration Number is required.</li>-->
<!--                                </ul>-->
                                <div class="input-group">
                                    <input  class="form-control"
                                            placeholder="Please type 4/6 digit Registration Number"
                                            v-model="reg_no"
                                            :class="[(v$.reg_no.$error)?'is-invalid':'']"
                                            id="registration_number"
                                            @copy.prevent
                                            @paste.prevent
                                            @keypress="isNumber($event)"
                                            type="number">
                                    <div class="input-group-append">
                                        <button :disabled="v$.reg_no.$invalid" v-if="!isLoading" v-b-tooltip.hover title="search" type="button"
                                                class="btn btn-primary btn-sm"
                                                @click="registrationSearch()">
                                            <i class="fas fa-search "></i>
                                        </button>
                                        <button v-if="isLoading" class="btn btn-outline-primary float-end" type="button">
                                            <div class="spinner-border"
                                                 style="height: 1rem !important; width: 1rem !important;">
                                                <span class="visually-hidden">Processing...</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <ul v-if="v$.reg_no.$invalid && (v$.reg_no.$model !==''&&v$.reg_no.$model !=null)" class="parsley-errors-list filled">
                                    <li v-if="v$.reg_no.required.$invalid" class="parsley-required">{{v$.reg_no.required.$message}}</li>
                                    <li v-if="v$.reg_no.minLength.$invalid" class="parsley-required">{{v$.reg_no.minLength.$message}}</li>
                                    <li v-if="v$.reg_no.maxLength.$invalid" class="parsley-required">{{v$.reg_no.maxLength.$message}}</li>
                                </ul>
                            </div>

                        </div>
                        <div v-if="showRegistrationNumberPanel" class="row row mb-3 justify-content-center">
                            <label class="col-md-2 col-form-label"></label>
                            <div class="col-md-4 p-0">
<!--                                <v-select-->
<!--                                        v-model="registration_number"-->
<!--                                        append-to-body-->
<!--                                        :calculate-position="withPopper"-->
<!--                                        @option:selected="searchForm()"-->
<!--                                        :options="registrationNumberList"-->
<!--                                        :filterable="false"-->
<!--                                        @open="onOpen"-->
<!--                                        @close="onClose"-->
<!--                                        @search="filtered" >-->
<!--                                    <template #list-footer>-->
<!--                                        <li v-show="hasNextPage" ref="load" class="loader">-->
<!--                                            Loading more options...-->
<!--                                        </li>-->
<!--                                    </template>-->

<!--                                </v-select>-->
                                <v-select
                                        v-model="registration_number"
                                        append-to-body
                                        :calculate-position="withPopper"
                                        :options="registrationNumberList"
                                        :dropdown-should-open="dropdownShouldOpen"
                                        :closeOnSelect="true"
                                        @option:selected="searchForm()">
                                </v-select>

                            </div>
                        </div>

                        <div class="row mb-3 justify-content-center">
                            <label class="col-md-2 col-form-label">Branch</label>
                            <div class="col-md-4 p-0">
                                <b-form-select class="form-select" :disabled="disabledBranch" v-model="branch"
                                               name="branch" :options="branchList"
                                               value-field="code"
                                               text-field="label" @change="getAppointmentDateist()">
                                    <!-- <template #first>
                                        <b-form-select-option :value="null">-- Please select a Branch --</b-form-select-option>
                                    </template> -->
                                </b-form-select>
                                <!-- <ul v-if="v$.division.$error" class="parsley-errors-list filled">
                                    <li class="parsley-required">The field is required.</li>
                                </ul> -->
                            </div>
                        </div>


                        <div class="row mb-1 justify-content-center">
                            <label class="col-md-2 col-form-label">Appointment Date</label>
                            <div class="col-md-4 p-0">
                                <!-- <input class="form-control" type="date" v-model="appointment_date" name="appointment_date"
                                    id="example-date-input" @change="getTimeSlot()"> -->
                                <Datepicker :isLabelRequired="false" :format="format" :modelValue="appointment_date"
                                            :disableDateArray="disableDateArray"
                                            :isDisable="false"
                                            :valueTypeFormat="valueTypeFormat" @onDateChanged="getTimeSlot()"
                                />
                                <!-- <input type="text" class="form-control" placeholder="dd M, yyyy"
                                                data-date-format="dd M, yyyy" data-date-container='#datepicker2' data-provide="datepicker"
                                                data-date-autoclose="true" v-model="appointment_date" name="appointment_date"> -->
                            </div>
                        </div>


                        <div class="row mb-3 justify-content-center">
                            <label class="col-md-2 col-form-label">Time Slot</label>
                            <div class="col-md-4 p-0">
                                <b-form-select class="form-select" :disabled="disabledTimeSlot" v-model="time_slot"
                                               name="time_slot" :options="timeslotList"
                                               value-field="slotId"
                                               text-field="slotName" @change="changeTimeSlot()">
                                </b-form-select>
                                <!-- <ul v-if="v$.division.$error" class="parsley-errors-list filled">
                                    <li class="parsley-required">The field is required.</li>
                                </ul> -->
                            </div>
                        </div>

                        <div class="row mb-3 justify-content-center">
                            <label for="mobile-number" class="col-md-2 col-form-label">Mobile Number</label>
                            <div class="col-md-4 p-0">
                                <input type="text" maxlength="11" minlength="1" class="form-control" id="mobile-number"
                                       :readonly="readonlyM" name="mobile-number" v-model="mobile_number">
                                <ul v-if="v$.mobile_number.$error" class="parsley-errors-list filled">
                                    <li v-if="v$.mobile_number.required.$invalid" class="parsley-required">The field is required.</li>
                                    <li v-if=" !v$.mobile_number.required.$invalid && v$.mobile_number.isPhoneNumber.$invalid" class="parsley-required">Please Enter a valid phone number</li>
                                </ul>
                            </div>

                        </div>

                        <div class="row justify-content-center">
                            <!--                                <div class="col-sm-9 text-right">-->
                            <!--                                    <div>-->
                            <button type="reset" class="btn btn-danger btn-sm col-xl-1 col-md-2 col-4" @click="resetForm()"
                                    style="margin: 1px">Reset
                            </button>
                            <button v-if="!isSubmitAppointment" type="button"  class="btn btn-sm col-xl-1 col-md-2 col-4"
                                    :class="(submitBtnDis)?'btn-dark':'btn-primary'"
                                    :style="(submitBtnDis)?'cursor:no-drop':''" @click.prevent="getAppointmentSubmit()"
                                    :disabled="submitBtnDis">Submit
                            </button>
                          <button v-if="isSubmitAppointment" class="btn btn-sm col-xl-1 col-md-2 col-4 btn-outline-primary" type="button">
                            <div class="spinner-border"
                                 style="height: 1rem !important; width: 1rem !important;">
                              <span class="visually-hidden">Processing...</span>
                            </div>
                          </button>
                            <!--                                    </div>-->
                            <!--                                </div>-->
                        </div>

                        <!-- end card body -->
                    </div>
                    <!-- end card -->
                </div>
                <!-- end col -->
                <!-- <div class="offset-xl-4 col-xl-5 offset-md-4 col-md-6 col-sm-12">
                    <div class="row mb-3" >
                        <div class="col-xl-6 col-md-6 col-sm-12">
                            <div class="d-flex flew-row "></div>
                            <label for="registration_number">Registration Number</label>
                            <input type="text" class="form-control" :class="[(v$.registration_number.$error)?'is-invalid':'']"
                                   id="registration_number" v-model="registration_number" name="registration_number">
                            <ul v-if="v$.registration_number.$error" class="parsley-errors-list filled">
                                <li class="parsley-required">Registration Number is required.</li>
                            </ul>
                        </div>

                        <div class="col-xl-6 col-md-6 col-sm-12 mt-4 p-2">
                            <b-button   variant="primary" @click.prevent="searchForm()">
                                Search
                            </b-button>
                            <button class="btn btn-danger " @click="resetForm()">Clear</button>
                        </div>

                        <div class="col-md-3 col-xm-12">
                            <Loader class="col-12 mt-5" :loading="isLoading" ></Loader>
                        </div>
                    </div>

                    <div class="row mb-3" >
                        <div class="col-xl-6 col-md-6 col-sm-12">
                            <div class="d-flex flew-row "></div>
                            <label for="mobile_number">Mobile Number</label>
                            <input type="text" class="form-control"
                                   id="mobile_number" v-model="mobile_number" name="mobile_number">
                        </div>
                    </div>
                </div> -->

            </div>

        </div>
    </div>
</template>
<script>
    import moment from "moment";
    import useVuelidate from '@vuelidate/core'
    import {required,helpers,maxLength,minLength} from '@vuelidate/validators'
    import Loader from "../common/Loader";
    import Datepicker from "../common/Datepicker";
    import LocalStore from "../../plugins/LocalStore";
    import {createPopper} from "@popperjs/core";

    export default {
        components: {Loader, Datepicker},
        data() {
            return {
                registration_number: '',
                branch: '',
                time_slot: '',
                mobile_number: '',
                // slot_id:'',
                appointment_date: '',
                pageTitle: 'New Appointment',
                // search_data: [],
                status: true,
                isLoading: false,
                isSubmitAppointment:false,
                paymentStatus: false,
                readonlyM: true,
                disabledBranch: true,
                disabledTimeSlot: true,
                submitBtnDis: true,
                branchList: [],
                timeslotList: [],
                center_id: null,
                userTypeId: LocalStore.getStorage('user').data.user_type_id,
                format: "MM/DD/YYYY",
                valueTypeFormat: 'DD-MMM-YYYY',
                label: "Date",
                min: "",//"27-NOV-2022"
                max: "",//"12-DEC-2022"
                disableDateArray: [],
                reg_no:null,
                registrationNumberList:[],
                registrationNumberPaginatedList:[],
                showRegistrationNumberPanel:false,
                observer:  new IntersectionObserver(this.infiniteScroll),
                limit: 10,
                search: '',
                loadingText: 'Loading...',
                page: 1, // start at page 1
                totalPages: null, // set later by API response
                dropdownOpen: true // set later by API response

            }
        },

        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                registration_number: {required},
                reg_no: {
                    required,
                    minLength:minLength(4),
                    maxLength:maxLength(6),

                },
                mobile_number: {
                    required,
                    // isPhoneNumber:  helpers.regex('isPhoneNumber', /^(?:\\+88|88)?(01[3-9]\\d{8})$/)
                    isPhoneNumber:  (value , obj)=>{
                        return  /(^(\+8801|8801|01|008801))[1|3-9]{1}(\d){8}$/.test(value);
                    }
                }

            }
        },
        mounted() {
            this.user = LocalStore.getStorage('user').data;
            this.center_id = this.user.center_id;

        },

        methods: {
            formatDate(value) {
                return moment(value).format("MM/DD/YYYY")

            },
            getAppointmentDateist() {

                this.axios.get(process.env.MIX_API_URL + '/appointment/all-appointment-dates/' + this.branch, {})
                    .then(response => {
                        const res = response.data;

                        if (res.status) {
                            this.disableDateArray = res.data.data.appointment_dates;
                            this.appointment_date = moment(new Date(res.data.seletedDate)).format("MM/DD/YYYY").replace("-", "");
                            this.disabledTimeSlot = false;
                            //  this.branchList = res.data;
                            // console.log( this.branchList);
                        }
                    })
                    .catch(error => {
                            this.$toastr.error(error.response.data.message);
                        }
                    )
                    .finally();


            },
            getBranchList() {
                if (this.userTypeId != 1) {
                    this.axios.get(process.env.MIX_API_URL + '/common/brta-branch-center-wise/' + this.center_id, {})
                        .then(response => {
                            const res = response.data;

                            if (res.status) {
                                this.disabledTimeSlot = false;
                                this.branchList = res.data;
                                // console.log( this.branchList);
                            }
                        })
                        .catch(error => {
                                this.$toastr.error(error.response.data.message);
                            }
                        )
                        .finally();
                }

            },
            async getTimeSlot() {
                // console.log(this.appointment_date);
                // console.log(this.branch);

                this.isLoading = true;

                if (this.appointment_date != null && this.branch != null) {
                    const params = {
                        appointment_date: this.appointment_date,
                        branch_id: this.branch
                    };


                    await this.axios.post(process.env.MIX_API_URL + '/appointment/get-timeslot-list', params, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                        .then(response => {
                            if(response.data.status){
                                this.timeslotList = (response.data.status)?response.data.data.data:[];
                            }else{
                                this.$toastr.error(response.data.message);
                                this.appointment_date = null;
                                this.branch = null;
                            }
                            this.isLoading = false;
                        })
                        .catch(error => {
                            // that.sendToPage(error);
                            this.status = false;
                            // this.disabledBranch = false;
                            //console.log(error);
                            //this.sendToPage(this.status, error.response.data.message);
                            this.appointment_date = null;
                            this.branch = null;
                            this.isLoading = false;
                        })
                        .finally(() => {
                            this.isLoading = false;
                        });
                }
                this.isLoading = false;

            },
            changeTimeSlot() {
                this.submitBtnDis = false;
            },
            async searchForm() {

              this.dropdownOpen  = false;

                var that = this;
                // this.v$.$validate();
                if (await !this.v$.registration_number.$error) {

                    this.isLoading = true;
                    const params = {
                        registration_number: this.registration_number,
                    };
                    await this.axios.post(process.env.MIX_API_URL + '/appointment/check-register-no', params, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                        .then(response => {
                            this.status = true;

                            if (response.data.data.mobileNo) {
                                this.readonlyM = true;
                                this.mobile_number = response.data.mobile_number;
                            } else {
                                this.readonlyM = false;
                                // this.mobile_number = '01911915181';
                            }

                            this.disabledBranch = false;
                            this.getBranchList();
                            this.isLoading = false;
                        })
                        .catch(error => {
                            // that.sendToPage(error);
                            this.status = false;
                            this.$toastr.error(error.response.data.message);
                            this.isLoading = false;
                        })
                        .finally(() => {
                            this.isLoading = false;
                            this.dropdownOpen  = false;
                        });
                }
            },
            async getAppointmentSubmit() {
                //  this.v$.$validate();
                // if (!this.v$.registration_number.$error) {}

                // if (await !this.v$.mobile_number.$error) {

                if (await this.v$.$validate()) {
                    this.isSubmitAppointment = true;

                    const params = {
                        registration_number: this.registration_number,
                        appointment_date: this.appointment_date,
                        branch_id: this.branch,
                        mobile_number: this.mobile_number,
                        slot_id: this.time_slot
                    };
                    //console.log(params);

                    await this.axios.post(process.env.MIX_API_URL + '/appointment/get-appointment-serial', params, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                        .then(response => {
                            // this.status = true;

                            if (response.data.data.success) {
                                this.$toastr.success(response.data.message);
                                this.sendToPage(response.data);
                                this.isSubmitAppointment = false;
                                this.resetForm();

                            } else {
                                this.$toastr.error(response.data.message);
                                this.isSubmitAppointment = false;
                            }
                        })
                        .catch(error => {
                            this.$toastr.error(error.response.data.message);

                            this.isSubmitAppointment = false;
                        })
                        .finally(() => {
                            this.isSubmitAppointment = false;
                        });
                }
                // }
            },
            resetForm() {
                this.v$.$reset()
                this.registration_number = null;
                this.appointment_date = '';
                this.time_slot = '';
                this.mobile_number = '';
                this.slot_id = '';
                this.branchList = [];
                this.timeslotList = [];
                this.branch = '';
                this.readonlyM = true;
                this.disabledBranch = true;
                this.disabledTimeSlot = true;
                this.reg_no = null;
                this.showRegistrationNumberPanel = false;
            },

            /*sendToPage(status, data,paymentStatus){
                this.$emit('sendToPage',status, data,paymentStatus);
            },*/
            sendToPage(data) {
                this.$emit('formUpdated', data);
            },
            async registrationSearch() {
                // this.v$.$validate();
                if (await !this.v$.reg_no.$error) {
                    this.isLoading = true;
                    const params = {
                        reg_no: this.reg_no,
                    };
                    await this.axios.post(process.env.MIX_API_URL + '/appointment/registration-number/search', params, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => {
                            if(response.data.status){
                                this.registrationNumberList = [];
                                this.registrationNumberList = (response.data.status)?response.data.data:[];
                                this.registrationNumberList = this.registrationNumberList.map((item) =>item.registrationNo);
                                this.showRegistrationNumberPanel = (this.registrationNumberList.length>0)? true :false;
                                // this.totalPages = Math.ceil((this.registrationNumberList/this.limit))
                                // this.filtered();
                                // this.paginated()
                                // this.hasNextPage();
                                this.resetOnSearch();
                            }else{
                                this.$toastr.error(response.data.message);
                            }
                            this.isLoading = false;
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
            withPopper(dropdownList, component, { width }) {
                dropdownList.style.width = width
                const popper = createPopper(component.$refs.toggle, dropdownList, {
                    placement: 'bottom',
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, -1],
                            },
                        },
                        {
                            name: 'toggleClass',
                            enabled: true,
                            phase: 'write',
                            fn({ state }) {
                                component.$el.classList.toggle(
                                    'drop-up',
                                    state.placement === 'top'
                                )
                            },
                        },
                    ],
                })
                return () => popper.destroy()
            },
            async onOpen() {
                if (this.hasNextPage) {
                    await this.$nextTick()
                    this.observer.observe(this.$refs.load)
                }
            },
            onClose() {
                this.observer.disconnect()
            },
            async infiniteScroll([{ isIntersecting, target }]) {
                if (isIntersecting) {
                    const ul = target.offsetParent
                    const scrollTop = target.offsetParent.scrollTop
                    this.limit += 10
                    await this.$nextTick()
                    ul.scrollTop = scrollTop
                }
            },
            async filtered(search, loading) {
                if(search != undefined && search!='' ){

                    // console.log("filterd",this.registrationNumberList.map(function(item){
                    //  if(item.includes(search)){
                    //      return item
                    //  }
                    // }));
                    this.registrationNumberList = this.registrationNumberList.filter((item) => item.includes(search));
                }
            },
            async paginated() {
                this.registrationNumberPaginatedList  = this.registrationNumberList.slice(0, this.limit)
            },
            async hasNextPage() {
                return this.registrationNumberPaginatedList.length < this.registrationNumberList.length
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
            resetOnSearch(){
                this.appointment_date = '';
                this.time_slot = '';
                this.mobile_number = '';
                this.slot_id = '';
                this.branchList = [];
                this.timeslotList = [];
                this.branch = '';
                this.readonlyM = true;
                this.disabledBranch = true;
                this.disabledTimeSlot = true;
                this.registration_number = '';
                this.dropdownOpen  = true;
            },
            dropdownShouldOpen(vSelect){
                // return (this.dropdownOpen)?this.dropdownOpen:vSelect.open;
                return (this.dropdownOpen)?this.dropdownOpen:false;
            }
        },
        computed: {}
    }
</script>

<style lang="scss">

</style>
