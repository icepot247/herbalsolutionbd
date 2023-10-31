<template>
    <div>
        <div class="card">
            <div class="card-body">
                <h5 class="">Inventory</h5>
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


                        <button  v-if="$root.hasAccess('InventoryPage', 'edit')&&(userTypeId !=1)"  @click="sendToPage(row.item)" class="btn btn-primary btn-sm m-1 p-1" title="Edit"
                                type="button" v-b-tooltip.hover><i
                            class="fas fa-edit icon-size"></i>
                        </button>

                        <!-- <button v-b-tooltip.hover title="Delete" type="button" class="btn btn-danger btn-sm m-1 p-1">
                            <i class="fas fa-trash-alt icon-size"></i>
                        </button> -->
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
        name: 'InventoryTable',
        props: ['formUpdated'],
        components: {Loader},
        data() {
            return {
                menu_permission_yn:'N',
                isLoading: false,
                isBusy: true,
                role_id:null,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false},
                    // {key: 'center_info.center_name', label: 'Center Name', sortable: false, sortDirection: 'desc'},
                    {key: 'branch_info.branch_name', label: 'Branch Name', sortable: false, sortDirection: 'desc'},
                    {key: 'fc_lot_no', label: 'Lot No', sortable: true, sortDirection: 'desc'},
                    {key: 'fc_serial_start_no', label: 'Start Serial No ', sortable: true, sortDirection: 'desc'},
                    {key: 'fc_serial_end_no', label: 'End Serial No ', sortable: true, sortDirection: 'desc'},
                    {
                        key: 'lot_finish_yn',
                        label: 'Lot Finish',
                        sortable: true,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return (value == 'Y') ? 'Yes' : 'No';
                        },
                        // tdClass: (value, key, item) => {
                        //     return ( value == 'Y') ? ' text-success' : ' text-danger';
                        // },

                    },
                    {key: 'available_pages', label: 'Available Pages', sortable: true, sortDirection: 'desc'},
                    {
                        key: 'active_yn',
                        label: 'Status',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return (value == 'Y') ? 'Active' : 'Inactive';
                        },
                        tdClass: (value, key, item) => {
                            return ( value == 'Y') ? ' text-success' : ' text-danger';
                        },
                    },
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
                mainMenuList:null,
                hasCoverageBranch:true,
                userTypeId: this.$store.getters.getUser.data.user_type_id,
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
            permissionUpdate(event, menus, role_id){

                const selectedData = event.target.value;
                const params = {
                    role_id: role_id,
                    main_menu_id: menus.main_menu_id,
                    menu_id: menus.menu_id,
                    active_yn: selectedData
                };

                var axiosObj =  this.axios.post(process.env.MIX_API_URL + '/main-menu/update-permission/', params,{ headers: {
                        'Content-Type': 'multipart/form-data'
                    }})
                axiosObj.then(response => {
                    var data = response.data;
                    if (data.status) {
                        this.$toastr.success(data.message);
                        this.isLoading = false;

                    } else {
                        this.$toastr.error(data.message);
                        this.isLoading = false;
                    }
                })
                .catch(error => {
                    this.$toastr.error(error.response.data.message);
                    this.isLoading = false;
                })
                .finally(() => {
                    this.isLoading = false;
                });
            },
            get_mainmenu_list(role_id){
                this.axios.get(process.env.MIX_API_URL + '/main-menu/permission/'+role_id, {})
                .then(
                    response => {
                        var res = response.data;

                        if(res.status)
                        {
                            this.mainMenuList = res.data;
                        }
                    }
                )
                .catch(
                    error => {
                        this.$toastr.error(error.response.data.message);
                    }
                )
                .finally(()=>{});
            },
            updateMainMenu(event, main_menu_id) {

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
                    .get(process.env.MIX_API_URL + '/inventory', {params: params})
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

            }

        }
    }
</script>
<style>
    .icon-size {
        width: 25px;
        height: 20px;
    }
</style>
