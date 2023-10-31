<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb :title="pageTitle"/>
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div v-if="userType==1" class="col-md-4 col-xm-12">
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
                                    <div class="mb-3">
                                        <label class="form-label">Status</label>
<!--                                        <span class="text-danger">*</span>-->
                                        <b-form-select v-model="active_status" :options="statusOptions" class="form-select"
                                                       >
                                        </b-form-select>
<!--                                        <ul v-if="v$.status.$error" class="parsley-errors-list filled">-->
<!--                                            <li class="parsley-required">The field is required.</li>-->
<!--                                        </ul>-->
                                    </div>
                                </div>
                                <div class=" col-xm-8 mt-4 p-2 float-end" :class="(userType==1)?'col-md-5':'col-md-9 '">
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
        name: "ReportInventory",
        components: {Breadcrumb, Datepicker},
        mixins:[dateTimeFormatterMixin],
        data() {
            return {
                pageTitle: 'Inventory Report',
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false},
                    {key: 'branch_name', label: 'Branch Name', sortable: false},
                    {key: 'fc_lot_no', label: 'FC Lot No', sortable: false},
                    {key: 'fc_serial_start_no', label: 'Serial Start No', sortable: false},
                    {key: 'fc_serial_end_no', label: 'Serial End No', sortable: false},
                    {
                        key: 'received_date',
                        label: 'Lot Received Date',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return this.mixinFormatDate(value);
                        },
                        tdClass: "p-1"

                    },
                    {
                        key: 'lot_finish_yn',
                        label: 'Lot Finish',
                        sortable: false,
                        formatter: (value, key, item) => {
                            return (value=='Y')?'Yes':'No';
                        },
                    },
                    {
                        key: 'available_pages',
                        label: 'Available Pages',
                        sortable: false,
                        formatter: (value, key, item) => {
                            return value;
                        },
                    },
                    {
                        key: 'active_yn',
                        label: 'Status',
                        sortable: false,
                        formatter: (value, key, item) => {
                            return (value=='Y')?'Active':'Inactive';
                        },
                        tdClass: (value)=>{
                            return (value=='Y')? 'text-success' : 'text-danger';
                        }
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
                from_date: null,
                end_date: null,
                status: null,
                disableDateArray: [],
                format: "MM/DD/YYYY",
                valueTypeFormat: 'YYYY-MM-DD',
                isLoading: false,
                isShow: false,
                invLotNumber:null,
                lotBoxNumber:null,
                statusList:[
                    {value: null, text: 'Select one'},
                    {value: 'Y', text: 'Active'},
                    {value: 'N', text: 'Inactive'},
                ],
                isPdfLoading:false,
                center_id: (this.$store.getters.getUser.data.center_id !==null)?this.$store.getters.getUser.data.center_id:null,
                centerList:[],
                statusOptions: [
                    {value: null, text: 'All',},
                    {value: 'Y', text: 'Active',},
                    {value: 'N', text: 'Inactive'},
                ],
                active_status:'Y',
                userType: this.$store.getters.getUser.data.user_type_id,
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
            }
        },
        mounted() {
            this.getCenterList();
            this.search();
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

                this.center_id = (this.$store.getters.getUser.data.center_id !==null)?this.$store.getters.getUser.data.center_id:null;
                this.isShow = false;
                this.items = [];
                this.v$.$reset();
            },
            search() {
                this.center_id = (this.$store.getters.getUser.data.center_id != null) ?
                    this.$store.getters.getUser.data.center_id : this.center_id;
                    this.isLoading = true;
                    this.isBusy = true;
                    this.items = [];
                    const params = {
                        'center_id': this.center_id,
                        'per_page': this.perPage,
                        'page': this.currentPage,
                        'sort_by': this.sortBy,
                        'sort_type': (this.sortDesc) ? 'desc' : 'asc',
                        'search': this.filter,
                        'active_status': this.active_status,
                    };
                    this.axios
                        .get(process.env.MIX_API_URL + '/report/get-inv-fc-lot',{params:params,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(response => {
                            var res = response.data;
                            if (res.status) {
                                this.items = res.data.data;
                                this.currentPage = res.data.current_page;
                                this.totalRows = res.data.total;
                                this.perPage = res.data.per_page;
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
                // }
            },
            exportPdf() {
                const params = {
                    'center_id': this.center_id,
                    'active_status': this.active_status,
                };
                this.isPdfLoading = true;
                this.axios.get(process.env.MIX_API_URL+'/report/get-inventory-pdf',{params:params,responseType: 'blob'})
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
