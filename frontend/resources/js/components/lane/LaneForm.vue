<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-12">
            <div class="row">
              <div class="col-md-4" v-if="(userTypeId == 1)">
                <div class="mb-1">
                  <label class="form-label required">Select Center
                    <span class="text-danger">*</span>
                  </label>
                  <b-form-select :disabled="update" class="form-select"
                                 @change="getBoothList"
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
            </div>

            <div class="row" v-if="center_id !== null">
              <div class="col-md-3 col-xm-12">
                <div class="mb-3">
                  <label class="form-label">Booth <span class="text-danger">*</span></label>
                  <b-form-select :disabled="update" ref="name" class="form-select"
                                 :class="[(v$.booth_id.$error)?'is-invalid':'']" v-model="booth_id" :options="boothList"
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
                  <b-form-select :disabled="update" class="form-select"
                                 :class="[(v$.counter_id.$error)?'is-invalid':'']" v-model="counter_id"
                                 :options="counterList"
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
              <div class="col-md-3 col-xm-12">
                <div class="mb-3">
                  <label class="form-label">Lane <span class="text-danger">*</span></label>
                  <b-form-select :disabled="update" v-model="lane_no"
                                 :class="[(v$.lane_no.$error)?'is-invalid':'']"
                  >
                    <template #first>
                      <b-form-select-option disabled :value="null">Select One</b-form-select-option>
                    </template>
                    <b-form-select-option v-for="(option,key) in itemsOptions" :key="key" :value="option">{{ option }}
                    </b-form-select-option>
                  </b-form-select>
                  <ul v-if="v$.lane_no.$error" class="parsley-errors-list filled">
                    <li class="parsley-required">The field is required.</li>
                  </ul>
                </div>
              </div>

              <div class="col-md-3 col-xm-12">
                <div class="mb-3">
                  <label class="form-label">Lane Type <span
                      class="text-danger">*</span></label>
                  <b-form-select :disabled="update" class="form-select" :class="[(v$.lanetype.$error)?'is-invalid':'']"
                                 v-model="lanetype" :options="laneTypeList"
                                 name="lanetype">
                    <template #first>
                      <b-form-select-option :value="null">Select One</b-form-select-option>
                    </template>
                  </b-form-select>
                  <ul v-if="v$.lanetype.$error" class="parsley-errors-list filled">
                    <li class="parsley-required">The field is required.</li>
                  </ul>
                </div>
              </div>
              <div class="col-md-3 col-xm-12">
                <div class="mb-3">
                  <label class="form-label">Status <span class="text-danger">*</span></label>
                  <b-form-select class="form-select" :class="[(v$.status.$error)?'is-invalid':'']"
                                 v-model="status" :options="statusOptions" name="status"></b-form-select>
                  <ul v-if="v$.status.$error" class="parsley-errors-list filled">
                    <li class="parsley-required">Status field is required.</li>
                  </ul>
                </div>
              </div>
              <div class="col-xl-12">
                <div class="mb-3">
                  <label>Description <span class="text-danger">*</span></label>
                  <b-form-textarea :class="[(v$.description.$error)?'is-invalid':'']" id="description"
                                   name="description" class="form-control" v-model="description"
                                   placeholder="Enter description..." rows="3"></b-form-textarea>
                  <ul v-if="v$.description.$error" class="parsley-errors-list filled">
                    <li class="parsley-required">Description field is required.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button v-if="!isLoading" class="btn btn-primary float-end"
                  type="button" @click="submitForm()">{{ this.btnName }}
          </button>
          <button @click="resetForm" v-if="!isLoading" class="btn btn-danger mr-2 float-end" type="button">Cancel
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
import useVuelidate from '@vuelidate/core'
import {required, requiredIf} from '@vuelidate/validators'

export default {
  name: 'CreateForm',
  props: ['formPage'],
  data() {
    return {
      tableData: [],
      laneTypeList: [],
      boothList: [],
      counterList: [],
      isLoading: false,
      lane_id: false,
      booth_id: null,
      counter_id: null,
      lanetype: null,
      description: null,
      status: null,
      statusOptions: [
        {value: null, text: 'Select one'},
        {value: 'Y', text: 'Active'},
        {value: 'N', text: 'Inactive'},
      ],
      btnName: 'Save',
      update: false,
      lane_no: null,
      counterArrayLength: null,
      centerList: [],
      center_id:  this.$store.getters.getUser.data.center_id,
      itemsOptions: null,
      userTypeId: this.$store.getters.getUser.data.user_type_id,

    }
  },
  setup() {
    return {v$: useVuelidate()}
  },
  validations() {
    return {
      booth_id: {required},
      counter_id: {required},
      lanetype: {required},
      status: {required},
      description: {required},
      lane_no: {required},
      center_id: {
        required: requiredIf(function () {
          return (this.userTypeId == 1)
        })
      },
    }
  },
  created() {
  },
  watch: {
    formPage(newData, oldData) {
      if (newData) {
        this.lane_id = newData.lane_id;
        this.booth_id = newData.booth_id;
        this.counter_id = newData.counter_id;
        this.lanetype = newData.lane_type_id;
        this.status = newData.active_yn;
        this.description = newData.lane_description;
        this.btnName = 'Update';
        this.update = true;
        this.lane_no = newData.lane_no;
        this.center_id = newData.center_id;
        this.getBoothList();
        this.changeBooth();
        this.getLaneTypeList();
        this.scrollToTop();

      }
    }
  },
  mounted() {
    this.getLaneTypeList();
    this.getBoothList();
    this.getCenterList();
  },
  methods: {

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
    getBoothList() {
      var centerId = this.center_id
      if (this.center_id !== null) {
        centerId = this.center_id;
      } else {
        centerId = this.$store.getters.getUser.data.center_id;
      }

      this.axios
          .get(process.env.MIX_API_URL + '/common/booths/' + centerId, {})
          .then(response => {
            this.boothList = (response.status) ? response.data.data : [];
          })
          .catch(error => {
            this.$toastr.error(error.response.data.message);
          })
          .finally(() => {
          });

      if(this.lane_id ==null){

        this.resetOnReload()
      }
    },
    changeBooth() {
      this.axios
          .get(process.env.MIX_API_URL + '/common/counters/' + this.booth_id, {})
          .then(response => {
            this.counterList = (response.status) ? response.data.data : [];
            this.counterArrayLength = this.counterList.length;
            this.itemsOptions = null;
            this.laneNoGenerator();
          })
          .catch(error => {
            console.log("error", error)
            this.$toastr.error(error.response.data.message);
          })
          .finally(() => {
          });
    },
    getLaneTypeList() {
      this.axios
          .get(process.env.MIX_API_URL + '/common/lane-types', {})
          .then(response => {
            this.laneTypeList = (response.status) ? response.data.data : [];
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
          booth_id: this.booth_id,
          counter_id: this.counter_id,
          lanetype: this.lanetype,
          description: this.description,
          centerId: this.center_id,
          active_yn: this.status,
          lane_no: this.lane_no,
        };
        if (this.lane_id) {
          var axiosObj = this.axios.put(process.env.MIX_API_URL + '/lane/' + this.lane_id, params, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        } else {
          var axiosObj = this.axios.post(process.env.MIX_API_URL + '/lane', params, {
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
      this.boothList = null;
      this.lanetype = null;
      this.description = null;
      this.status = null;
      this.counterList = null;
      this.btnName = 'Save';
      this.booth_id = null;
      this.counter_id = null;
      this.lane_id = null;
      this.lane_no = null;
      this.update = null;
      this.center_id = this.$store.getters.getUser.data.center_id;
      this.getBoothList();
      this.resetTitle();
    },
    sendToTable(data) {
      this.$emit('formData', data)
    },
    resetTitle() {
      this.$emit('resetPageTitle', true);
    },
    laneNoGenerator() {

      // this.itemsOptions =  [...Array(this.counterArrayLength).keys()].map(i => i + 1);
      this.itemsOptions = [...Array(50).keys()].map(i => i + 1);
    },
    resetOnReload() {
      this.description = null;
      this.status = null;
      this.booth_id = null;
      this.counter_id = null;
      this.lane_no = null;
    },
    scrollToTop() {
      window.scrollTo(0,0);
    }
  }
}
</script>
