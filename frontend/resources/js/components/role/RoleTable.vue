<template>
    <div>
        <div class="card">
            <div class="card-body">
                <h5 class="">Role</h5>
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
                        <b-button @click="roleMenuAssignModel(row.item, row.index, $event.target)"
                                  class="btn btn-info btn-sm mb-1"
                                  size="sm" title="Menu Assign" v-b-tooltip.hover>
                            <i class="fas fa-network-wired fa-xs"></i>
                        </b-button>
                        <button @click="sendToPage(row.item)" class="btn btn-primary btn-sm mb-1" title="Edit"
                                type="button" v-b-tooltip.hover><i
                            class="fas fa-edit   fa-xs"></i>
                        </button>
<!--                        <button v-b-tooltip.hover title="Delete" type="button" class="btn btn-danger btn-sm mb-1 ">-->
<!--                            <i class="fas fa-trash-alt  fa-xs"></i>-->
<!--                        </button>-->
                    </template>
                </b-table>
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
                <b-modal :title="modalTitle" id="assignMenuModel" no-close-on-backdrop>
                    <Loader :loading="isLoading" :class="(isLoading)?'mt-4':''"></Loader>
                    <div v-if="!isLoading">
                        <table style="width: 100%" class="table table-bordered" id="modal-table">
                            <thead>
                            <tr class="bg-dark text-light">
                                <th>Menu Name</th>
                                <th style="width: 20%">Permission</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr :key="index" v-for="(menus, index) in mainMenuList" :class="(menus.menu_type =='PARENT')?'bg-secondary text-light text-center text-uppercase':''">
                                <td v-if="menus.menu_type =='PARENT' && menus.menu_visibility == 'Y'" :colspan="(menus.menu_type =='PARENT')?'2':'1'">{{menus.main_menu_name}} Module</td>
                                <td v-if="menus.menu_type =='CHILD' && menus.menu_visibility == 'Y'">{{menus.menu_name}} <span class="text-info">{{(menus.part_menu_yn == 'Y')?'(side link)':''}}</span> </td>
                                <td class="text-center" v-if="menus.menu_type =='CHILD' && menus.menu_visibility == 'Y'">
                                    <input type="checkbox" :id='`switch`+index' switch="info"
                                           :checked="(menus.permission_wise_yn=='Y')"
                                           @change="permissionUpdate($event,menus,role_id)">
                                    <label :for='`switch`+index' data-on-label="Yes" data-off-label="No" style="margin-bottom: 0"></label>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <template #modal-footer="{ cancel }">
                        <b-button @click="cancel()" size="sm" variant="secondary">
                            Close
                        </b-button>
                    </template>
                </b-modal>
            </div>
        </div>
    </div>
</template>
<script>
    import Loader from "../common/Loader";
    export default {
        name: 'RoleTable',
        props: ['formUpdated'],
        components: {Loader},
        data() {
            return {
                menu_permission_yn: 'N',
                isLoading: false,
                isBusy: true,
                role_id: null,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false},
                    // {key: 'center_id', label: 'ID', sortable: false, sortDirection: 'desc'},
                    {key: 'role_name', label: 'Role Name', sortable: true, sortDirection: 'desc'},
                    {
                        key: 'active_yn',
                        label: 'Status',
                        formatter: (value, key, item) => {
                            return (value == 'Y') ? 'Active' : 'Inactive';
                        },
                        tdClass: (value, key, item) => {
                            return (value == 'Y') ? ' text-success' : ' text-danger';
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
                inspectors: [],
                mainMenuList: null,
                hasCoverageBranch: true
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
            permissionUpdate(event, menus, role_id) {
                // const selectedData = event.target.value;
                const selectedData = (event.target.checked) ? 'Y' : 'N';
                const params = {
                    role_id: role_id,
                    main_menu_id: menus.main_menu_id,
                    menu_id: menus.menu_id,
                    active_yn: selectedData
                };
                var axiosObj = this.axios.post(process.env.MIX_API_URL + '/main-menu/update-permission/', params,{ headers: {
                        'Content-Type': 'multipart/form-data'
                    }})
                axiosObj.then(response => {
                    var data = response.data;
                    if (data.status) {
                        this.$toastr.success(data.message);
                    } else {
                        this.$toastr.error(data.message);
                    }
                    this.get_mainmenu_list(role_id);
                    this.isLoading = false;
                })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                        this.isLoading = true;
                        this.get_mainmenu_list(role_id);
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            },
            get_mainmenu_list(role_id) {
                this.isLoading = true;
                this.axios.get(process.env.MIX_API_URL + '/main-menu/permission/' + role_id, {})
                    .then(
                        response => {
                            this.mainMenuList = (response.data.status) ? response.data.data : [];
                            this.isLoading = false;
                        }
                    )
                    .catch(
                        error => {
                            this.$toastr.error(error.response.data.message);
                            this.isLoading = false;

                        }
                    )
                    .finally(() => {
                        this.isLoading = false;
                    });
            },
            updateMainMenu(event, main_menu_id) {
                console.log(main_menu_id);
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
                    .get(process.env.MIX_API_URL + '/role', {params: params})
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
            roleMenuAssignModel(item, index, button) {
                this.modalTitle = (item) ? 'Menu Assign to ' + item.role_name : '';
                this.modalData = item;
                this.role_id = item.role_id;
                this.coverage = [];
                this.get_mainmenu_list(item.role_id);
                this.$bvModal.show('assignMenuModel')
            }
        }
    }
</script>
<style>
    .icon-size {
        width: 25px;
        height: 20px;
    }
    #modal-table td{
        padding: 1% !important;
    }
</style>
