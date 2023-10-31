<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb :title="pageTitle"/>
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div v-if="userType==1" class="col-md-3 col-xm-12">
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
                                <div class="col-md-2 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">Stages </label>
                                        <b-form-select class="form-select" v-model="stage" :options="stageList"
                                                       name="stage">
<!--                                            <ul v-if="v$.stage.$error" class="parsley-errors-list filled">-->
<!--                                                <li class="parsley-required">The field is required.</li>-->
<!--                                            </ul>-->

                                        </b-form-select>
                                    </div>
                                </div>
                                <div class="col-md-2 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">Registration No </label>
                                        <input class="form-control"
                                               v-model="regNumber"
                                               name="regNumber" />
                                    </div>
                                </div>
                                <div class="col-md-2 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">From Date <span class="text-danger">*</span></label>
                                        <Datepicker :isLabelRequired="false" :format="format" :modelValue="from_date"
                                                    :isDisable="true"
                                                    :valueTypeFormat="valueTypeFormat" @onDateChanged="fromDate"/>
                                        <ul v-if="v$.from_date.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-2 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">End Date <span class="text-danger">*</span></label>
                                        <Datepicker :isLabelRequired="false" :format="format" :modelValue="end_date"
                                                    :isDisable="true"
                                                    :valueTypeFormat="valueTypeFormat" @onDateChanged="endDate"/>
                                        <ul v-if="v$.end_date.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-12 col-xm-12 mt-4 p-2">
                                    <div class="mb-3">
                                        <button v-if="!isLoading" class="btn btn-primary float-end"
                                                type="button" @click="search">Search
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
                    <div v-if="isShow" class="card">
                        <div class="card-body">
                            <div class="row">
                                <b-row>
                                    <b-col lg="2" md="4" class="my-2 col-4">
                                        <b-form-group
                                            class="mb-0"
                                        >
                                            <b-form-select
                                                id="per-page-select"
                                                v-model="perPage"
                                                :options="pageOptions"
                                                @change="handlePageSizeChange"
                                                size="sm"
                                                class="col-md-4"
                                            ></b-form-select>
                                        </b-form-group>
                                    </b-col>
                                    <b-col lg="8" md="4" class="my-2 col-4"></b-col>
                                    <b-col lg="2" md="4" class="my-2 col-4 text-right">
                                        <button v-if="!isPdfLoading && !isBusy" class="btn btn-outline-success float-end" @click="exportPdf()">
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
                                         :busy="isBusy"
                                >
                                    <template #table-busy>
                                        <div class="text-center text-danger my-2">
                                            <b-spinner class="align-middle"></b-spinner>
                                            <strong>Loading...</strong>
                                        </div>
                                    </template>
                                    <template #cell(index)="data">
                                        {{(currentPage-1)*perPage+data.index+1}}
                                    </template>

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
            </div>
        </div>
    </div>
</template>

<script>
    import Breadcrumb from "../components/common/Breadcrumb";
    import useVuelidate from "@vuelidate/core";
    import {required} from "@vuelidate/validators";
    import Datepicker from "../components/common/Datepicker";
    import {dateTimeFormatterMixin} from "../mixins/dateTimeFormatterMixin";


    export default {
        name: "ReportStage",
        components: {Breadcrumb, Datepicker},
        mixins:[dateTimeFormatterMixin],
        data() {
            return {
                pageTitle: 'Stage Wise Report',
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false},
                    {key: 'registration_no', label: 'Registration No', sortable: true, sortDirection: 'desc', tdClass: "p-1"},
                    {key: 'appointment_id', label: 'Appointment ', sortable: false},
                    {
                        key: 'test_steps_name',
                        label: 'Stage Completed',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return value;
                        },
                        tdClass: "p-1"

                    },
                    {
                        key: 'lane_queue_id',
                        label: 'Lane Queue',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return value;
                        },
                        tdClass: "p-1"

                    },
                    {
                        key: 'inspection_date',
                        label: 'Inspection Date',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return this.mixinFormatDate(value);
                        },
                        tdClass: "p-1"

                    },
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: process.env.MIX_TABLE_ROW_PER_PAGE,
                sortBy: '',
                sortDesc: true,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
                stage: 'all',
                stageList: [],
                from_date: null,
                end_date: null,
                status: null,
                disableDateArray: [],
                format: "MM/DD/YYYY",
                valueTypeFormat: 'YYYY-MM-DD',
                isLoading: false,
                isShow: false,
                regNumber:null,
                isPdfLoading:false,
                center_id: (this.$store.getters.getUser.data.center_id !==null)?this.$store.getters.getUser.data.center_id:null,
                userType: this.$store.getters.getUser.data.user_type_id,
                centerList: [],
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                // stage: {required},
                from_date: {required},
                end_date: {required},
            }
        },
        mounted() {
            this.getStage();
            // this.getBoothList();
            this.getCenterList();
        },
        methods: {
            onFiltered(filteredItems) {
                if (this.prevFilter != this.filter) {
                    this.currentPage = 1
                    this.search()
                    this.prevFilter = this.filter
                }
            },
            onSorted(sortItem) {
                this.currentPage = 1
                this.search()
            },
            handlePageChange(pageNo) {
                this.currentPage = pageNo
                this.search();
            },
            handlePageSizeChange(value) {
                this.perPage = value;
                this.currentPage = 1;
                this.search();
            },
            resetForm() {
                this.stage = 'all';
                this.from_date = null;
                this.end_date = null;
                this.regNumber = null;
                this.isShow = false;
                this.center_id = (this.$store.getters.getUser.data.center_id !==null)?this.$store.getters.getUser.data.center_id:null;
                this.v$.$reset();
            },
            search() {
                this.v$.$validate()
                if (!this.v$.$error) {
                    this.isLoading = true;
                    this.isBusy = true;
                    this.items = [];
                    const params = {
                        'stageId': (this.stage=='all')?-1:this.stage,
                        'regNum': this.regNumber,
                        'from_date': this.from_date,
                        'end_date': this.end_date,
                        'per_page': this.perPage,
                        'page': this.currentPage,
                        'sort_by': this.sortBy,
                        'sort_type': (this.sortDesc) ? 'desc' : 'asc',
                        'search': this.filter,
                        'center_id': this.center_id
                    };
                    this.axios
                        .get(process.env.MIX_API_URL + '/report/get-stage-datatable', {params: params})
                        .then(response => {
                            var res = response.data;
                            if (res.status) {
                                this.items = res.data.data;
                                this.currentPage = res.data.current_page;
                                this.totalRows = res.data.total;
                                this.perPage = res.data.per_page;
                                // this.regNumber = params.regNumber;
                                this.from_date = params.from_date;
                                this.end_date = params.end_date;
                            }
                            this.isLoading = false;
                            this.isBusy = false;
                            this.isShow = true;

                        })
                        .catch(error => {
                            this.$toastr.error(error.response.data.message);
                            this.isLoading = false;
                            this.isBusy = false;
                        })
                        .finally(() => {
                            this.isLoading = false;
                            this.isBusy = false;
                        });
                }
            },
            fromDate(data) {
                this.from_date = data;
            },
            endDate(data) {
                this.end_date = data;
            },
            getStage() {
                this.isLoading = true;
                this.axios
                    .get(process.env.MIX_API_URL + '/common/inspection-stage', {})
                    .then(response => {
                        this.stageList = (response.status) ? response.data.data : [];
                    })
                    .catch(error => {
                        this.isLoading = false;
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            },
            getBoothList() {
                this.axios
                    .get(process.env.MIX_API_URL + '/common/booths/' + this.$store.getters.getUser.data.center_id, {})
                    .then(response => {
                        this.boothList = (response.status) ? response.data.data : [];
                    })
                    .catch(error => {
                        //this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },
            exportPdf() {
                const params = {
                    'stageId': this.stage,
                    'regNum': this.regNumber,
                    'from_date': this.from_date,
                    'end_date': this.end_date,
                    'per_page': this.perPage,
                    'page': this.currentPage,
                    'sort_by': this.sortBy,
                    'sort_type': (this.sortDesc) ? 'desc' : 'asc',
                    'center_id': this.center_id,
                };
                this.isPdfLoading = true;
                this.axios.get(process.env.MIX_API_URL+'/report/get-stage-pdf',{params:params,responseType: 'blob'})
                    .then((response) => {
                        window.open(window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'})));
                    })
                    .catch(error => {
                        this.$toastr.error('Something went wrong. Please try again later!');
                    })
                    .finally(() => {
                        this.isPdfLoading = false;
                    });
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

<style scoped>

</style>
