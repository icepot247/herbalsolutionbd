<template>
    <div>
        <div class="main-content">

            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb :title="title"/>

                    <div class="row">
                        <div class="col-xl-12">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-12">
                                                <div class="row">

                                                    <div v-if="(userType==1)" class="col-md-3 col-xm-12">
                                                        <div class="mb-3">
                                                            <label class="form-label">Select Center
                                                                <!--                                            <span class="text-danger">*</span>-->
                                                            </label>
                                                            <b-form-select  class="form-select"
                                                                            v-model="center_id" :options="centerList"
                                                                            name="center_id">
                                                                <template #first>
                                                                    <b-form-select-option :value="null"> All </b-form-select-option>
                                                                </template>
                                                            </b-form-select>
                                                            <!--                                        <ul v-if="v$.center_id.$error" class="parsley-errors-list filled">-->
                                                            <!--                                            <li class="parsley-required">The field is required.</li>-->
                                                            <!--                                        </ul>-->

                                                        </div>
                                                    </div>


                                                    <div class="col-md-3 col-xm-12">
                                                        <div class="mb-2">
                                                            <label class="form-label">From Date</label>
                                                            <span class="text-danger">*</span>
                                                            <Datepicker :isLabelRequired="false" :format="format" :modelValue="from_date"
                                                                :isDisable="true"
                                                                :valueTypeFormat="valueTypeFormat" @onDateChanged="fromdate"/>
                                                            <ul v-if="v$.from_date.$error" class="parsley-errors-list filled">
                                                                <li class="parsley-required">The field is required.</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div class="col-md-3 col-xm-12">
                                                        <div class="mb-3">
                                                            <label class="form-label">End Date</label>
                                                            <span class="text-danger">*</span>
                                                            <Datepicker :isLabelRequired="false" :format="format" :modelValue="end_date"
                                                                :isDisable="true"
                                                                :valueTypeFormat="valueTypeFormat" @onDateChanged="enddate"/>
                                                            <ul v-if="v$.end_date.$error" class="parsley-errors-list filled">
                                                                <li class="parsley-required">The field is required.</li>
                                                            </ul>
                                                        </div>
                                                    </div>



                                                    <div :class="(userType==1)?'col-md-3 col-xm-12 mt-4 p-2':'col-md-6 col-xm-12 mt-4 p-2'" class="">
                                                        <button v-if="!isLoading" class="btn btn-primary float-end"
                                                                type="button" @click.prevent="submitForm()"> {{this.btnName}}
                                                        </button>
                                                        <button @click="resetForm" v-if="!isLoading"
                                                                class="btn btn-danger mr-2 float-end"
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


                            <!-- <DeviceSetupTable :formData="sendToTable" @sendToPage="getFromTable" /> -->
                            <div id="hide" v-show='toggle'>
                                <div class="card">
                                    <div class="card-body">
                                        <div class="row">

                                            <h3 class="card-title">Result Statistics</h3>
                                            <div class="col-md-3 ">
                                                <div class="card card-bg-primary text-white-50">
                                                    <div class="card-body">
                                                        <div class="row">
                                                            <div class="col-md-4">
                                                                <i class="fas fa-car fa-4x text-white"></i>
                                                            </div>
                                                            <div class="col-md-8">
                                                                <p class="h6 text-white"> Total Vehicle Check</p>
                                                                <p class="h4 text-white"> {{totalVehicleCheck}}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-3 ">
                                                <div class="card card-bg-success text-white-50">
                                                    <div class="card-body">
                                                        <div class="row">
                                                            <div class="col-md-4">
                                                                <i class="fas fa-bookmark fa-4x text-white"></i>
                                                            </div>
                                                            <div class="col-md-8">
                                                                <p class="h6 text-white"> Pass</p>
                                                                <p class="h4 text-white"> {{totalPass}}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-3 ">
                                                <div class="card card-bg-danger text-white-50">
                                                    <div class="card-body">
                                                        <div class="row">
                                                            <div class="col-md-4">
                                                                <i class="fas fa-bookmark fa-4x text-white"></i>
                                                            </div>
                                                            <div class="col-md-8">
                                                                <p class="h6 text-white"> Fail</p>
                                                                <p class="h4 text-white"> {{totalFail}}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-3 ">
                                                <div class="card card-bg-info text-white-50">
                                                    <div class="card-body">
                                                        <div class="row">
                                                            <div class="col-md-4">
                                                                <i class="fas fa-bookmark fa-4x text-white"></i>
                                                            </div>
                                                            <div class="col-md-8">
                                                                <p class="h6 text-white"> Incomplete</p>
                                                                <p class="h4 text-white"> {{totalPending}}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <h3 class="card-title">Result Published List</h3>
                                        <b-row>
                                            <b-col lg="3" md="4" class="my-2 col-4">
                                                <b-form-group
                                                    class="mb-0"
                                                >
                                                <!-- <button class="btn btn-primary float-end mb-3" > -->

                                                        <!-- </button> -->
                                                    <b-form-select
                                                        id="per-page-select"
                                                        v-model="perPage"
                                                        :options="pageOptions"
                                                        @change="handlePageSizeChange"
                                                        size="sm"
                                                        class="col-md-4"
                                                    ></b-form-select>
                                                    <!-- <i class="mdi mdi-file-pdf" @click.prevent="getPdfReport()" target="_blank" tooltips="Export to PDF"></i> -->
<!--                                                    <i class="fas fa-file-pdf" @click.prevent="getPdfReport()" target="_blank" tooltips="Export to PDF" id="res-pdf"></i>-->
                                                </b-form-group>

                                            </b-col>
                                            <b-col lg="6" md="4" class="my-2 col-4"></b-col>
                                            <b-col lg="3" md="4" class="my-2 col-4">
                                                <button v-if="!isPdfLoading && !isBusy && items.length>0" class="btn btn-outline-success float-end" @click="exportPdf()">
                                                    <i class="bx bxs-file-pdf"></i> Export PDF
                                                </button>
                                                <button v-if="isPdfLoading" class="btn btn-outline-success float-end" type="button">
                                                    <div class="spinner-border"
                                                         style="height: 1rem !important; width: 1rem !important;">
                                                        <span class="visually-hidden">Processing...</span>
                                                    </div>
                                                </button>
                                            </b-col>
                                        </b-row>
                                        <b-table ref="table"
                                                class="mt-2"
                                                :items="items"
                                                :fields="fields"
                                                :filter="filter"
                                                :filter-included-fields="filterOn"
                                                :sort-by.sync="sortBy"
                                                :sort-desc.sync="sortDesc"
                                                :sort-direction="sortDirection"
                                                show-empty
                                                sort-icon-left
                                                @filtered="onFiltered"
                                                @sort-changed="onSorted"
                                                responsive
                                                :busy="isLoading"
                                        >
                                            <template #cell(index)="data">
                                                {{(currentPage-1)*perPage+data.index+1}}
                                            </template>
                                            <template #cell(passed_yn)="data">
                                                <span v-if="(data.unformatted=='PASS')" class="text-success">{{data.value}}</span>
                                                <span v-if="(data.unformatted=='FAIL')" class="text-danger">{{data.value}}</span>
                                                <span v-if="(data.unformatted=='INCOMPLETE')" style="color:#FF9800 ">{{data.value}}</span>
                                            </template>


                                        </b-table>
                                        <b-tfoot class="float-end">
                                            <b-tr>
                                                <b-td colspan="7" variant="" class="text-right float-end">
                                                    {{to}} out of {{totalRows}}
                                                </b-td>
                                            </b-tr>
                                        </b-tfoot>
                                        <b-row>
                                            <b-col sm="12" md="12" class="mt-2">
                                                <b-pagination
                                                    v-model="currentPage"
                                                    :total-rows="totalRows"
                                                    :per-page="perPage"
                                                    @change="handlePageChange"
                                                    align="center"
                                                    class="my-0"
                                                ></b-pagination>
                                            </b-col>
                                        </b-row>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <!-- end col -->
                    </div>


                </div> <!-- container-fluid -->
            </div>
            <!-- End Page-content -->


        </div>
    </div>
</template>

<script>
    import useVuelidate from "@vuelidate/core";
    import {required,requiredIf} from "@vuelidate/validators";
    import Breadcrumb from "../components/common/Breadcrumb";
    import Datepicker from "../components/common/Datepicker";
    import DefaultLayout from "../layouts/DefaultLayout";
    // import DeviceSetupForm from "../components/deviceSetup/DeviceSetupForm";
    // import DeviceSetupTable from "../components/deviceSetup/DeviceSetupTable";



    export default {
        name: "ReportResult",
        components: {Breadcrumb, Datepicker},
        data() {
            return {
                toggle:false,
                isLoading: false,
                isBusy: false,
                regNumber: null,
                from_date: '',
                end_date: '',
                status: null,
                disableDateArray : [],

                format: "MM/DD/YYYY",
                valueTypeFormat : 'YYYY-MM-DD',
                btnName: 'Search',
              //  sendToForm:null,
                sendToTable:null,
                title:'Result Report',
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false},
                    {
                        key: 'inspection_date',
                        label: 'Inspection Date',
                        sortable: false,
                        tdClass: "p-1 text-center",
                        thClass:'text-center'

                    },
                    {
                        key: 'center_name',
                        label: 'Center Name',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1"

                    },
                    {
                        key: 'registration_no',
                        label: 'Registration No',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1"

                    },
                    {
                        key: 'lane_type_name',
                        label: 'Lane Type',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1"

                    },
                    {
                        key: 'lane_no',
                        label: 'Lane No',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1 text-center",
                        thClass:'text-center'

                    },

                    {
                        key: 'passed_yn',
                        label: 'Result',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            if(value=="PASS"){
                                return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                            }else if(value=="FAIL"){
                                return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                            }else if(value=="INCOMPLETE"){
                                return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                            }

                        },
                        // tdClass: (value, key, item) => {
                        //     return ( value == 'Y') ? ' text-success' : ' text-danger';
                        // },
                    }
                    // {
                    //     key: 'active_yn',
                    //     label: 'Status',
                    //     sortable: false,
                    //     sortDirection: 'desc',
                    //     formatter: (value, key, item) => {
                    //         return (value == 'Y') ? 'Active' : 'Inactive';
                    //     },
                    //     tdClass: (value, key, item) => {
                    //         return ( value == 'Y') ? ' text-success' : ' text-danger';
                    //     },
                    // },
                    // {key: 'actions', label: 'Actions', class: 'text-right', tdClass: "p-1"}
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: process.env.MIX_TABLE_ROW_PER_PAGE,
                sortBy: '',
                sortDesc: true,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
                isPdfLoading:false,
                totalPass:null,
                totalFail:null,
                totalPending:null,
                totalVehicleCheck :null,
                centerList :[],
                center_id: (this.$store.getters.getUser.data.center_id !==null)?this.$store.getters.getUser.data.center_id:null,
                to:null,
                userType: this.$store.getters.getUser.data.user_type_id,
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        validations() {
            return {

                from_date: {
                    required
                },
                end_date: {
                    required
                },
            }
        },
        mounted() {
            this.getCenterList();
        },
        methods: {
             onFiltered(filteredItems) {
                // this.totalRows = filteredItems.length
                if (this.prevFilter != this.filter) {
                    this.currentPage = 1
                    this.submitForm()
                    this.prevFilter = this.filter
                }
            },
            onSorted(sortItem) {
                this.currentPage = 1
                this.submitForm()
            },
            handlePageChange(pageNo) {
                this.currentPage = pageNo
                this.submitForm();
            },
            // getFromTable(data){
            //     this.title = "Result Published Report"
            //     this.sendToForm = data;
            // },
            getFormData(data){
                this.title = "Result Published Report"
                this.sendToTable = data;

            },
            async submitForm(){
                 if(await this.v$.$validate()){
                     this.isLoading = true;
                     const params = {
                         'center_id' : this.center_id,
                         'from_date' : this.from_date,
                         'end_date' : this.end_date,
                         'per_page': this.perPage,
                         'page': this.currentPage,
                         'sort_by': this.sortBy,
                         'sort_type': (this.sortDesc) ? 'desc' : 'asc',
                         'search': this.filter
                     };
                     //    console.log(params);
                     this.axios
                         .get(process.env.MIX_API_URL + '/report/get-result-publish',{params, headers: {
                                 'Content-Type': 'application/json'
                             }})
                         .then(response => {
                             var res = response.data;
                             if (res.status) {
                                 this.toggle = true;
                                 this.items = res.data.data;
                                 this.currentPage = res.data.current_page;
                                 this.totalRows = res.data.total;
                                 this.perPage = res.data.per_page;
                                 this.to = res.data.to;
                                 this.regNumber = params.regNumber;
                                 this.from_date = params.from_date;
                                 this.end_date = params.end_date;
                                 this.totalPass = res.data.statisticalData.totalPass;
                                 this.totalFail = res.data.statisticalData.totalFail;
                                 this.totalPending = res.data.statisticalData.totalPending;
                                 this.totalVehicleCheck = res.data.statisticalData.totalVehicleCheck;
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

            fromdate(data){
                this.from_date = data;
            },
            enddate(data){
                this.end_date = data;
            },

            async getPdfReport(){
                this.isLoading = false;
                const params = {
                    'center_id' : this.center_id,
                    'from_date' : this.from_date,
                    'to_date' : this.end_date
                }
          //  console.log(params);
          //  return false;
                this.axios.post(process.env.MIX_API_URL + '/report/get-result-pdf', {params: params})
                .then( )
                .catch()
                .finally();
            },
            exportPdf() {
                const params = {
                    'center_id' : this.center_id,
                    'from_date' : this.from_date,
                    'end_date' : this.end_date,
                    /*'per_page': this.perPage,
                    'page': this.currentPage,
                    'sort_by': this.sortBy,
                    'sort_type': (this.sortDesc) ? 'desc' : 'asc',
                    'search': this.filter*/
                };
                this.isPdfLoading = true;
                this.axios.get(process.env.MIX_API_URL+'/report/get-result-publish-pdf', {params:params,responseType: 'blob'})
                    .then((response) => {
                        return window.open(window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'})));
                    })
                    .catch(error => {
                        console.log(error)
                        this.$toastr.error('Something went wrong. Please try again later!');
                    })
                    .finally(() => {
                        this.isPdfLoading = false;
                    });
            },
            resetForm() {
                this.from_date = '';
                this.end_date = '';
                this.regNumber = null;
                this.toggle = false;
                this.center_id = (this.$store.getters.getUser.data.center_id !==null)?this.$store.getters.getUser.data.center_id:null;
                this.v$.$reset();
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
            handlePageSizeChange(value) {
                this.perPage = value;
                this.currentPage = 1;
                this.submitForm();
            },
        },
        computed: {}

    }
</script>

<style scoped>
    /* #hide{display: ;} */
    #res-pdf{
        cursor: pointer;
    }
</style>
