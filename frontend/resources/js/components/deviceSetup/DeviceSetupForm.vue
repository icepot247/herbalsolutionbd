<template>
    <div>
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-12">
                        <div class="row">
                            <div class="col-md-4" v-if="(userTypeId==1)">
                                <div class="mb-1">
                                    <label class="form-label required">Select Center
                                        <span class="text-danger">*</span>
                                    </label>
                                    <b-form-select  class="form-select"
                                                    @change="getLanes"
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
                            <div v-if="this.center_id != null" class="col-md-3 col-xm-12">
                                <div class="mb-1">
                                    <label class="form-label">Select Type:</label>
                                    <span class="text-danger">*</span>
                                    <b-form-select @change="getRFIDLocation" ref="deviceType" class="form-select"
                                                   :class="[(v$.deviceType.$error)?'is-invalid':'']"
                                                   v-model="deviceType"
                                                   name="deviceType">
                                        <b-form-select-option disabled :value="null">Please select an option</b-form-select-option>
                                        <b-form-select-option v-for="(val ,key) in deviceList" :value="val.value" :key="key">{{val.text}}</b-form-select-option>
                                    </b-form-select>
                                    <ul v-if="v$.deviceType.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <Loader :loading="isLoading"></Loader>
                        <div v-if="(rfid_device_location.rfid_device_location_id == null) && (deviceType !== null) || ((rfid_device_location.rfid_device_location_id == 2) && (deviceType !== null)) && !isLoading"
                             class="form-group  border p-3 mt-2">
                            <div class="row mt-2">

                                <div class="col-md-2 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">Lane:</label>
                                        <span class="text-danger">*</span>

                                        <b-form-select class="form-select" :class="[(v$.lane.$error)?'is-invalid':'']"
                                                       v-model="lane" :options="laneList"
                                                       name="lane">

                                        </b-form-select>
                                        <ul v-if="v$.lane.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div v-if="(deviceType==1)" class="col-md-2 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">Angle:</label>
                                        <span class="text-danger">*</span>

                                        <b-form-select class="form-select"
                                                       :class="[(v$.photoAngle.$error)?'is-invalid':'']"
                                                       v-model="photoAngle" :options="photoAngleList"
                                                       name="photoAngle">
                                        </b-form-select>
                                        <ul v-if="v$.photoAngle.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-2 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">Status:</label>
                                        <span class="text-danger">*</span>
                                        <b-form-select class="form-select" :class="[(v$.status.$error)?'is-invalid':'']"
                                                       v-model="status" :options="statusOptions"
                                                       name="status">
                                        </b-form-select>
                                        <ul v-if="v$.status.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class='col-md-4 col-xm-12'>
                                    <div class="mb-3">
                                        <label class="form-label">Device Name:</label>
                                        <span class="text-danger">*</span>
                                        <input v-model="deviceName" name="deviceName"
                                               :class="[(v$.deviceName.$error)?'is-invalid':'']" type="text"
                                               class="form-control">
                                        <ul v-if="v$.deviceName.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-2 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">Model:</label>
                                        <span class="text-danger">*</span>
                                        <input v-model="model" name="model" :class="[(v$.model.$error)?'is-invalid':'']"
                                               type="text" class="form-control">
                                        <ul v-if="v$.model.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div v-if="(deviceType==1)" class="col-md-2 col-xm-12">
                                    <div class="mb-2">
                                        <label class="form-label">Username:</label>
                                        <span  class="text-danger">*</span>
                                        <input v-model="username" name="username"
                                               :class="[(v$.username.$error)?'is-invalid':'']" type="text"
                                               class="form-control">
                                        <ul v-if="v$.username.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div v-if="(deviceType==1)" class="col-md-2 col-xm-12">
                                    <div class="mb-32">
                                        <label class="form-label">Password:</label>
                                        <span  class="text-danger">*</span>
                                        <input v-model="password" name="password"
                                               :class="[(v$.password.$error)?'is-invalid':'']" type="text"
                                               class="form-control">
                                        <ul v-if="v$.password.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-6 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">Full URL:</label>
                                        <span class="text-danger">*</span>
                                        <input v-model="ipAddress" name="ipAddress"
                                               :class="[(v$.ipAddress.$error)?'is-invalid':'']"
                                               type="text" class="form-control" placeholder="192.168.78.230">
                                        <ul v-if="v$.ipAddress.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-12 col-xm-12 mt-4 p-2">
                                    <button v-if="!isLoading" class="btn btn-primary float-end"
                                            type="button" @click.prevent="submitForm()"> {{this.btnName}}
                                    </button>
                                    <button @click="resetForm" v-if="!isLoading" class="btn btn-danger mr-2 float-end"
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
                        <div v-if="(rfid_device_location.rfid_device_location_id == 1) && !isLoading" class="form-group border p-3 mt-3">
                            <div class="row">
                                <div class='col-md-3 col-xm-12'>
                                    <div class="mb-3">
                                        <label class="form-label">Device Name:</label>
                                        <span class="text-danger">*</span>
                                        <input v-model="deviceName" name="deviceName"
                                               :class="[(v$.deviceName.$error)?'is-invalid':'']" type="text"
                                               class="form-control">
                                        <ul v-if="v$.deviceName.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-3 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">Model:</label>
                                        <span class="text-danger">*</span>
                                        <input v-model="model" name="model" :class="[(v$.model.$error)?'is-invalid':'']"
                                               type="text" class="form-control">
                                        <ul v-if="v$.model.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-3 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">Status:</label>
                                        <span class="text-danger">*</span>
                                        <b-form-select class="form-select" :class="[(v$.status.$error)?'is-invalid':'']"
                                                       v-model="status" :options="statusOptions"
                                                       name="status">
                                        </b-form-select>
                                        <ul v-if="v$.status.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-3 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">Booth <span class="text-danger">*</span></label>
                                        <b-form-select ref="name" class="form-select" :class="[(v$.booth_id.$error)?'is-invalid':'']" v-model="booth_id" :options="boothList"
                                                       name="booth_id" value-field="value" text-field="text" @change="changeBooth()">
                                            <template #first>
                                                <b-form-select-option :value="null">Select One</b-form-select-option>
                                            </template>
                                        </b-form-select>
                                        <ul v-if="v$.booth_id.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-3 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">Counter <span class="text-danger">*</span></label>
                                        <b-form-select class="form-select" :class="[(v$.counter_id.$error)?'is-invalid':'']" v-model="counter_id" :options="counterList"
                                                       name="counter_id" value-field="value" text-field="text">
                                            <template #first>
                                                <b-form-select-option :value="null">Select one</b-form-select-option>
                                            </template>
                                        </b-form-select>
                                        <ul v-if="v$.counter_id.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div class="col-md-6 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">Full URL:</label>
                                        <span class="text-danger">*</span>
                                        <input v-model="ipAddress" name="ipAddress"
                                               :class="[(v$.ipAddress.$error)?'is-invalid':'']"
                                               type="text" class="form-control" placeholder="192.168.78.230">
                                        <ul v-if="v$.ipAddress.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-12 col-xm-12 mt-4 p-2">
                                    <button v-if="!isLoading" class="btn btn-primary float-end"
                                            type="button" @click.prevent="submitForm()"> {{this.btnName}}
                                    </button>
                                    <button @click="resetForm" v-if="!isLoading" class="btn btn-danger mr-2 float-end"
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
    </div>
</template>

<script>
    import useVuelidate from "@vuelidate/core";
    import {required, requiredIf} from "@vuelidate/validators";
    import Loader from "../common/Loader";

    export default {
        name: "DeviceSetupForm",
        components: {Loader},
        props: ['tableData'],
        data() {
            return {
                isLoading: false,
                deviceName: null,
                status: null,
                model: null,
                deviceType: null,
                username: null,
                password: null,
                photoAngle: null,
                lane: null,
                center_id: this.$store.getters.getUser.data.center_id,
                ipAddress: null,
                deviceSetupId: null,
                btnName: 'Save',
                statusOptions: [
                    {value: null, text: 'Select one'},
                    {value: 'Y', text: 'Active'},
                    {value: 'N', text: 'Inactive'},
                ],
                deviceList: [],
                photoAngleList: [],
                laneList: [],
                rfid_device_location: {
                    rfid_device_location_id: null,
                    rfid_device_location_name: '',
                },
                booth_id:null,
                counter_id:null,
                boothList:[],
                counterList:[],
                userTypeId:this.$store.getters.getUser.data.user_type_id,
                centerList:[],
            }
        },
        created() {
            this.getDeviceType();
            this.getPhotoAngle();
            this.getLanes();
            this.getBoothList();
            this.getCenterList();
        },
        watch: {
            tableData(newValue, oldValue) {
                if (newValue) {
                    this.deviceSetupId = newValue.device_setup_id;
                    this.deviceName = newValue.device_name;
                    this.center_id = newValue.center_id;
                    this.status = newValue.active_yn;
                    this.model = newValue.model;
                    this.deviceType = newValue.device_type_id;
                    this.username = newValue.username;
                    this.password = newValue.password;
                    this.photoAngle = newValue.v_photo_angle_id;
                    this.lane = newValue.lane_id;
                    this.ipAddress = newValue.ip_address;
                    this.btnName = 'Update';
                    this.$refs.deviceType.focus();
                    if(newValue.rfid_device_location_id === 1){
                        this.booth_id = newValue.booth.booth_id
                        this.changeBooth();
                        this.counter_id = newValue.counter.counter_id;

                    }else{
                        this.counter_id = null;
                        this.booth_id = null
                    }
                    this.rfid_device_location = {
                        rfid_device_location_id: newValue.rfid_device_location_id,
                        rfid_device_location_name: '',
                    }
                }

            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                deviceName: {required},
                model: {required},
                status: {required},
                deviceType: {required},
                username: {
                    required:requiredIf(function () {
                        return (this.deviceType == 1)
                    })
                },
                password: {
                    required:requiredIf(function () {
                        return (this.deviceType == 1)
                    })
                },
                photoAngle: {
                    required: requiredIf(function () {
                        return (this.deviceType == 1)
                    })
                },
                lane: {
                    required:requiredIf(function () {
                        return (this.deviceType == 1)
                    })
                },
                ipAddress: {required},
                booth_id: {
                    required : requiredIf(function () {
                        return (this.rfid_device_location.rfid_device_location_id == 1)
                    })
                },
                counter_id: {
                    required : requiredIf(function () {
                        return (this.rfid_device_location.rfid_device_location_id == 1)
                    })
                },
                center_id: {
                    required : requiredIf(function () {
                        return (this.userTypeId == 1)
                    })
                },
            }
        },
        methods: {
            async submitForm() {
                if (await this.v$.$validate()) {
                    this.isLoading = true;
                    const params = {
                        deviceName: this.deviceName,
                        model: this.model,
                        status: this.status,
                        deviceType: this.deviceType,
                        username: this.username,
                        password: this.password,
                        photoAngle: this.photoAngle,
                        lane: this.lane,
                        ipAddress: this.ipAddress,
                        rfidDeviceLocationId: this.rfid_device_location.rfid_device_location_id,
                        boothId: this.booth_id,
                        counterId: this.counter_id,
                        centerId: this.center_id,
                    };
                    if (this.deviceSetupId) {
                        var axiosObj = this.axios.put(process.env.MIX_API_URL + '/device-setup/' + this.deviceSetupId, params, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                    } else {
                        var axiosObj = this.axios.post(process.env.MIX_API_URL + '/device-setup', params, {
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
                this.deviceName = null;
                this.model = null;
                this.status = null;
                this.deviceType = null;
                this.username = null;
                this.password = null;
                this.photoAngle = null;
                this.lane = null;
                this.ipAddress = null;
                this.counter_id = null;
                this.booth_id = null;
                this.deviceSetupId = null;
                this.btnName = 'Save';
                this.center_id = this.$store.getters.getUser.data.center_id,
                this.resetTitle();
            },
            sendToTable(data) {
                this.$emit('formData', data)
            },
            getDeviceType() {
                this.axios
                    .get(process.env.MIX_API_URL + '/common/device-type', {})
                    .then(response => {
                        this.deviceList = (response.data.status) ? response.data.data : [];
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },
            getPhotoAngle() {
                this.axios
                    .get(process.env.MIX_API_URL + '/common/photo-angle', {})
                    .then(response => {
                        this.photoAngleList = (response.data.status) ? response.data.data : [];
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },
            getLanes() {
              var centerId = this.center_id
              if(this.center_id !== null){
                centerId = this.center_id;
              }else{
                centerId = this.$store.getters.getUser.data.center_id;
              }
              this.axios
                  .get(process.env.MIX_API_URL + '/common/lanes/' + centerId, {})
                  .then(response => {
                    this.laneList = (response.data.status) ? response.data.data : [];
                  })
                  .catch(error => {
                    this.$toastr.error(error.response.data.message);
                  })
                  .finally(() => {
                  });

              if(centerId !== "null"){
                this.axios
                    .get(process.env.MIX_API_URL + '/common/lanes/' + centerId, {})
                    .then(response => {
                      this.laneList = (response.data.status) ? response.data.data : [];
                    })
                    .catch(error => {
                      this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
              }else{


              }

            },
            resetTitle() {
                this.$emit('resetPageTitle', true);
            },
            getRFIDLocation() {
                this.isLoading = true;
              var centerId = this.center_id
              if(this.center_id !== null){
                centerId = this.center_id;
              }else{
                centerId = this.$store.getters.getUser.data.center_id;
              }
                if (this.deviceType === 2) {
                    this.axios
                        .get(process.env.MIX_API_URL + '/common/center-settings/' + centerId, {})
                        .then(res => {
                            this.isLoading = false;
                            this.rfid_device_location = (res.status) ? res.data.data.rfid_device_location : [];

                            if(this.rfid_device_location.rfid_device_location_id !== 1){
                                this.rfid_device_location = {
                                    rfid_device_location_id: null,
                                    rfid_device_location_name: '',
                                }
                            }
                        })
                        .catch(error => {
                            this.isLoading = false;
                            this.$toastr.error(error.response.data.message);
                        })
                        .finally(() => {
                            this.isLoading = false;
                        });
                }else {
                    this.rfid_device_location = {
                        rfid_device_location_id: null,
                        rfid_device_location_name: '',
                    }
                    this.isLoading = false;
                }
                this.resetFormOnchange();
            },
            getBoothList() {
                this.axios
                    .get(process.env.MIX_API_URL + '/common/booths/'+this.$store.getters.getUser.data.center_id, {})
                    .then(response => {
                        this.boothList = (response.status) ? response.data.data : [];
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },
            changeBooth() {
                this.axios
                    .get(process.env.MIX_API_URL + '/common/counters/'+this.booth_id, {})
                    .then(response => {
                        this.counterList = (response.status) ? response.data.data : [];
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },
            resetFormOnchange() {
                this.deviceName = null;
                this.model = null;
                this.status = null;
                this.username = null;
                this.password = null;
                this.photoAngle = null;
                this.lane = null;
                this.ipAddress = null;
                this.booth_id = null;
                this.counter_id = null;
                this.deviceSetupId = null;
                // this.center_id = null;
                this.rfid_device_location = {
                    rfid_device_location_id: null,
                    rfid_device_location_name: '',
                }
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

