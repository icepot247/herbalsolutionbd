<template>
    <div>
        <div class="card">
            <div class="card-body">
                <h5 class="">Role</h5>
                <!--        Filter        -->
                <b-row>
                    <b-col class="my-2 col-4 p-1" lg="3" md="4">
                        <b-form-group
                            class="mb-0"
                        >
                            <b-form-select
                                :options="pageOptions"
                                @change="handlePageSizeChange"
                                class="col-md-4"
                                id="per-page-select"
                                size="sm"
                                v-model="perPage"
                            ></b-form-select>
                        </b-form-group>
                    </b-col>

                    <b-col class="my-2 col-4" lg="6" md="4"></b-col>
                    <b-col class="my-2 col-4 p-1" lg="3" md="4">
                        <b-form-group
                            class="mb-0"
                        >
                            <b-input-group size="sm">
                                <b-form-input
                                    id="filter-input"
                                    placeholder="Type to Search"
                                    type="search"
                                    v-model="filter"
                                ></b-form-input>
                            </b-input-group>
                        </b-form-group>
                    </b-col>
                </b-row>

                <!-- Main table element -->
                <b-table :busy="isBusy"
                         :fields="fields"
                         :filter="filter"
                         :filter-included-fields="filterOn"
                         :items="items"
                         :sort-by.sync="sortBy"
                         :sort-desc.sync="sortDesc"
                         :sort-direction="sortDirection"
                         @filtered="onFiltered"
                         @sort-changed="onSorted"
                         class="mt-2"
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

                    <template #cell(actions)="row" class="align-right">
                        <!-- <button @click="sendToPage(row.item)" class="btn btn-primary btn-sm m-1 p-1" title="Edit"
                                type="button" v-b-tooltip.hover><i
                            class="fas fa-edit icon-size"></i>
                        </button> -->

                        <button v-b-tooltip.hover title="Delete" type="button" class="btn btn-danger btn-sm m-1 p-1">
                            <i class="fas fa-trash-alt icon-size"></i>
                        </button>
                    </template>

                </b-table>
                <!--    Pagination            -->
                <b-row>
                    <b-col class="mt-2" md="12" sm="12">
                        <b-pagination
                            :per-page="perPage"
                            :total-rows="totalRows"
                            @change="handlePageChange"
                            align="center"
                            class="my-0"
                            v-model="currentPage"
                        ></b-pagination>
                    </b-col>
                </b-row>



           

            </div>
            <!-- end card body -->
        </div>

    </div>
</template>

<script>

    import Loader from "../common/Loader";

    export default {
        name: 'RoleWiseMenuTable',
        props: ['formUpdated'],
        components: {Loader},
        data() {
            return {
                isLoading: false,
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'menu.manu_name', label: 'Menu Name', sortable: false},
                    {key: 'main_menu.main_menu_name', label: 'Main Menu Name', sortable: false},
                    // {key: 'center_id', label: 'ID', sortable: false, sortDirection: 'desc'},
                    {key: 'role_name.role_name', label: 'Role Name', sortable: true, sortDirection: 'desc'},
                    {key: 'role_name.active_yn', label: 'Status', sortable: true, sortDirection: 'desc'},
                    {key: 'actions', label: 'Actions', class: 'text-right'}
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: process.env.MIX_TABLE_ROW_PER_PAGE,
                sortBy: '',
                sortDesc: true,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
                inspectorModal: {
                    id: 'inspector-modal',
                    title: '',
                    content: ''
                },
                modalTitle: '',
                modalData: {},
                modalFor: '',
                coverage: [],
                coverageList: [],
                inspectorList: [],
                inspectors:[],
                hasCoverageBranch:true
            }
        },
        computed: {},
        mounted() {
           this.getTableData();
        },
        watch: {
            formUpdated(newData, oldData) {
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
            getTableData() {
                this.isBusy = true;
                const params = {
                    'per_page': this.perPage,
                    'page': this.currentPage,
                    'sort_by': this.sortBy,
                    'sort_type': (this.sortDesc) ? 'desc' : 'asc',
                    'search': this.filter
                };
                this.axios
                    .get(process.env.MIX_API_URL + '/role-wise-menu', {params: params})
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
<style>
    .icon-size {
        width: 25px;
        height: 20px;
    }
</style>
