<template>
  <div>
    <div class="card">
      <div class="card-body">

        <div class="row">
          <div class="col-md-8 border-right">
            <div class="row">
              <div class="col-md-9 col-xm-12">
                <div class="mb-3">
                  <label for="name" class="form-label required">Name <span
                          class="text-danger">*</span></label>
                  <input ref="centerName" type="text" class="form-control" :class="[(v$.name.$error)?'is-invalid':'']"
                         id="name" v-model="name" name="name">
                  <ul v-if="v$.name.$error" class="parsley-errors-list filled">
                    <li class="parsley-required" v-for="(val,key) in v$.name.$errors">{{val.$message}}</li>
                  </ul>
                </div>
              </div>
              <div v-if="center_id != null" class="col-md-3 col-xm-12">
                <div class="mb-3">
                  <label class="form-label">Status <span class="text-danger">*</span></label>
                  <b-form-select @change="updateStatus()" class="form-select" :class="[(v$.status.$error)?'is-invalid':'']"
                                 v-model="status" :options="statusOptions" name="status"></b-form-select>
                  <ul v-if="v$.status.$error" class="parsley-errors-list filled">
                    <li class="parsley-required">Status field is required.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 col-xm-12">
                <div class="mb-3">
                  <label class="form-label">Division <span class="text-danger">*</span></label>
                  <b-form-select class="form-select" :class="[(v$.division.$error)?'is-invalid':'']"
                                 v-model="division" :options="divisionList" @change="getDistrict()"
                                 name="division"></b-form-select>
                  <ul v-if="v$.division.$error" class="parsley-errors-list filled">
                    <li class="parsley-required">The field is required.</li>
                  </ul>
                </div>
              </div>
              <div class="col-md-4 col-xm-12">
                <div class="mb-3">
                  <label class="form-label">District <span class="text-danger">*</span></label>
                  <b-form-select class="form-select" :class="[(v$.district.$error)?'is-invalid':'']"
                                 v-model="district" :options="districtList" @change="getThana()"
                                 name="district"></b-form-select>
                  <ul v-if="v$.district.$error" class="parsley-errors-list filled">
                    <li class="parsley-required">The field is required.</li>
                  </ul>
                </div>
              </div>
              <div class="col-md-4 col-xm-12">
                <div class="mb-3">
                  <label class="form-label">Thana <span class="text-danger">*</span></label>
                  <b-form-select class="form-select" :class="[(v$.thana.$error)?'is-invalid':'']"
                                 v-model="thana" :options="thanList" name="thana"></b-form-select>
                  <ul v-if="v$.thana.$error" class="parsley-errors-list filled">
                    <li class="parsley-required">The field is required.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 mb-3">
                <label for="address" class="form-label">Address <span class="text-danger">*</span></label>
                <textarea :class="[(v$.address.$error)?'is-invalid':'']" name="address" rows="2" class="form-control"
                          v-model="address"
                          id="address"></textarea>
                <ul v-if="v$.address.$error" class="parsley-errors-list filled">
                  <li class="parsley-required">The field is required.</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="row mt-3">
              <div v-if="center_id == null" class="col-md-8 col-xm-12">
                <div class="mb-3">
                  <label class="form-label">RFID Device Location <span class="text-danger">*</span></label>
                  <b-form-select class="form-select" :class="[(v$.rfid_device_location_id.$error)?'is-invalid':'']"
                                 v-model="rfid_device_location_id" name="rfid_device_location_id">
                    <b-form-select-option :value="null">Please select an option</b-form-select-option>
                    <b-form-select-option v-for="(val,key) in rfidDeviceLocationList" :key="key" :value="val.value">
                      {{ val.text }}
                    </b-form-select-option>
                  </b-form-select>
                  <ul v-if="v$.rfid_device_location_id.$error" class="parsley-errors-list filled">
                    <li class="parsley-required">The field is required.</li>
                  </ul>
                </div>
              </div>
              <div v-if="center_id != null" class="col-md-8 col-xm-12">
                <div class="mb-3">
                  <label class="form-label">RFID Device Location <span class="text-danger">*</span></label>
                  <b-form-select class="form-select" :class="[(v$.rfid_device_location_id.$error)?'is-invalid':'']"
                                 v-model="rfid_device_location_id" name="rfid_device_location_id">
                    <b-form-select-option :value="null">Please select an option</b-form-select-option>
                    <b-form-select-option v-for="(val,key) in rfidDeviceLocationList" :key="key" :value="val.value">
                      {{ val.text }}
                    </b-form-select-option>
                  </b-form-select>
                  <ul v-if="v$.rfid_device_location_id.$error" class="parsley-errors-list filled">
                    <li class="parsley-required">The field is required.</li>
                  </ul>
                </div>
              </div>
              <div  class="col-md-12 col-xm-12">
                <div class="mb-1 mt-1 pl-3">

                  <div class="form-check  mb-3 mt-md-4 p-md-2 mt-sm-2">
                    <label class="form-label"></label>
                    <input class="form-check-input" type="checkbox"
                           :checked="(shift_user_change_yn=='Y')?true:false"
                           @change="setShiftUSerChange(($event.target.checked)?'Y':'N')"
                           checked="">
                    <label class="form-check-label">
                      Allow running shift change
                    </label> <br>
                    <small>Hints: This allow the admin to change the running shift</small>

                    <!--                                <span tabindex="0" v-b-tooltip.hover title="Tooltip directive content">-->
                    <!--                                    <svg height="16" width="16" viewBox="0 0 16 16">-->
                    <!--                                        <path fill="#02bfe7" d="M8 0c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM8.9 13h-2v-2h2v2zM11 8.1c-0.4 0.4-0.8 0.6-1.2 0.7-0.6 0.4-0.8 0.2-0.8 1.2h-2c0-2 1.2-2.6 2-3 0.3-0.1 0.5-0.2 0.7-0.4 0.1-0.1 0.3-0.3 0.1-0.7-0.2-0.5-0.8-1-1.7-1-1.4 0-1.6 1.2-1.7 1.5l-2-0.3c0.1-1.1 1-3.2 3.6-3.2 1.6 0 3 0.9 3.6 2.2 0.4 1.1 0.2 2.2-0.6 3z">-->
                    <!--                                </path></svg></span>-->
                  </div>
                </div>
              </div>
              <div  class="col-md-12 col-xm-12">
                <div class="mb-1 mt-1 pl-3">

                  <div class="form-check  mb-2 mt-md-1 p-md-2 mt-sm-2">
                    <label class="form-label"></label>
                    <input class="form-check-input" type="checkbox"
                           :checked="(counter_user_multiple_yn=='Y')?true:false"
                           @change="setCounterUserMultipleChange(($event.target.checked)?'Y':'N')"
                           checked="">
                    <label class="form-check-label">
                      Allow Inspector for multiple counters
                    </label> <br>
                    <small>Hints: By allowing this one VIC Inspector can be assigned to multiple counters</small>

                    <!--                                <span tabindex="0" v-b-tooltip.hover title="Tooltip directive content">-->
                    <!--                                    <svg height="16" width="16" viewBox="0 0 16 16">-->
                    <!--                                        <path fill="#02bfe7" d="M8 0c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM8.9 13h-2v-2h2v2zM11 8.1c-0.4 0.4-0.8 0.6-1.2 0.7-0.6 0.4-0.8 0.2-0.8 1.2h-2c0-2 1.2-2.6 2-3 0.3-0.1 0.5-0.2 0.7-0.4 0.1-0.1 0.3-0.3 0.1-0.7-0.2-0.5-0.8-1-1.7-1-1.4 0-1.6 1.2-1.7 1.5l-2-0.3c0.1-1.1 1-3.2 3.6-3.2 1.6 0 3 0.9 3.6 2.2 0.4 1.1 0.2 2.2-0.6 3z">-->
                    <!--                                </path></svg></span>-->
                  </div>
                </div>
              </div>
              <div v-if="center_id != null"  class="col-md-12 col-xm-12">
                <div class="mb-1 mt-1 pl-3">

                  <div class="form-check  mb-2 mt-md-1 p-md-2 mt-sm-2">
                    <label class="form-label"></label>
                    <input :disabled="(updated_center_wise_mapping_yn=='Y')" class="form-check-input" type="checkbox"
                           :checked="(center_wise_mapping_yn=='Y')?true:false"
                           @change="setCounterWiseMapping(($event.target.checked)?'Y':'N')"
                           checked="">
                    <label class="form-check-label">
                      Allow Center wise mapping
                    </label> <br>
                    <small>Hints: This allow the admin to setup center wise sub test type and vehicle class mapping</small>

                    <!--                                <span tabindex="0" v-b-tooltip.hover title="Tooltip directive content">-->
                    <!--                                    <svg height="16" width="16" viewBox="0 0 16 16">-->
                    <!--                                        <path fill="#02bfe7" d="M8 0c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM8.9 13h-2v-2h2v2zM11 8.1c-0.4 0.4-0.8 0.6-1.2 0.7-0.6 0.4-0.8 0.2-0.8 1.2h-2c0-2 1.2-2.6 2-3 0.3-0.1 0.5-0.2 0.7-0.4 0.1-0.1 0.3-0.3 0.1-0.7-0.2-0.5-0.8-1-1.7-1-1.4 0-1.6 1.2-1.7 1.5l-2-0.3c0.1-1.1 1-3.2 3.6-3.2 1.6 0 3 0.9 3.6 2.2 0.4 1.1 0.2 2.2-0.6 3z">-->
                    <!--                                </path></svg></span>-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <button v-if="!isLoading" class="btn btn-primary float-end"
                  type="button" @click.prevent="submitForm()">
            {{ this.btnName }}
          </button>
          <button v-if="isLoading" class="btn btn-primary float-end" type="button">
            <div class="spinner-border" style="height: 1rem !important; width: 1rem !important;">
              <span class="visually-hidden">Processing...</span>
            </div>
          </button>

          <button @click="resetForm" v-if="!isLoading" class="btn btn-danger mr-2 float-end" type="button">Cancel
          </button>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import useVuelidate from '@vuelidate/core'
import {required,minLength} from '@vuelidate/validators'

export default {
  name: 'CreateForm',
  props: ['formPage'],
  data() {
    return {
      tableData: [],
      divisionList: [],
      districtList: [],
      thanList: [],
      isLoading: false,
      center_id: null,
      name: null,
      division: null,
      district: null,
      thana: null,
      address: null,
      coverage: [],
      status: 'N',
      statusOptions: [
        {value: null, text: 'Please select an option'},
        {value: 'Y', text: 'Active',},
        {value: 'N', text: 'Inactive'},
      ],
      btnName: 'Save',
      shift_user_change_yn: "N",
      counter_user_multiple_yn: "N",
      rfid_device_location_id: null,
      rfidDeviceLocationList: [],
      center_wise_mapping_yn: "N",
      updated_center_wise_mapping_yn: null,
    }
  },
  setup() {
    return {v$: useVuelidate()}
  },
  validations() {
    return {
      name: {
        required,
        minLength:minLength(3)
      },
      division: {required},
      district: {required},
      thana: {required},
      status: {required},
      address: {required},
      rfid_device_location_id: {required},
    }
  },
  created() {
  },
  watch: {
    formPage(newData, oldData) {
      if (newData) {

        this.center_id = newData.center_id;
        this.name = newData.center_name;
        this.status = newData.active_yn;
        this.address = newData.location_address;
        this.division = newData.division.division_id;
        this.district = newData.district.district_id;
        this.thana = newData.thana.thana_id;
        this.shift_user_change_yn = newData.shift_user_change_yn;
        this.counter_user_multiple_yn = newData.counter_user_multiple_yn;
        this.rfid_device_location_id = newData.rfid_device_location_id;
        this.coverage = [];
        this.coverage = newData.coverages;
        var inspectors=[];
        if(newData.coverages.length>0){
          newData.coverages.map(function (item){
            item.brta_branch.inspectors.map(function (i){
              inspectors.push(i)
            })
          });
          this.inspectors = inspectors;
        }
        this.getDistrict()
        this.getThana()
        this.btnName = 'Update';
        this.center_wise_mapping_yn = newData.center_wise_mapping_yn;
        this.updated_center_wise_mapping_yn = newData.center_wise_mapping_yn;
        this.$refs.centerName.focus();
      }
    }
  },
  mounted() {
    this.getDivision();
    this.rfidDeviceLocation();
  },
  methods: {

    updateStatus() {
      if (this.status == "Y") {
        if (this.coverage.length == 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Please Set Branch Coverage ?',
            showCancelButton: true,
            cancelButtonText: 'Close',
            cancelButtonColor: '#dd3333',
            showConfirmButton: false,

          }).then((result) => {
            if (result.isDismissed) {
              this.status = 'N';
            }
          });
          }
        else if(this.coverage.length > 0){
          if (this.inspectors.length == 0) {
            Swal.fire({
              icon: 'warning',
              title: 'Please Set Branch Inspector ?',
              showCancelButton: true,
              cancelButtonText: 'Close',
              cancelButtonColor: '#dd3333',
              showConfirmButton: false,

            }).then((result) => {
              if (result.isDismissed) {
                this.status = 'N';
              }
            });
          }

        }
      }

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
    async submitForm() {
      if (await this.v$.$validate()) {
        this.isLoading = true;
        const params = {
          name: this.name,
          division_id: this.division,
          district_id: this.district,
          thana_id: this.thana,
          address: this.address,
          active_yn: this.status,
          shift_user_change_yn: this.shift_user_change_yn,
          counter_user_multiple_yn: this.counter_user_multiple_yn,
          rfid_device_location_id: this.rfid_device_location_id,
          center_wise_mapping_yn: this.center_wise_mapping_yn,
        };
        if (this.center_id) {
          var axiosObj = this.axios.put(process.env.MIX_API_URL + '/center/' + this.center_id, params, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        } else {
          var axiosObj = this.axios.post(process.env.MIX_API_URL + '/center', params, {
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
      this.v$.$reset()
      this.center_id = null;
      this.name = null;
      this.division = null;
      this.district = null;
      this.thana = null;
      this.address = null;
      this.status = null;
      this.btnName = 'Save';
      this.shift_user_change_yn = 'N';
      this.counter_user_multiple_yn = 'N';
      this.resetTitle();
      this.rfid_device_location_id = null;
      this.center_wise_mapping_yn = 'N';
    },
    sendToTable(data) {
      this.$emit('formUpdated', data);
    },
    resetTitle() {
      this.$emit('resetPageTitle', true);
    },
    setShiftUSerChange(data) {
      this.shift_user_change_yn = data;
    },
    setCounterUserMultipleChange(data) {
      this.counter_user_multiple_yn = data;
    },
    setCounterWiseMapping(data) {
      this.center_wise_mapping_yn = data;
    },
    rfidDeviceLocation() {
      this.axios
          .get(process.env.MIX_API_URL + '/common/rfid_device_location', {})
          .then(response => {
            const res = response.data;
            if (res.status) {
              this.rfidDeviceLocationList = res.data
            }
          })
          .catch(error => {
            this.$toastr.error(error.response.data.message);
          })
          .finally(() => {
          });
    },

  },
}
</script>
