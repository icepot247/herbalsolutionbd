<template>
    <div>
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-12">
                        <div class="row">
                            <div v-if="(userType==1)" class="col-md-3 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label">Select Center
                                    </label>
                                    <b-form-select :disabled="(shift_id != null)" class="form-select"
                                                   v-model="center_id" :options="centerList"
                                                   name="center_id">
                                        <template #first>
                                            <b-form-select-option :value="null"> All</b-form-select-option>
                                        </template>
                                    </b-form-select>
                                    <!--                                        <ul v-if="v$.center_id.$error" class="parsley-errors-list filled">-->
                                    <!--                                            <li class="parsley-required">The field is required.</li>-->
                                    <!--                                        </ul>-->

                                </div>
                            </div>
                            <div class="col-md-3 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label">Start Time:</label>
                                    <span class="text-danger">*</span>
                                    <input ref="start_time" :class="[(v$.start_time.$error)?'is-invalid':'']"
                                           v-model="start_time"
                                           name="start_time" type="time" class="form-control">
                                    <ul v-if="v$.start_time.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-3 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label">End Time:</label>
                                    <span class="text-danger">*</span>
                                    <input :class="[(v$.end_time.$error)?'is-invalid':'']" v-model="end_time"
                                           name="end_time" type="time" class="form-control">
                                    <ul v-if="v$.end_time.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-3 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label">Status</label>
                                    <span class="text-danger">*</span>
                                    <b-form-select name="status" v-model="status" :options="statusOptions"
                                                   class="form-select"
                                                   :class="[(v$.status.$error)?'is-invalid':'']">
                                    </b-form-select>
                                    <ul v-if="v$.status.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>
                            <div class=" col-xm-12 mt-4 p-2" :class="(userType==1)?'col-md-12':'col-md-3'">
                                <button v-if="!isLoading" class="btn btn-primary float-end"
                                        type="button" @click.prevent="submitForm()">{{btnName}}
                                </button>
                                <button v-if="!isLoading" @click="resetForm" class="btn btn-danger mr-2 float-end"
                                        type="button">Cancel
                                </button>
                                <button v-if="isLoading" class="btn btn-primary float-end" type="button">
                                    <div class="spinner-border"
                                         style="height: 1rem !important; width: 1rem !important;">
                                        <span class="visually-hidden">Processing...</span>
                                    </div>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import useVuelidate from "@vuelidate/core";
    import {required} from "@vuelidate/validators";

    export default {
        name: "ShiftForm",
        props: ['tableData'],
        data() {
            return {
                isLoading: false,
                start_time: null,
                end_time: null,
                status: null,
                shift_id: null,
                statusOptions: [
                    {value: null, text: 'Select one'},
                    {value: 'Y', text: 'Active'},
                    {value: 'N', text: 'Inactive'},
                ],
                btnName: 'Save',
                userType: this.$store.getters.getUser.data.user_type_id,
                center_id: null,
                centerList: [],
            }
        },
        watch: {
            tableData(newValue, oldValue) {
                if (newValue) {
                    this.shift_id = newValue.shift_id;
                    this.start_time = newValue.shift_start;
                    this.end_time = newValue.shift_end;
                    this.status = newValue.active_yn.trim();
                    this.center_id= newValue.center_id;
                    this.btnName = "Update"
                    this.$refs.start_time.focus();
                }
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                start_time: {required},
                end_time: {required},
                status: {required},
            }
        },
        mounted() {
            this.getCenterList();
        },
        methods: {
            async submitForm() {
                if (await this.v$.$validate()) {
                    this.isLoading = true;
                    this.center_id = (this.$store.getters.getUser.data.center_id != null) ?
                        this.$store.getters.getUser.data.center_id : this.center_id;
                    const params = {
                        start_time: this.start_time,
                        end_time: this.end_time,
                        status: this.status,
                        center_id: this.center_id,
                    };
                    if (this.shift_id) {
                        var axiosObj = this.axios.put(process.env.MIX_API_URL + '/shift-setup/' + this.shift_id, params, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                    } else {
                        var axiosObj = this.axios.post(process.env.MIX_API_URL + '/shift-setup', params, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                    }
                    axiosObj.then(response => {
                        var data = response.data;
                        if (data.status) {
                            this.$toastr.success(data.message);
                            this.isLoading = false;
                            this.sendToTable(data);
                            this.resetForm()
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
                this.v$.$reset()
                this.start_time = null;
                this.end_time = null;
                this.status = null;
                this.shift_id = null;
                this.center_id = null;
                this.btnName = "Save"
                this.resetTitle();
            },
            sendToTable(data) {
                this.$emit('formData', data)
            },
            resetTitle() {
                this.$emit('resetPageTitle', true);
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
        }
    }
</script>

