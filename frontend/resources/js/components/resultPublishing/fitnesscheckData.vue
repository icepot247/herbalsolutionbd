<template>
    <div class="row">
        <div class="col-md-12">
            <div class="card"  v-if="this.isError && message.length>0" >

                <div class="card-body">
                    <div class="row">
                        <div class="col-md-12 col-sm-12">
                            <h3 class="mb-0 text-danger text-center">{{message}}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-12">
            <div class="card" v-if="showResult && !(this.isError)"
                 id="testhide">
                <div class="card-body">
                    <h2 class="card-title"><b>Visual Test</b></h2>
                    <hr>
                    <div class="row">
                        <h4 class="card-title"><b>Vehicle Information</b></h4>
                        <div class="col-md-12 col-sm-12 border">

                            <div class="row mt-1">
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">Inspection Date</div>
                                        <div class="col-md-1">:</div>
                                        <!--                                <div class="col-md-6">{{manualTest[0].inspection_date}}</div>-->
                                        <div class="col-md-6">{{formatDate(manualTest[0].inspection_date)}}</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">Lane No</div>
                                        <div class="col-md-1">:</div>
                                        <div class="col-md-6">{{manualTest[0].lane_no}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">Lane Details</div>
                                        <div class="col-md-1">:</div>
                                        <div class="col-md-6">{{manualTest[0].lane_description}}</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">Lane Type</div>
                                        <div class="col-md-1">:</div>
                                        <div class="col-md-6">{{manualTest[0].lane_type_name}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-1">
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">Vehicle Class</div>
                                        <div class="col-md-1">:</div>
                                        <div class="col-md-6">{{manualTest[0].vehicle_class_name}}</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">Registration No</div>
                                        <div class="col-md-1">:</div>
                                        <div class="col-md-6">{{manualTest[0].registration_no}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-1">
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">Test Start Time</div>
                                        <div class="col-md-1">:</div>
                                        <div class="col-md-6">{{formatDate(manualTest[0].entry_time)}}</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">Test Complete Time</div>
                                        <div class="col-md-1">:</div>
                                        <div class="col-md-6">{{formatDate(manualTest[0].exit_time)}}</div>
                                    </div>
                                </div>
                            </div>

                          <div class="row mb-1">
                            <div class="col-md-6">
                              <div class="row">
                                <div class="col-md-4">Chassis No</div>
                                <div class="col-md-1">:</div>
                                <div class="col-md-6">{{manualTest[0].chassis_no}}</div>
                              </div>
                            </div>
                          </div>

                        </div>

                        <h3 class="card-title mt-3"><b>Item Wise Test Result</b></h3>

                        <div class="col-md-12 col-sm-12 border">
                            <table class="table">
                                <thead class="table-light">
                                <th scope="col">Test Name</th>
                                <th scope="col">Result</th>
                                </thead>
                                <tbody>
                                <tr v-for="item in manualTest">
                                    <td>{{item.test_item_name}}</td>

                                    <td v-if="item.item_result_yn == 'P'">PENDING</td>
                                    <td v-if="item.item_result_yn == 'Y'" class="text-success">PASS</td>
                                    <td v-if="item.item_result_yn == 'N'" class="text-danger">FAILED</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>


                        <div class="col-md-12 col-sm-12 border mt-4" v-if="automatedTest.test_type_id == 2">
                            <h3 class="card-title mt-3"><b>Automated Test</b></h3>
                            <hr>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">Center Name</div>
                                        <div class="col-md-1">:</div>
                                        <div class="col-md-6">{{automatedTest.center_name}}</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">Center Address</div>
                                        <div class="col-md-1">:</div>
                                        <div class="col-md-6">{{automatedTest.location_address}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">Inspection Date</div>
                                        <div class="col-md-1">:</div>
                                        <div class="col-md-6">{{automatedTest.inspection_date}}</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">Lane No</div>
                                        <div class="col-md-1">:</div>
                                        <div class="col-md-6">{{automatedTest.lane_no}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">Lane Details</div>
                                        <div class="col-md-1">:</div>
                                        <div class="col-md-6">{{automatedTest.lane_description}}</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">Lane Type</div>
                                        <div class="col-md-1">:</div>
                                        <div class="col-md-6">{{automatedTest.lane_type_name}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">Vehicle Class</div>
                                        <div class="col-md-1">:</div>
                                        <div class="col-md-6">{{automatedTest.vehicle_class_name}}</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">Registration No</div>
                                        <div class="col-md-1">:</div>
                                        <div class="col-md-6">{{automatedTest.registration_no}}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-4">Item Result</div>
                                        <div class="col-md-1">:</div>
                                        <div class="col-md-6">
                                            <p v-if="automatedTest.item_result_yn == 'P'" class="text-success"><b>Pass</b>
                                            </p>
                                            <p class="text-danger" v-else-if="manualTest.item_result_yn == 'N'"><b>Fail</b>
                                            </p>
                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>

                        <div class="row" v-if="!printStatus">
                          <div class="mt-2 text-center font-weight-bold"> <span v-html="message"></span></div>
                            <div class="col-md-12 mt-4 p-2 text-center">
                                <button v-if="!isLoading && (final_result_status !=='Y')" class="btn btn-md btn-primary"
                                        @click="resultPublish()">Result Publish
                                </button>

                            </div>
                            <Loader class="col-12 mt-5" :loading="isLoading"></Loader>
                        </div>

                        <div class="col-md-12 p-0 mt-4 text-center" v-if="printStatus">
                            <div class="card">
                                <div class="card-body">
                                    <h2 class="card-title float-start mt-2"><b><div v-html="message"></div></b></h2>
                                    <button v-if="!isPrint" class="btn btn-md btn-primary float-end"
                                            @click="printresult(print_url)"><i class="bx bx-printer"></i> Print Now
                                    </button>
                                    <button v-if="isPrint" class="btn btn-outline-primary float-end" type="button">
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


import moment from "moment";
import Loader from "../common/Loader";

export default {
        name: 'fitnesscheckData',
        props: ['statuss', 'resData'],
        components: {Loader},
        data() {
            return {
                pageTitle: 'Result',
                manualTest: [],
                automatedTest: [],
                showResult: false,
                print_url: '#',
                message: '',
                printStatus: false,
                isLoading: false,
                isError: false,
                isPrint: false,
                final_result_status: null,
                final_result_message: '',


            }

        },
        watch: {
            statuss(data) {
                this.showResult = data;
            },
            resData(newData, oldData) {
                if (newData.data.status) {
                    this.showResult= newData.data.status;
                    this.manualTest = newData.data.data.vehicle_inspection_result_list_data;
                    this.automatedTest = newData.data.data.vehicle_inspection_result_list_data[1];
                    this.final_result_status = newData.data.data.final_result_status;
                    try {
                        let message = (newData.data.data.final_result_message).split(" ");
                        message[6] = (message[6]=="PASSED")?"<span class='text-success'>"+message[6]+"</span>":"<span class='text-danger'>"+message[6]+"</span>";
                        this.message = message.join(" ");
                    }catch (e) {
                        this.message = newData.data.data.final_result_message;
                    }

                    // this.final_result_message = newData.data.data.final_result_message;
                  this.print_url = process.env.MIX_API_URL + '/print/result?lane_que_id=' + this.manualTest[0].lane_queue_id;
                    this.isError = false;
                }else{
                    this.showResult= newData.data.status;
                    this.message = newData.data.message;
                    this.isError = true;
                }
                this.printStatus = (newData.data.data.final_result_status =='Y')?true:false;
            }
        },
        created() {
        },
        mounted() {

        },
        methods: {
            formatDate(value) {
                return moment(value).format("DD-MMM-YYYY")

            },

            async resultPublish() {
                var that = this;
                this.isLoading = true;
                const params = {
                    center_id: this.manualTest[0].center_id,
                    lane_queue_id: this.manualTest[0].lane_queue_id,

                };

                this.axios
                    .post(process.env.MIX_API_URL + '/appointment/result-publish', params,{ headers: {
                            'Content-Type': 'multipart/form-data'
                        }})
                    .then(response => {
                        var data = response.data;

                        if (data.status) {
                            this.printStatus = true;
                            this.$toastr.success(data.message);
                            try {
                                let message = data.message.split(" ");
                                message[6] = (message[6]=="PASSED")?"<span class='text-success'>"+message[6]+"</span>":"<span class='text-danger'>"+message[6]+"</span>";
                                this.message = message.join(" ");
                            }catch (e) {
                                this.message = data.message;
                            }

                            this.isLoading = false;
                        } else {
                            this.$toastr.error(response.message);
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


            },
            printresult(print_url) {
                // this.$htmlToPaper('printMe');
                // window.open(print_url, '_blank');
                // this.axios.get(print_url, {responseType: 'blob'})
                this.isPrint = true;
                this.axios.get(print_url,{responseType: 'blob'})
                    .then((response) => {
                        window.open(window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'})));
                        setInterval(()=>{
                            this.isPrint = false;
                        },2000)
                    }).catch(error => {
                    this.$toastr.error('Something went wrong. Please try again later!');

                });

            },

        },

        computed: {}
    }
</script>