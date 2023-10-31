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
                                        <b-col lg="2" md="4" class="my-2 col-4 float-start">
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
                                        <b-col lg="2" md="4" class="my-2 col-4 float-end">
                                            <b-form-group
                                                class="mb-0"
                                            >
                                                <b-input-group size="sm" class=" float-end">
                                                    <b-form-select
                                                        v-model="filter"
                                                        :options="filterOptions"
                                                        size="sm"
                                                    ></b-form-select>
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
                                        <template #cell(view)="row" class="align-right">
                                            <b-button @click="showModal(row)"
                                                      class="btn-success"
                                                      size="sm" title="View" v-b-tooltip.hover>
                                                <i class="fa fa-eye"></i>
                                            </b-button>
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
                                    <b-modal  :title="modalTitle" id="response" size="lg" no-close-on-backdrop>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <p class="h6">URL</p>
                                            </div>
                                            <div class="col-md-12">
                                                <input v-bind:value="modalData.uri" class="form-control" type="text" readonly>
                                            </div>
                                            <div class="col-md-4">
                                                <p class="h6 m-2">Method</p>
                                            </div>
                                            <div class="col-md-4">
                                                <p class="h6 m-2">Created At</p>
                                            </div>
                                            <div class="col-md-4">
                                                <p class="h6 m-2">Client IP</p>
                                            </div>
                                            <div class="col-md-4">
                                                <input v-bind:value="modalData.request_method" class="form-control" type="text" readonly>
                                            </div>
                                            <div class="col-md-4">
                                                <input v-bind:value="modalData.created_at" class="form-control" type="text" readonly>
                                            </div>
                                            <div class="col-md-4">
                                                <input v-bind:value="modalData.client_ip" class="form-control" type="text" readonly>
                                            </div>
                                            <div class="col-md-12">
                                                <p class="h6 m-2">Request Header</p>
                                            </div>
                                            <div class="col-md-12">
                                                <textarea class="form-control" cols="15" rows="15">{{ modalData.request_header }}</textarea>
                                            </div>
                                            <div class="col-md-12">
                                                <p class="h6 m-2">Request Body</p>
                                            </div>
                                            <div class="col-md-12">
                                                <textarea class="form-control" cols="20" rows="10">{{ modalData.request_body }}</textarea>
                                            </div>
                                            <div class="col-md-12">
                                                <p class="h6 m-2">Response Data</p>
                                            </div>
                                            <div class="col-md-12">
                                                <textarea class="form-control" cols="30" rows="25">{{ modalData.response_data }}</textarea>
                                            </div>
                                        </div>

                                        <template #modal-footer="{ cancel }">
                                            <b-button @click="cancel()" size="sm" variant="danger">
                                                Close
                                            </b-button>
                                        </template>
                                    </b-modal>
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
        name: 'ApiAccessLogPage',
        components: {Breadcrumb},
        data() {
            return {
                pageTitle: 'API Access Log',
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                filterOptions: [{value: '', text: 'SELECT ACCESS TYPE'},{value: 'APP', text: 'APP ACCESS'},{value: 'WEB', text: 'WEB ACCESS'}],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false},
                    {key: 'access_from', label: 'Client', sortable: true, tdClass: "p-1"},
                    {key: 'uri', label: 'URL', sortable: false, sortDirection: 'desc', tdClass: "p-1"},
                    {key: 'request_method', label: 'Request Method', tdClass: "p-1"},
                    {key: 'api_type', label: 'Access Type', tdClass: "p-1", sortable: false},
                    {key: 'created_at', label: 'Created At',  sortable: true, sortDirection: 'desc', tdClass: "p-1"},
                    {key: 'view', label: 'View', tdClass: "p-1 text-center"},
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: process.env.MIX_TABLE_ROW_PER_PAGE,
                sortBy: '',
                sortDesc: true,
                sortDirection: 'asc',
                filter: '',
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
                    .get(process.env.MIX_API_URL + '/api-access-log', {params: params})
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
            showModal(item) {
                this.modalData = [];
                this.modalTitle = 'API Log';
                this.modalData.uri = item.item.uri;
                this.modalData.request_method = item.item.request_method;
                this.modalData.client_ip = item.item.client_ip;
                this.modalData.created_at = item.item.created_at;

                this.modalData.request_header = JSON.stringify(JSON.parse(item.item.request_header),undefined,2) ;
                this.modalData.request_body = JSON.stringify(JSON.parse(item.item.request_body),undefined,2)  ;
                this.modalData.response_data = JSON.stringify(JSON.parse(item.item.response_data),undefined,2);
                console.log("API access log",item.item)
                // this.modalData.request_header = JSON.parse(item.item.request_header);
                // this.modalData.request_body = JSON.stringify(JSON.parse(item.item.request_body),undefined,2)  ;
                // this.modalData.response_data = JSON.stringify(JSON.parse(item.item.response_data),undefined,2);
                this.$bvModal.show('response')
            },
            formatDate(date){
                return moment(date).format('DD-MMM-YYYY');
            }

        }
    }

</script>
