<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb title="Home"/>
                    <div class="row">
                        <div class="col-md-4 ">
                            <div class="card card-bg-primary text-white-50">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <i class="fas fa-file-alt fa-3x text-white"></i>
                                        </div>
                                        <div class="col-md-8">
                                            <p class="h6 text-white"> Total Applications</p>
<!--                                            <p class="h5 text-white"> {{totalApplication}}</p>-->
                                          <p class="h5 text-white"> {{totalApplication}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 ">
                            <div class="card card-bg-success text-white-50">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <i class="fas fa-list fa-3x text-white"></i>
                                        </div>
                                        <div class="col-md-8">
                                            <p class="h6 text-white"> Total Results</p>
<!--                                            <p class="h5 text-white"> {{totalResult}}</p>-->
                                          <p class="h5 text-white"> {{totalResult}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 ">
                            <div class="card card-bg-info text-white-50">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <i class="far fa-bookmark fa-3x text-white"></i>
                                        </div>
                                        <div class="col-md-8">
                                            <p class="h6 text-white"> Total Certificates</p>
<!--                                            <p class="h5 text-white"> {{totalCertificate}}</p>-->
                                          <p class="h5 text-white"> {{totalCertificate}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                  <div class="row">
                    <div class="col-md-4 ">
                      <div class="card card-bg-warning text-white-50">
                        <div class="card-body">
                          <div class="row">
                            <div class="col-md-4">
                              <i class="fas fa-file-alt fa-3x text-white"></i>
                            </div>
                            <div class="col-md-8">
                              <p class="h6 text-white"> Today's Application</p>
                              <p class="h5 text-white"> {{todayApplication}}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4 ">
                      <div class="card bg-info text-white-50">
                        <div class="card-body">
                          <div class="row">
                            <div class="col-md-4">
                              <i class="fas fa-list fa-3x text-white"></i>
                            </div>
                            <div class="col-md-8">
                              <p class="h6 text-white"> Today's Result</p>
                              <p class="h5 text-white"> {{todayResult}}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4 ">
                      <div class="card card-bg-danger text-white-50">
                        <div class="card-body">
                          <div class="row">
                            <div class="col-md-4">
                              <i class="far fa-bookmark fa-3x text-white"></i>
                            </div>
                            <div class="col-md-8">
                              <p class="h6 text-white"> Today's Certificate</p>
                              <p class="h5 text-white"> {{todayCertificate}}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>


                    <div class="row mt-4">
                        <TotalPieChart :styleClass="'col-md-4'"  ></TotalPieChart>
<!--                        <LineChart :styleClass="'col-md-8'" ></LineChart>-->
                        <BarChart :styleClass="'col-md-8'" ></BarChart>
                    </div>
                    <div class="row mt-4">
                        <div   v-if="queList.length > 0" :class="nexts.length > 0? 'col-md-6':'col-md-12'">
                            <p class="h3 text-left"> Serving Queue</p>
                            <table class="table ">
                                <thead>
                                <tr class="bg-dark">
                                    <th scope="col">
                                        <p class="h3 text-white text-center font-weight-bold">Lane No.</p>
                                    </th>
                                    <th scope="col">
                                        <p class="h3 text-white text-center font-weight-bold">Que No.</p>
                                    </th>
                                    <th scope="col">
                                        <p class="h3 text-white text-center font-weight-bold">Reg./Chassis No.</p>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(que,key) in queList" class="bg-light">
                                    <td>
                                        <p class="h4 text-dark text-center ">{{que.lane_no}}</p>
                                    </td>
                                    <td>
                                        <p class="h4 text-dark text-center">{{que.queue_no}}</p>
                                    </td>
                                    <td>
<!--                                  <p class="h4 text-dark text-center">{{que.registration_no}}</p>-->
                                      <p v-if="que.registration_no" class="h4 text-dark text-center">{{que.registration_no}}</p>
                                      <p v-else class="h4 text-dark text-center">{{que.chassis_no}}</p>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div  v-if="nexts.length > 0"  :class="nexts.length > 0? (queList.length==0) ?'col-md-12':'col-md-6' :'col-md-12'">
                            <p class="h3 text-left"> Upcoming Queue</p>

                            <table class="table">
                                <thead>
                                <tr class="bg-dark">
                                    <th scope="col">
                                        <p class="h3 text-white text-center font-weight-bold">Lane No.</p>
                                    </th>
                                    <th scope="col">
                                        <p class="h3 text-white text-center font-weight-bold">Queue No.</p>
                                    </th>
                                    <th scope="col">
                                        <p class="h3 text-white text-center font-weight-bold">Reg./Chassis No.</p>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(que,key) in nexts"  class="bg-light">
                                    <td>
                                        <p class="h4 text-dark text-center ">{{que.lane_no}}</p>
                                    </td>
                                    <td>
                                        <p class="h4 text-dark text-center">{{que.queue_no}}</p>
                                    </td>
                                    <td>
                                        <p v-if="que.registration_no" class="h4 text-dark text-center">{{que.registration_no}}</p>
                                        <p v-else class="h4 text-dark text-center">{{que.chassis_no}}</p>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import DefaultLayout from "../layouts/DefaultLayout";
    import Breadcrumb from "../components/common/Breadcrumb";
    import TotalPieChart from "../components/home/TotalPieChart";
    import LineChart from "../components/home/LineChart";
    import BarChart from "../components/home/BarChart";


    export default {
        name: 'HomePage',
        components: {Breadcrumb,TotalPieChart,LineChart,BarChart},
        data() {
            return {
                tableColorList:[
                    'bg-success',
                    'bg-primary',
                    'bg-info',
                    'bg-warning',
                    'bg-danger',
                    'bg-info',
                ],
                queList:[],
                timeInterval:null,
                nexts:[],
                todayApplication:null,
                totalApplication:null,
                todayResult:null,
                totalResult:null,
                todayCertificate:0,
                totalCertificate:0,
            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
            this.getTotal();
            this.getQueList()
        },
        mounted() {

            this.timeInterval = setInterval(()=>{
                if(this.$route.name =='home'){
                    this.getTotal();
                    this.getQueList();
                }
            },30000)

        },
        methods: {
            getQueList(){
                if(this.$store.getters.getUser.data.center_id !==null){
                    this.axios
                        .get(process.env.MIX_API_URL + '/screen/que/'+this.$store.getters.getUser.data.center_id, {})
                        .then(response => {
                            this.queList = (response.status) ? response.data.data.current : [];
                            this.nexts = (response.status) ? response.data.data.next : [];
                        })
                        .catch(error => {
                            // this.$toastr.error(error.response.data.message);
                        })
                        .finally()
                }
            },
            getTotal(){
                this.axios
                    .get(process.env.MIX_API_URL + '/dashboard/total', {})
                    .then(response => {
                        this.todayApplication = (response.status) ? response.data.data.application.today_application : [];
                        this.totalApplication = (response.status) ? response.data.data.application.total_application : [];
                        this.todayResult = (response.status) ? response.data.data.result.today_result : [];
                        this.totalResult = (response.status) ? response.data.data.result.total_result : [];
                        this.todayCertificate = (response.status) ? response.data.data.certificate.today_certificate : [];
                        this.totalCertificate = (response.status) ? response.data.data.certificate.total_certificate : [];
                    })
                    .catch(error => {
                        // this.$toastr.error(error.response.data.message);
                    })
                    .finally()
            },

        },
        computed:{

        }
    }
</script>

<style>
    .card-bg-primary {
        background-color: #556ee6!important;
    }
    .card-bg-success {
        background-color: #34c38f!important;
    }
    .card-bg-danger {
        background-color: #f46a6a!important;
    }
    .card-bg-info {
        background-color: #50a5f1!important;
    }
    .card-bg-warning {
        background-color: #f1b44c!important;
    }
</style>

