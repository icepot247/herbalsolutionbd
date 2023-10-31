<template>
    <div>
        <div v-if="(userTypeId !=1)" class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4 col-xm-12" v-if="userTypeId==1">
                        <div class="mb-3">
                            <label class="form-label required">Center <span class="text-danger">*</span></label>
                            <b-form-select :disabled="(fc_lot_id !=null)" class="form-select" v-model="center_id" :options="centerList"
                                           name="center_id"
                                           value-field="center_id"
                                           text-field="center_name" @change="checkBranchCenter">
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
                    <div class="col-md-4 col-xm-12">
                        <div class="mb-3">
                            <label class="form-label required">Branch <span class="text-danger">*</span></label>
                          <b-form-select :disabled="(fc_lot_id !=null)" class="form-select" v-model="branch_id"
                                           name="branch_id"
                                           :class="[(v$.branch_id.$error)?'is-invalid':'']"
                                           value-field="code"
                                           text-field="label">
                                <template #first>
                                    <b-form-select-option :value="null">-- Please select a Branch --
                                    </b-form-select-option>
                                  <b-form-select-option v-for="(val,key) in branchList" :key="key"
                                                        :value="val.code" :disabled="(val.status !==0)"
                                                        :class="(val.status !==0)?'text-mute':' font-weight-bold'">
                                    {{val.label}}
                                  </b-form-select-option>

                                </template>
                            </b-form-select>
                            <ul v-if="v$.branch_id.$error" class="parsley-errors-list filled">
                                <li class="parsley-required">The field is required.</li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-4 col-xm-12">
                        <div class="mb-3">
                            <label for="fc_lot_no" class="form-label required">FC Lot No <span
                                class="text-danger">*</span></label>
                            <input  ref="fc_lot_no" :readonly="(fc_lot_id !=null)" type="text" class="form-control"
                                   :class="[(v$.fc_lot_no.$error)?'is-invalid':'']"
                                   id="fc_lot_no" v-model="fc_lot_no" name="fc_lot_no">
                            <ul v-if="v$.fc_lot_no.$error" class="parsley-errors-list filled">
                                <li class="parsley-required">The field is required.</li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-4 col-xm-12">
                        <div class="mb-3">
                            <label for="fc_serial_start_no" class="form-label required">FC Serial Start No<span
                                class="text-danger">*</span></label>
                            <input :readonly="(fc_lot_id !=null)" ref="fc_serial_start_no" type="number" min="0" class="form-control"
                                   :class="[(v$.fc_serial_start_no.$error)?'is-invalid':'']"
                                   id="fc_serial_start_no" v-model="fc_serial_start_no" name="fc_serial_start_no">
                            <ul v-if="v$.fc_serial_start_no.$error" class="parsley-errors-list filled">
                                <li class="parsley-required">The field is required.</li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-4 col-xm-12">
                        <div class="mb-3">
                            <label for="fc_serial_end_no" class="form-label required">FC Serial End No<span
                                class="text-danger">*</span></label>
                            <input :readonly="(fc_lot_id !=null)" ref="fc_serial_end_no" type="number" min="0" class="form-control"
                                   :class="[(v$.fc_serial_end_no.$error)?'is-invalid':'']"
                                   id="fc_serial_end_no" v-model="fc_serial_end_no" name="fc_serial_end_no">
                            <ul v-if="v$.fc_serial_end_no.$error" class="parsley-errors-list filled">
                                <li class="parsley-required">The field is required.</li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-4 col-xm-12">
                        <div class="mb-3">
                            <label for="lot_box_no" class="form-label required">Lot Box No<span
                                class="text-danger">*</span></label>
                            <input :readonly="(fc_lot_id !=null)" ref="lot_box_no" type="text" class="form-control"
                                   :class="[(v$.lot_box_no.$error)?'is-invalid':'']"
                                   id="lot_box_no" v-model="lot_box_no" name="lot_box_no">
                            <ul v-if="v$.lot_box_no.$error" class="parsley-errors-list filled">
                                <li class="parsley-required">The field is required.</li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-4 col-xm-12">
                        <div class="mb-3">
                            <label for="received_from" class="form-label required">Received From<span
                                class="text-danger">*</span></label>
                            <input :readonly="(fc_lot_id !=null)" ref="received_from" type="text" class="form-control"
                                   :class="[(v$.received_from.$error)?'is-invalid':'']"
                                   id="received_from" v-model="received_from" name="received_from">
                            <ul v-if="v$.received_from.$error" class="parsley-errors-list filled">
                                <li class="parsley-required">The field is required.</li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-4 col-xm-12">
                        <div class="mb-3">
                            <label for="received_date" class="form-label required">Received Date<span
                                class="text-danger">*</span></label>
                            <input :readonly="(fc_lot_id !=null)" ref="received_date" type="date" class="form-control"
                                   :class="[(v$.received_date.$error)?'is-invalid':'']"
                                   id="received_date" v-model="received_date" name="received_date">

                            <ul v-if="v$.received_date.$error" class="parsley-errors-list filled">
                                <li class="parsley-required">Received Date is required.</li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-4 col-xm-12">
                        <div class="mb-3">
                            <label class="form-label">Status <span class="text-danger">*</span></label>
                            <b-form-select class="form-select" :class="[(v$.status.$error)?'is-invalid':'']"
                                           v-model="status" :options="statusOptions" name="status"></b-form-select>
                            <ul v-if="v$.status.$error" class="parsley-errors-list filled">
                                <li class="parsley-required">Status field is required.</li>
                            </ul>
                        </div>
                    </div>

                </div>
                <div v-if="(fc_lot_id !==null)" class="row">
                    <div v-if="(fc_lot_id !==null)" class="col-md-12 col-xm-12">
                        <div class="mb-3 text-center border">
                            <label class="form-label">Available Certificate Page </label> :
                            <label v-if="(available_pages>10)" class="form-label text-success">{{available_pages}}</label>
                            <label v-if="(available_pages<10)" class="form-label text-danger">{{available_pages}}</label>
                        </div>
                    </div>
                </div>
                <div>
                    <button v-if="!isLoading" class="btn btn-primary float-end"
                            type="button" @click.prevent="submitForm()">{{this.btnName}}
                    </button>
                    <button v-if="isLoading" class="btn btn-primary float-end" type="button">
                        <div class="spinner-border" style="height: 1rem !important; width: 1rem !important;">
                            <span class="visually-hidden">Processing...</span>
                        </div>
                    </button>
                    <button @click="resetForm" v-if="!isLoading" class="btn btn-danger mr-2 float-end"
                            type="button">Cancel
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import useVuelidate from '@vuelidate/core'
    import {required, numeric, requiredIf} from '@vuelidate/validators'
    import LocalStore from "../../plugins/LocalStore";

    export default {
        name: 'CreateForm',
        props: ['formPage'],
        data() {
            return {
                tableData: [],
                isLoading: false,
                user: null,
                centerList: [],
                branchList: [],
                fc_lot_id: null,
                center_id: null,
                branch_id: null,
                fc_lot_no: null,
                fc_serial_start_no: null,
                fc_serial_end_no: null,
                lot_box_no: null,
                received_from: null,
                received_date: null,
                status: null,
                statusOptions: [
                    {value: null, text: 'Please select an option'},
                    {value: 'Y', text: 'Active'},
                    {value: 'N', text: 'Inactive'},
                ],
                btnName: 'Save',
                userTypeId: this.$store.getters.getUser.data.user_type_id,
                last_serial_no: null,
                available_pages: null,
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                center_id: {
                    required: requiredIf(() => {
                        return (this.userTypeId == 1)
                    })
                },
                // center_id: {required},
                branch_id: {required},
                fc_lot_no: {required},
                fc_serial_start_no: {required, numeric},
                fc_serial_end_no: {required, numeric},
                lot_box_no: {required},
                received_from: {required},
                received_date: {required},
                status: {required},
            }
        },
        created() {
        },
        watch: {
            formPage(newData, oldData) {
                if (newData) {
                    this.fc_lot_id = newData.fc_lot_id;
                    this.center_id = newData.center_id;
                    this.branch_id = newData.branch_id;
                    this.fc_lot_no = newData.fc_lot_no;
                    this.fc_serial_start_no = newData.fc_serial_start_no;
                    this.fc_serial_end_no = newData.fc_serial_end_no;
                    this.lot_box_no = newData.lot_box_no;
                    this.received_from = newData.received_from;
                    this.received_date = newData.received_date;
                    this.status = newData.active_yn;
                    this.last_serial_no = newData.last_serial_no;
                    this.available_pages = newData.available_pages;
                    this.btnName = 'Update';
                    if(this.userTypeId == 1){
                      this.getCenterList();
                    }
                    this.getBranchList();
                    this.$refs.fc_lot_no.focus(); //on click edit btn focus on the name input field

                }
            }
        },
        mounted() {
            this.user = LocalStore.getStorage('user').data;
            this.center_id = this.user.center_id;

            this.userTypeId = this.$store.getters.getUser.data.user_type_id;
            if (this.userTypeId != 1) {
                this.center_id = this.user.center_id;
                this.getBranchList();
            } else {
                this.getCenterList();
            }
        },
        methods: {
            getCenterList() {
                this.axios.get(process.env.MIX_API_URL + '/center', {})
                    .then(response => {
                        const res = response.data;

                        if (res.status) {
                            this.centerList = res.data.data;
                        }
                    })
                    .catch(error => {
                            this.$toastr.error(error.response.data.message);
                        }
                    )
                    .finally();
            },
            checkBranchCenter() {
                this.axios.get(process.env.MIX_API_URL + '/common/brta-branch-center-wise/' + this.center_id, {})
                    .then(response => {
                        const res = response.data;

                        if (res.status) {
                            this.branchList = res.data;
                        }
                    })
                    .catch(error => {
                            this.$toastr.error(error.response.data.message);
                        }
                    )
                    .finally();
            },
            getBranchList() {
                this.axios.get(process.env.MIX_API_URL + '/common/active-inv-branch-center-wise/' + this.center_id, {})
                    .then(response => {
                        const res = response.data;
                        if (res.status) {
                            this.branchList = res.data;
                        }
                    })
                    .catch(error => {
                            this.$toastr.error(error.response.data.message);
                        }
                    )
                    .finally();
            },
            async submitForm() {
                if (await this.v$.$validate()) {
                    this.isLoading = true;
                    const params = {
                        center_id: this.center_id,
                        branch_id: this.branch_id,
                        fc_lot_no: this.fc_lot_no,
                        fc_serial_start_no: this.fc_serial_start_no,
                        fc_serial_end_no: this.fc_serial_end_no,
                        lot_box_no: this.lot_box_no,
                        received_from: this.received_from,
                        received_date: this.received_date,
                        active_yn: this.status
                    };
                    if (this.fc_lot_id) {
                        var axiosObj = this.axios.put(process.env.MIX_API_URL + '/inventory/' + this.fc_lot_id, params,{ headers: {
                                'Content-Type': 'multipart/form-data'
                            }})
                    } else {
                        var axiosObj = this.axios.post(process.env.MIX_API_URL + '/inventory', params,{ headers: {
                                'Content-Type': 'multipart/form-data'
                            }})
                    }
                    await axiosObj.then(response => {
                        var data = response.data;
                        if (data.status) {
                            this.$toastr.success(data.message);
                            this.isLoading = false;
                            this.resetForm();
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
                            this.isLoading = false;
                        });
                }
            },
            resetForm() {
                this.v$.$reset();
                this.fc_lot_id = null;
                this.branch_id = null;
                this.fc_lot_no = null;
                this.fc_serial_start_no = null;
                this.fc_serial_end_no = null;
                this.lot_box_no = null;
                this.received_from = null;
                this.received_date = null;
                this.status = null;
                this.btnName = 'Save';
                this.resetTitle();
            },
            sendToTable(data) {
                this.$emit('formUpdated', data);
            },
            resetTitle() {
                this.$emit('resetPageTitle', true);
            }

        },
    }
</script>
