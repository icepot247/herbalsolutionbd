<template>

  <div>
    <div class="card" v-if="!status && message.length>0">
      <div class="card-body">
        <div class="row">
          <div class="col-md-12">
            <h3 class="mb-0 text-danger text-center font-size-20">{{ message }}</h3>
          </div>
        </div>
      </div>
    </div>

    <div class="card pb-3" v-if="status">
      <div class="card-body">
        <div class="row" v-if="appointmentInfo.length> 0">
          <div class="col-md-12 col-sm-12">
            <div class="card border border-dark">
              <div class="card-header bg-transparent border-dark">
                <h5 class="my-0 text-dark">Appointment Information</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 col-sm-12">
                    <div class="row">
                      <div class=" col-md-3 card-title">Appointment Date</div>
                      <div class="col-md-1 col-sm-1">:</div>
                      <div class="col-md-8 col-sm-12 card-text">{{ appointmentInfo[3][1] }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Vehicle Reg. No</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ vehicleInfo[1][1] }}</div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Branch Name</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ appointmentInfo[10][1] }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Serial No</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ appointmentInfo[7][1] }}</div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Slot</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ appointmentInfo[6][1] }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Mobile No.</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ appointmentInfo[8][1] }}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="col-md-12 col-sm-12 mt-4 ">
            <div class="card border border-dark">
              <div class="card-header bg-transparent border-dark">
                <h5 class="my-0 text-dark">Vehicle Information</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Registration No</div>
                      <div class="col-1">:</div>
                      <div class="col-md-8 card-text">{{ vehicleInfo[1][1] }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">CC</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ vehicleInfo[5][1] }}</div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Vehicle Type</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ vehicleInfo[9][1] }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Vehicle Class</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ vehicleInfo[11][1] }}</div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Laden Weight</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ vehicleInfo[15][1] }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Unladen Wight</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ vehicleInfo[16][1] }}</div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Vehicle Color</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ vehicleInfo[18][1] }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">No of Seat</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ vehicleInfo[6][1] }}</div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Manufacturer</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ vehicleInfo[13][1] }}</div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Person Name</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ vehicleInfo[29][1] }}</div>
                    </div>

                  </div>

                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Chassis No</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ vehicleInfo[3][1] }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="row" v-if="!paymentInfo && !isLoading">
          <div class="col-md-12 mt-4 p-2 text-center">
            <button v-if="!isLoading" class="btn btn-md btn-primary"
                    @click.prevent="checkPayment()"> Check Payment
            </button>
          </div>
        </div>
        <div class="row" v-if="paymentInfo && !isLoading">
          <div v-if="!showPaymentInfo" class="col-md-12 col-sm-12 mt-4 ">
            <div v-if="paymentInfoStatusEmpty" class="card border border-dark">
              <div class="card-header bg-transparent border-dark">
                <h5 class="my-0 text-dark"> Payment Information
                </h5>
              </div>
              <div class="card-body text-danger">{{ paymentRes }}</div>

            </div>
            <div v-if="!paymentInfoStatusEmpty" class="card border border-dark">
              <div class="card-header bg-transparent border-dark">
                <h5 class="my-0 text-dark">Payment Information <span class="text-success">(Paid)</span>
                </h5>
              </div>
              <div class="card-body">
                <div class="row pt-2 pb-2 border-bottom" v-for="item in paymentRes">
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Purpose</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text"
                           style="text-transform: lowercase !important;">
                        {{ item.purpose }}
                      </div>

                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">E-Tracking No</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ item.etrackingNo }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Main Amount</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ item.mainAmount }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Late Fee</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 ">{{ item.lateFee }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Other Fee</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ item.othersFee }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="row">
                      <div class="col-md-3 card-title">Total Fee</div>
                      <div class="col-md-1">:</div>
                      <div class="col-md-8 card-text">{{ item.totalAmount }}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div v-else class="col-md-12 col-sm-12 mt-4 ">
            <div class="card border border-dark">
              <h3 class="mb-0 text-success p-3 text-center font-size-20">{{ paymentMsg }}</h3>
            </div>
          </div>
          <div v-if="!paymentInfoStatusEmpty && !isLoading && isRFIDDeviceLocationCounter && !isRFIDVerified"
               class="col-xl-12 col-md-12 col-sm-12 mt-4 p-2  text-center">
            <button class="btn btn-md btn-primary" @click="checkRFID()">RFID Check</button>
          </div>
          <div class="col-xl-12 col-md-12 col-sm-12 mt-4 p-2  text-center">
            <button
                v-if="!paymentInfoStatusEmpty && !isLoading && ((isRFIDVerified && isRFIDDeviceLocationCounter) || !isRFIDDeviceLocationCounter )"
                class="btn btn-md btn-primary" @click="setQue()">Get A Serial Number
            </button>
          </div>
        </div>

        <div class="row" v-if="isLoading">
          <div class="col-md-12">
            <Loader class="col-12 mt-5" :loading="isLoading"></Loader>
          </div>
        </div>
      </div>
      <b-modal id="queModal" title="Queue Information">
        <Loader :loading="isLoading"></Loader>
        <div id="printMe">
          <h5 class="text-center m-1 font-weight-bold">Queue No : <b>{{ que }}</b></h5>
          <div class="text-center m-0">
            <!--                        <div v-html="qr_img"></div>-->
            <img :src="'data:image/png;base64,'+qr_img" alt="">
          </div>
          <h6 class="text-center m-1">Date : <b>{{ que_insert_date }}</b></h6>

          <div style="border-top: 1px solid #dee2e6;" class="pt-2 mt-2">
            <p style="font-size: smaller" class="text-center p-0 m-0">Queue ID : {{ lane_queue_id }}</p>
            <p style="font-size: smaller" class="text-center p-0 m-0"> Appointment : {{ appointment_id }}</p>
            <p style="font-size: smaller" v-if="registration_no" class="text-center p-0 m-0"> Registration No :
              {{ registration_no }}</p>
            <p style="font-size: smaller" v-else class="text-center p-0 m-0"> Chassis No : {{ chassis_no }}</p>
          </div>

        </div>
        <template #modal-footer>
          <div class="w-100">
            <span :class="que_status?'text-success':'text-danger'">{{ que_msg }}</span>
            <b-button
                variant="danger"
                size="sm"
                class="float-end"
                @click="$bvModal.hide('queModal')">
              Close
            </b-button>
            <b-button
                variant="primary"
                size="sm"
                class="float-end mr-1"
                @click="printque(print_url)"
            >
              Print
            </b-button>
          </div>
        </template>
      </b-modal>
    </div>
    <!-- end card body -->

  </div>

</template>


<script>
import Loader from "../common/Loader";

export default {
  components: {Loader},
  name: 'appointmentSearchData',
  props: ['resStatus', 'resSearchData'],
  data() {
    return {
      pageTitle: 'Check Appointment',
      vehicleInfo: [],
      appointmentInfo: [],
      status: false,
      message: '',
      registration_no: '',
      chassis_no: '',
      registration_id: '',
      paymentInfo: '',
      isLoading: false,
      purpose: '',
      paymentRes: [],
      errorMessage: '',
      errorStatus: true,
      que_insert_date: '',
      que_status: false,
      que_msg: false,
      que: '',
      qr_img: null,
      appointment_id: '',
      lane_queue_id: '',
      print_url: '#',
      paymentInfoStatusEmpty: false,
      appointmentId: false,
      isRFIDVerified: false,
      isRFIDDeviceLocationCounter: false,

      showPaymentInfo: false,
      paymentMsg: "",

    }

  },
  watch: {
    resStatus(newData, oldData) {
      this.status = newData;
    },

    resSearchData(newData, oldData) {
      if (typeof newData === 'object' && newData !== null) {
        if (newData.data.status) {
          this.status = newData.data.status;
          this.vehicleInfo = Object.entries(newData.data.data.vehicle_info);
          this.appointmentInfo = Object.entries(newData.data.data.appointment_info);
          this.registration_no = this.vehicleInfo[1][1]
          this.appointmentId = newData.data.data.appointment_info.appointmentId;
        } else {
          this.status = newData.data.status;
          this.message = newData.data.message;
        }
      } else {
        this.message = newData;

      }

      this.paymentInfo = false;
    },
  },
  methods: {
    async checkPayment() {
      this.isLoading = true;
      const params = {
        registration_no: this.vehicleInfo[1][1],
        registration_id: this.vehicleInfo[0][1],
        chassis_no: this.vehicleInfo[3][1],

      };

      this.isLoading = true;
      this.axios.post(process.env.MIX_API_URL + '/appointment/check/payment', params, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(response => {
            if (response.data.status) {
              //this.$toastr.success(response.data.message)
              if (response.data.data == null || response.data.data == "") {
                this.paymentMsg = response.data.message;
                this.showPaymentInfo = true;
              } else {
                this.showPaymentInfo = false;
                this.paymentRes = response.data.data.payment_details;
              }
              this.getRFIDLocation();
            } else {
              this.paymentInfoStatusEmpty = true;
              this.paymentRes = response.data.data;
            }
            this.paymentInfo = true;
            this.isLoading = false;

          })
          .catch(error => {
            this.errorStatus = error.response.data.status;
            console.log("Appoint", error)
            var msg = error.response.data.message.length > 0 ? error.response.data.message : error.response.data
            Swal.fire({
              title: msg,
              icon: 'warning',
              showCancelButton: true,
              cancelButtonText: 'Close',
              cancelButtonColor: '#d33',
              showConfirmButton: false,
            })
            this.isLoading = false;
          })
          .finally((res) => {
            this.isLoading = false;
          });
    },
    async setQue() {
      this.isLoading = true;
      const params = {
        registration_id: this.vehicleInfo[0][1],
        registration_no: this.vehicleInfo[1][1],
        vehicle_class_id: this.vehicleInfo[10][1],
        appointment_id: this.appointmentInfo[1][1],
        mobile_no: this.appointmentInfo[8][1],
        chassis_no: this.vehicleInfo[3][1],
      };
      this.axios.post(process.env.MIX_API_URL + '/appointment/queue', params, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(response => {
            var value = response.data.data;
            this.que_status = response.data.status;
            this.que_msg = response.data.message;
            this.que_insert_date = value.insert_date;
            this.qr_img = value.qr_img;
            this.que = value.queue_no;
            this.appointment_id = value.i_appointment_id;
            this.lane_queue_id = value.lane_queue_id;
            this.chassis_no = value.i_chassis_no;

            this.print_url = process.env.MIX_API_URL + '/print/que?appointment_id=' + this.appointment_id + '&lane_queue_id=' + this.lane_queue_id
            this.$bvModal.show('queModal');
            this.isLoading = false;
          })
          .catch(error => {
            Swal.fire({
              title: error.response.data.message,
              icon: 'warning',
              showCancelButton: true,
              cancelButtonText: 'Close',
              cancelButtonColor: '#d33',
              showConfirmButton: false,

            });
            this.isLoading = false;
          })
          .finally(() => {
          });
    },
    printque(print_url) {
      // window.open(print_url, '_blank');
      // this.axios.get(print_url, {responseType: 'blob'})
      this.axios.get(print_url, {responseType: 'blob'})
          .then((response) => {

            window.open(window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'})));

          }).catch(error => {
        this.$toastr.error('Something went wrong. Please try again later!');
      });
    },
    async checkRFID() {
      this.isLoading = true;
      const params = {
        appointment_id: this.appointmentId,
      };
      this.isLoading = true;
      this.axios.post(process.env.MIX_API_URL + '/rfid/check', params, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
          .then(response => {
            console.log("response ", response)
            this.isRFIDVerified = (response.data.status) ? response.data.status : false;
            this.isLoading = false;
            (response.data.status) ? this.$toastr.success(response.data.message) : this.$toastr.error(response.data.message);
          })
          .catch(error => {
            console.log("error ", error)
            this.$toastr.error(error.response.data.message);
            this.isLoading = false;
          })
          .finally((res) => {
            this.isLoading = false;
          });
    },
    getRFIDLocation() {
      this.isLoading = true;
      this.axios
          .get(process.env.MIX_API_URL + '/common/center-settings/' + this.$store.getters.getUser.data.center_id, {})
          .then(res => {
            this.isLoading = false;
            this.rfid_device_location = (res.status) ? res.data.data.rfid_device_location : [];

            if (this.rfid_device_location.rfid_device_location_id === 1) {
              this.isRFIDDeviceLocationCounter = true;
            }
          })
          .catch(error => {
            this.isLoading = false;
            this.$toastr.error(error.response.data.message);
          })
          .finally(() => {
            this.isLoading = false;
          });
    },
  },
}
</script>

<style lang="scss">

</style>


