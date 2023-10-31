<template>
    <div>
        <div class="card">
            <div class="card-body">
                <h3 class="card-title">Devices</h3>
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
                    <template #head(center_name)="data">
                        {{(userTypeId !=2)? data.label:''}}
                    </template>
                    <template #cell(center_name)="data">
                        {{(userTypeId !=2)? data.item.center_name:''}}
                    </template>
                    <template class="align-right" #cell(actions)="row">
                        <button v-if="$root.hasAccess('DeviceSetupPage', 'edit')" v-b-tooltip.hover title="Edit"
                                type="button" class="btn btn-primary btn-sm mb-1"
                                @click="sendToPage(row.item)"><i
                                class="fas fa-edit fa-xs"></i>
                        </button>
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
</template>
<script>
    export default {
        name: "DeviceSetupTable",
        props: ['formData'],
        data() {
            return {
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false, sortDirection: 'desc', tdClass: "p-1"},

                    {
                        key: 'device_name',
                        label: 'Device Name',
                        sortable: true,
                        sortDirection: 'desc',
                        tdClass: "p-1"

                    },
                    {
                        key: 'device_type.type_name',
                        label: 'Type',
                        sortable: false,
                        tdClass: "p-1"

                    },
                    {
                        key: 'center_name',
                        label: 'Center Name',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1",

                    },
                    {
                        key: 'booth.booth_name',
                        label: 'Booth',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1",

                    }, {
                        key: 'counter.counter_no',
                        label: 'Counter No.',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1",
                    }, {
                        key: 'lane.lane_no',
                        label: 'Lane No.',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1",

                    },
                    {
                        key: 'active_yn',
                        label: 'Status',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return (value == 'Y') ? 'Active' : 'Inactive';
                        },
                        tdClass: (value, key, item) => {
                            return (value == 'Y') ? ' text-success' : ' text-danger';
                        },
                    },
                    {key: 'actions', label: 'Actions', class: 'text-right', tdClass: "p-1"}
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: process.env.MIX_TABLE_ROW_PER_PAGE,
                sortBy: '',
                sortDesc: true,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
                infoModal: {
                    id: 'info-modal',
                    title: '',
                    item: '',
                },
                counterData: [],
                userTypeId: this.$store.getters.getUser.data.user_type_id,
            }
        },
        computed: {},
        mounted() {

            this.getTableData();
        },
        watch: {
            formData(newData, oldData) {
                if (newData) {
                    this.getTableData();
                }
            }
        },
        methods: {

            onFiltered(filteredItems) {
                // this.totalRows = filteredItems.length
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
                    .get(process.env.MIX_API_URL + '/device-setup', {params: params})
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
            sendToPage(data) {
                this.$emit('sendToPage', data)
            },

        }
    }
</script>
