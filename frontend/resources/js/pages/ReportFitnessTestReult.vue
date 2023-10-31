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

                                                    <div  class="col-md-3 col-xm-12">
                                                        <div class="mb-3">
                                                            <label class="form-label">Registration Number</label>
                                                            <input class="form-control" 
                                                                        v-model="regNumber" 
                                                                        name="regNumber" />
                                                                        <!-- :class="[(v$.regNumber.$error)?'is-invalid':'']" -->
                                                            <!-- <ul v-if="v$.regNumber.$error" class="parsley-errors-list filled">
                                                                <li class="parsley-required">The field is required.</li>
                                                            </ul> -->
                                                        </div>
                                                    </div>


                                                    <div class="col-md-3 col-xm-12">
                                                        <div class="mb-3">
                                                            <label class="form-label">From Date</label>
                                                            <span class="text-danger">*</span>
                                                            <Datepicker :isLabelRequired="false" :format="format" :modelValue="from_date" 
                                                                :isDisable="true"
                                                                :valueTypeFormat="valueTypeFormat" @onDateChanged="fromdate"/>
                                                            <!-- <ul v-if="v$.deviceType.$error" class="parsley-errors-list filled">
                                                                <li class="parsley-required">The field is required.</li>
                                                            </ul> -->
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="col-md-3 col-xm-12">
                                                        <div class="mb-3">
                                                            <label class="form-label">End Date</label>
                                                            <span class="text-danger">*</span>
                                                            <Datepicker :isLabelRequired="false" :format="format" v-model="end_date"
                                                                :isDisable="true"
                                                                :valueTypeFormat="valueTypeFormat" @onDateChanged="enddate"/>
                                                            <!-- <ul v-if="v$.deviceType.$error" class="parsley-errors-list filled">
                                                                <li class="parsley-required">The field is required.</li>
                                                            </ul> -->
                                                        </div>
                                                    </div>
                                                    
                                                    
                                                    
                                                    <div class="col-md-12 col-xm-12 mt-4 p-2">
                                                        <button v-if="!isLoading" class="btn btn-primary float-end"
                                                                type="button" @click.prevent="submitForm()"> {{this.btnName}}
                                                        </button>
                                                        <a v-if="!isLoading" href="/report-result">
                                                            <button class="btn btn-danger mr-2 float-end" type="button">Cancel</button>
                                                        </a>
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
                                                        size="sm"
                                                        class="col-md-4"
                                                    ></b-form-select>
                                                    <!-- <i class="mdi mdi-file-pdf" @click.prevent="getPdfReport()" target="_blank" tooltips="Export to PDF"></i> -->
                                                    <i class="fas fa-file-pdf" @click.prevent="getPdfReport()" target="_blank" tooltips="Export to PDF" id="res-pdf"></i>
                                                </b-form-group>
                                                
                                            </b-col>
                                            <b-col lg="6" md="4" class="my-2 col-4"></b-col>
                                            <b-col lg="3" md="4" class="my-2 col-4">

                                                <b-form-group
                                                    class="mb-0"
                                                >
                                                
                                                    <b-input-group size="sm">
                                                        <b-form-input
                                                            id="filter-input"
                                                            v-model="filter"
                                                            type="search"
                                                            placeholder="Type to Search"
                                                        ></b-form-input>
                                                    </b-input-group>
                                                </b-form-group>
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
                                            
                                        </b-table>
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
        name: "ReportFitnessTestReultPage",
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
                    {key: 'index', label: 'SL', sortable: false, sortDirection: 'desc', tdClass: "p-1"},
                    {
                        key: 'inspection_date',
                        label: 'Inspection Date',
                        sortable: false,
                        tdClass: "p-1"

                    },
                    {
                        key: 'vic_center.center_name',
                        label: 'Center Name',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1"

                    },
                    {
                        key: 'registration_no',
                        label: 'Registration No',
                        sortable: true,
                        sortDirection: 'desc',
                        tdClass: "p-1"

                    },
                    
                    {
                        key: 'queue_no',
                        label: 'Queue No',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1"

                    },  {
                        key: 'vehicle_inspection.passed_yn',
                        label: 'Result',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return (value == 'Y') ? 'Passed' : 'Pending';
                        },
                        tdClass: (value, key, item) => {
                            return ( value == 'Y') ? ' text-success' : ' text-danger';
                        },
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
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {
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
                 this.isLoading = true;
                    const params = {
                        'regNumber' : this.regNumber,
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
                        .post(process.env.MIX_API_URL + '/report/get-result-publish', params,{ headers: {
                                'Content-Type': 'multipart/form-data'
                            }})
                        .then(response => {
                            var res = response.data;
                            if (res.status) {
                                this.toggle = true;
                                this.items = res.data.data;
                                this.currentPage = res.data.current_page;
                                this.totalRows = res.data.total;
                                this.perPage = res.data.per_page;
//console.log(params);
                                this.regNumber = params.regNumber;
                                this.from_date = params.from_date;
                                this.end_date = params.end_date;
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
                    'regNumber': this.regNumber,
                    'from_date' : this.from_date,
                    'to_date' : this.end_date
                }
          //  console.log(params);
          //  return false;
                this.axios.post(process.env.MIX_API_URL + '/report/get-result-pdf', {params: params})
                .then( )
                .catch()
                .finally();
            }
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
