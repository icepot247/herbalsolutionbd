<template>
    <div>
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-12 col-sm-12">
                        <div class="row">
                            <div class="col-md-6 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label">Name</label> <span
                                    class="text-danger">*</span>
                                    <input ref="name" type="text" v-model="boothName" class="form-control"
                                           :class="[(v$.boothName.$error)?'is-invalid':'']"/>
                                    <ul v-if="v$.boothName.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-3 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label">Type</label> <span
                                    class="text-danger">*</span>
                                    <b-form-select v-model="type" class="form-select" @click="getBoothType()"
                                                   :disabled="(booth_id!=null)"
                                                   :options="typeList" :class="[(v$.type.$error)?'is-invalid':'']">
                                    </b-form-select>
                                    <ul v-if="v$.type.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-3 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label">Booth No.</label> <span
                                    class="text-danger">*</span>
                                    <b-form-select v-model="boothNo" class="form-select"
                                                   :disabled="(booth_id!=null)"
                                                   :options="boothNoList"
                                                   :class="[(v$.boothNo.$error)?'is-invalid':'']">
                                    </b-form-select>
                                    <ul v-if="v$.boothNo.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>
                            <div v-if="(this.booth_id !=null)" class="col-md-3 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label">Status</label> <span
                                    class="text-danger">*</span>
                                    <b-form-select v-model="status" :options="statusOptions" class="form-select"
                                                   :class="[(v$.status.$error)?'is-invalid':'']">
                                    </b-form-select>
                                    <ul v-if="v$.status.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-3 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label">IP Wise</label> <span
                                    class="text-danger">*</span>
                                    <b-form-select v-model="ipWise" class="form-select"
                                                   :options="selectOptions"
                                                   :class="[(v$.ipWise.$error)?'is-invalid':'']">
                                    </b-form-select>
                                    <ul v-if="v$.ipWise.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-3 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label">Device Unique Id Wise</label> <span
                                    class="text-danger">*</span>
                                    <b-form-select v-model="macWise" class="form-select"
                                                   :options="selectOptions"
                                                   :class="[(v$.macWise.$error)?'is-invalid':'']">
                                    </b-form-select>
                                    <ul v-if="v$.macWise.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div>
                    <button v-if="!isLoading" class="btn btn-primary float-end"
                            type="button" @click.prevent="submitForm()"> {{this.btnName}}
                    </button>
                    <button @click="resetForm" v-if="!isLoading" class="btn btn-danger mr-2 float-end" type="button">
                        Cancel
                    </button>
                    <button v-if="isLoading" class="btn btn-primary float-end" type="button">
                        <div class="spinner-border" style="height: 1rem !important; width: 1rem !important;">
                            <span class="visually-hidden">Processing...</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import useVuelidate from "@vuelidate/core";
    import {required,requiredIf} from "@vuelidate/validators";

    export default {
        name: 'BoothForm',
        props: ['formPage'],
        data() {
            return {
                booth_id: null,
                center_id: null,
                boothName: null,
                boothNo: null,
                status: 'N',
                type: null,
                ipWise: null,
                macWise: null,
                typeList: [],
                isLoading: false,
                statusOptions: [
                    {value: null, text: 'Select one'},
                    {value: 'Y', text: 'Active'},
                    {value: 'N', text: 'Inactive'},
                ],
                boothNoList: [...Array.from({length: 50}, (v, k) => k + 1)],
                selectOptions: [
                    {text: "Select one", value: null},
                    {text: "Yes", value: "Y"},
                    {text: "No", value: "N"},
                ],
                btnName: 'Save',
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        mounted() {
            this.getBoothType();
        },
        watch: {
            formPage(newData, oldData) {
                if (newData) {
                    this.booth_id = newData.booth_id;
                    this.center_id = newData.center_id;
                    this.boothName = newData.booth_name;
                    this.status = newData.active_yn;
                    this.type = newData.booth_type_id;
                    this.ipWise = newData.ip_wise;
                    this.macWise = newData.mac_wise;
                    this.boothNo = newData.booth_no;
                    this.btnName = 'Update';
                    this.getBoothType()
                    this.$refs.name.focus();
                }
            }
        },
        validations() {
            return {
                boothName: {required},
                status: {
                    required:requiredIf(()=>{
                        return (this.booth_id !=null)
                    })
                },
                boothNo: {required},
                type: {required},
                ipWise: {required},
                macWise: {required},
            }
        },
        methods: {
            getBoothType() {
                this.axios
                    .get(process.env.MIX_API_URL + '/common/booth-type', {})
                    .then(response => {
                        this.typeList = (response.status) ? response.data.data : [];
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally()
            },
            async submitForm() {
                if (await this.v$.$validate()) {
                    this.isLoading = true;
                    const params = {
                        name: this.boothName,
                        no: this.boothNo,
                        booth_id: this.booth_id,
                        type_id: this.type,
                        active_yn: this.status,
                        ip_wise: this.ipWise,
                        mac_wise: this.macWise,
                    };
                    if (this.booth_id) {
                        var axiosObj = this.axios.put(process.env.MIX_API_URL + '/booth/' + this.booth_id, params,{ headers: {
                                'Content-Type': 'multipart/form-data'
                            }})
                    } else {
                        var axiosObj = this.axios.post(process.env.MIX_API_URL + '/booth', params,{ headers: {
                                'Content-Type': 'multipart/form-data'
                            }})
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
                            console.log('Loading off');
                            this.isLoading = false;
                        });
                }
            },
            resetForm() {
                this.v$.$reset()
                this.booth_id = null;
                this.boothName = null;
                this.type = null;
                this.status = 'N';
                this.boothNo = null;
                this.ipWise = null;
                this.macWise = null;
                this.btnName = 'Save';
                this.resetTitle();

            },
            sendToTable(data) {
                this.$emit('formData', data)
            },
            resetTitle() {
                this.$emit('resetPageTitle', true);
            }
        }
    }
</script>
