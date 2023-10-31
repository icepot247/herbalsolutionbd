<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb :title="pageTitle"/>
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="row">
                                        <div v-if="(userTypeId==1)"  class="col-md-3 col-xm-12">
                                            <div class="mb-3">
                                                <label class="form-label">Select Center
                                                    <span class="text-danger">*</span>
                                                </label>
                                                <b-form-select class="form-select"
                                                               v-model="center_id" :options="centerList"
                                                               @change="getBranchList"
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
                                        <div v-if="(center_id !==null)" class="col-md-3 col-xm-12">
                                            <div class="mb-3">
                                                <label class="form-label required">Branch
<!--                                                    <span class="text-danger">*</span>-->
                                                </label>
                                                <b-form-select  class="form-select" v-model="branch_id" :options="branchList"
                                                               name="branch_id"

                                                               value-field="code"
                                                               text-field="label">
                                                    <template #first>
                                                        <b-form-select-option :value="null"> All
                                                        </b-form-select-option>
                                                    </template>
                                                </b-form-select>
<!--                                                <ul v-if="v$.branch_id.$error" class="parsley-errors-list filled">-->
<!--                                                    <li class="parsley-required">The field is required.</li>-->
<!--                                                </ul>-->
                                            </div>
                                        </div>
                                        <div class="col-md-3 col-xm-12">
                                            <div class="mb-2">
                                                <label class="form-label">From Date</label>
                                                <span class="text-danger">*</span>
                                                <Datepicker :isLabelRequired="false" :format="format"
                                                            :modelValue="from_date"
                                                            :isDisable="true"
                                                            :valueTypeFormat="valueTypeFormat"
                                                            @onDateChanged="fromdate"/>

                                                <ul v-if="v$.from_date.$error" class="parsley-errors-list filled">
                                                    <li class="parsley-required">The field is required.</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="col-md-3 col-xm-12">
                                            <div class="mb-3">
                                                <label class="form-label">End Date</label>
                                                <span class="text-danger">*</span>
                                                <Datepicker :isLabelRequired="false" :format="format"
                                                            :modelValue="end_date"
                                                            :isDisable="true"
                                                            :valueTypeFormat="valueTypeFormat"
                                                            @onDateChanged="enddate"/>
                                                <ul v-if="v$.end_date.$error" class="parsley-errors-list filled">
                                                    <li class="parsley-required">The field is required.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <button v-if="!isLoading" class="btn btn-primary float-end"
                                                type="button" @click="submitForm()">
                                            {{btnName}}
                                        </button>
                                        <button v-if="isLoading" class="btn btn-primary float-end" type="button">
                                            <div class="spinner-border"
                                                 style="height: 1rem !important; width: 1rem !important;">
                                                <span class="visually-hidden">Processing...</span>
                                            </div>
                                        </button>

                                        <button @click="resetForm" v-if="!isLoading"
                                                class="btn btn-danger mr-2 float-end" type="button">Cancel
                                        </button>
                                    </div>

                                </div>
                            </div>

                            <!--Table start-->
                            <div v-if="(items.length>0)" class="card">
                                <div class="card-body">
                                    <b-row>
                                        <b-col lg="2" md="4" class="my-2 col-4">
<!--                                            <b-form-group-->
<!--                                                    class="mb-0"-->
<!--                                            >-->
<!--                                                <b-form-select-->
<!--                                                        id="per-page-select"-->
<!--                                                        v-model="perPage"-->
<!--                                                        :options="pageOptions"-->
<!--                                                        @change="handlePageSizeChange"-->
<!--                                                        size="sm"-->
<!--                                                        class="col-md-6"-->
<!--                                                ></b-form-select>-->
<!--                                            </b-form-group>-->
                                        </b-col>
                                        <b-col lg="8" md="4" class="my-2 col-4"></b-col>
                                        <b-col lg="2" md="4" class="my-2 col-4 text-right">
                                            <button v-if="items.length>0 && !isExportPdf" class="btn btn-outline-success float-end"
                                                    @click="exportPdf()">
                                                <i class="bx bxs-file-pdf"></i> Export PDF
                                            </button>
                                            <button v-if="isExportPdf" class="btn btn-outline-success float-end"
                                                    type="button">
                                                <div class="spinner-border"
                                                     style="height: 1rem !important; width: 1rem !important;">
                                                    <span class="visually-hidden">Processing...</span>
                                                </div>
                                            </button>
                                        </b-col>
                                    </b-row>
                                    <b-table :busy="isLoading"
                                             :fields="fields"
                                             :filter="filter"
                                             :filter-included-fields="filterOn"
                                             :items="items"
                                             :sort-by.sync="sortBy"
                                             :sort-desc.sync="sortDesc"
                                             :sort-direction="sortDirection"
                                             @filtered="onFiltered"
                                             @sort-changed="onSorted"
                                             class="mt-5"
                                             ref="table"
                                             responsive
                                             show-empty
                                             sort-icon-left
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

<!--                                    <b-row>-->
<!--                                        <b-col class="mt-2" md="12" sm="12">-->
<!--                                            <b-pagination-->
<!--                                                    :per-page="perPage"-->
<!--                                                    :total-rows="totalRows"-->
<!--                                                    @change="handlePageChange"-->
<!--                                                    align="center"-->
<!--                                                    class="my-0"-->
<!--                                                    v-model="currentPage"-->
<!--                                            ></b-pagination>-->
<!--                                        </b-col>-->
<!--                                    </b-row>-->

                                </div>
                            </div>
                            <div v-if="(items.length==0 && isShow) " class="card">
                                <div class="card-body">
                                    <div class="text-center font-weight-bold text-danger">No Data Found</div>
                                </div>
                            </div>
                            <!--Table end-->
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
    import useVuelidate from '@vuelidate/core'
    import {required} from '@vuelidate/validators'
    import Datepicker from "../components/common/Datepicker";

    export default {
        name: 'ReportCertificateCount',
        components: {Datepicker, Breadcrumb},
        data() {
            return {
                pageTitle: 'Certificate Count',
                isLoading: false,
                name: '',
                status: '',
                statusOptions: [
                    {value: null, text: 'Please select an option'},
                    {value: 'Y', text: 'Active'},
                    {value: 'N', text: 'Inactive'},
                ],
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false},
                    {
                        key: 'center_name',
                        label: 'Center Name',
                        sortable: false,
                        sortDirection: 'desc',
                    },
                    {key: 'branch_name', label: 'Branch Name', sortable: false, sortDirection: 'desc'},
                    {key: 'no_of_print', label: 'Printed Certificate', sortable: false, sortDirection: 'desc'},
                    {key: 'no_of_cancel_print', label: 'Canceled Certificate', sortable: false, sortDirection: 'desc'},
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: process.env.MIX_TABLE_ROW_PER_PAGE,
                sortBy: '',
                sortDesc: true,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
                shift_id: null,
                center_id: (this.$store.getters.getUser.data.center_id !==null)?this.$store.getters.getUser.data.center_id:null,
                centerList: [],
                from_date: '',
                end_date: '',
                format: "MM/DD/YYYY",
                valueTypeFormat: 'YYYY-MM-DD',
                btnName: 'Search',
                slotList: [],
                slot: null,
                isShow: false,
                branch_id: null,
                branchList: [],
                userTypeId: this.$store.getters.getUser.data.user_type_id,
                isExportPdf: false,
            }
        },

        setup() {
            return {v$: useVuelidate()}
        },

        validations() {
            return {
                from_date: {required},
                end_date: {required},
                center_id: {required},

            }
        },

        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },

        mounted() {
            this.getCenterList();
            this.getBranchList();
        },

        methods: {
            async submitForm() {
                if (await this.v$.$validate()) {
                    this.isLoading = true;
                    const params = {

                        'center_id': this.center_id,
                        'branch_id': this.branch_id,
                        'from_date': this.from_date,
                        'end_date': this.end_date,
                    };

                    this.axios
                        .get(process.env.MIX_API_URL + '/report/get-print-count', {params: params})
                        .then(response => {
                            if (response.status) {
                                this.isShow = true
                                this.items = response.data.data;
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

            resetForm() {
                this.v$.$reset()
                this.center_id = (this.$store.getters.getUser.data.center_id !==null)?this.$store.getters.getUser.data.center_id:null;
                this.branch_id = null;
                this.from_date = null;
                this.end_date = null;
                this.isShow = false;
                this.items = [];
            },

            onFiltered(filteredItems) {
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

            handlePageSizeChange(value) {
                this.perPage = value;
                this.currentPage = 1;
                this.submitForm();
            },

            exportPdf() {
                this.isExportPdf = true;
                const params = {
                    'center_id': this.center_id,
                    'branch_id': this.branch_id,
                    'from_date': this.from_date,
                    'end_date': this.end_date,
                };
                this.axios.get(process.env.MIX_API_URL + '/report/get-print-count-pdf', {
                    responseType: 'blob',
                    params: params
                })
                    .then((response) => {
                        window.open(window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'})));
                        this.isExportPdf = false;
                    }).catch(error => {
                    this.$toastr.error('Something went wrong. Please try again later!');
                    this.isExportPdf = false;

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
            fromdate(data) {
                this.from_date = data;
            },
            enddate(data) {
                this.end_date = data;
            },
            getBranchList() {
                var centerId = this.center_id
                if (this.center_id !== null) {
                    centerId = this.center_id;
                } else {
                    centerId = this.$store.getters.getUser.data.center_id;
                }
                if(this.center_id !== null){
                    this.axios.get(process.env.MIX_API_URL + '/common/brta-branch-center-wise/' + centerId, {})
                        .then(response => {
                            const res = response.data;
                            if (res.status) {
                                this.branchList = res.data;
                            }
                        })
                        .catch(error => {
                                this.$toastr.error(error.response.data.message);
                            }
                        )
                        .finally();
                }

            },

        },
        computed: {}
    }
</script>

<style lang="scss">

</style>

