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
                                    <b-row>
                                        <b-col lg="3" md="4" class="my-2 col-4">
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
    </div>
</template>
<script>
    import DefaultLayout from "../layouts/DefaultLayout";
    import Breadcrumb from "../components/common/Breadcrumb";
    import moment from "moment";

    export default {
        name: 'ActivityLogPage',
        components: {Breadcrumb},
        data() {
            return {
                pageTitle: 'Activity Log',
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false},
                    {
                        key: 'status_code',
                        label: 'Status',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return (value == 1)? 'Success' : 'Error';
                        },
                        tdClass: (value, key, item) => {
                            return (value == 1)? 'text-success align-middle' : 'text-danger align-middle';

                        }
                    },

                    {key: 'status_message', label: 'Status Message', tdClass: "p-1 align-middle"},
                    {key: 'procedure_name', label: 'Action [Path]', tdClass: "p-1 align-middle"},
                    {
                        key: 'user',
                        label: 'User Name',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return value.name;
                        }
                    },
                    {
                        key: 'center',
                        label: 'Center Name',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return (value)? value.center_name : '';
                        }
                    },
                    {
                        key: 'log_date',
                        label: 'Log Date',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return value;
                            // return this.formatDate(value);
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
                laneTypeOption: [],
                modalTitle : null,
                modalData : [],
            }
        },
        mounted() {
            this.getTableData();
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        methods: {
            onFiltered(filteredItems) {
                if (this.prevFilter != this.filter) {
                    this.currentPage = 1
                    this.getTableData()
                    this.prevFilter = this.filter
                }
            },
            onSorted(sortItem) {
                this.currentPage = 1
                this.getTableData()
            },
            async getTableData() {
                this.isBusy = true;
                const params = {
                    'per_page': this.perPage,
                    'page': this.currentPage,
                    'sort_by': this.sortBy,
                    'sort_type': (this.sortDesc) ? 'desc' : 'asc',
                    'search': this.filter
                };
                this.axios
                    .get(process.env.MIX_API_URL + '/activity-log', {params: params})
                    .then(response => {
                        var res = response.data;
                        if (res.status) {
                            this.items = res.data.data;
                            this.currentPage = res.data.current_page;
                            this.totalRows = res.data.total;
                            this.perPage = res.data.per_page;
                        }
                        this.isBusy = false;
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                        this.isBusy = false;
                    })
                    .finally(() => {
                        this.isBusy = false;

                    });
            },
            handlePageChange(pageNo) {
                this.currentPage = pageNo
                this.getTableData();
            },
            handlePageSizeChange(value) {
                this.perPage = value;
                this.currentPage = 1;
                this.getTableData();
            },
            formatDate(date){
                return moment(date).format('DD-MMM-YYYY');
            }

        }
    }

</script>
