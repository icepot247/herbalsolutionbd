<template>
    <div>
        <div class="card">
            <div class="card-body">
                <h5 class="">Users</h5>
                <b-row>
                    <b-col lg="1" md="2" class="my-2 col-4">
                        <b-form-group
                                class="mb-0"
                        >
                            <b-form-select
                                    id="per-page-select"
                                    v-model="perPage"
                                    :options="pageOptions"
                                    @change="handlePageSizeChange"
                                    size="sm"
                                    class="col-md-12"
                            ></b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col lg="4" md="4" class="my-2 col-4">
                        <b-form-group
                                class="mb-0"
                        >
                            <b-form-select
                                    id="per-page-select"
                                    v-model="userType"
                                    @change="handleUserTypeChange"
                                    size="sm"
                                    class="col-md-6"
                            >

                                <option :value="null">All</option>
                                <option v-for="(val,key) in userTypeList" :key="key" :value="val.value"
                                        :disabled="val.disabled">
                                    {{ val.text }}
                                </option>
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col lg="4" md="3" class="my-2 col-4"></b-col>
                    <b-col lg="3" md="3" class="my-2 col-4">
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
                    <template class="align-right" #cell(actions)="row">
                        <b-button cl
                                  v-if="$root.hasAccess('MenuPermissionModal', 'add') || $root.hasAccess('MenuPermissionModal', 'edit')"
                                  v-b-tooltip.hover title="Assign Menu Permission" size="sm"
                                  @click="info(row.item, row.index, $event.target)"
                                  class="btn btn-secondary btn-sm mb-1">
                            <i class="fas fa-network-wired fa-xs"></i>
                        </b-button>
                        <!-- <b-button v-b-tooltip.hover title="Coverage" size="sm" class="m-1 p-1" @click="row.toggleDetails">
                            <i class="fas fa-network-wired icon-size"></i>
                        </b-button> -->
                        <button v-if="$root.hasAccess('UserPage', 'edit')" v-b-tooltip.hover title="Edit" type="button"
                                class="btn btn-primary btn-sm mb-1"
                                @click="sendToPage(row.item)"><i
                                class="fas fa-edit  fa-xs"></i>
                        </button>
                        <!-- <button v-b-tooltip.hover title="Delete" type="button" class="btn btn-danger btn-sm m-1 p-1">
                            <i class="fas fa-trash-alt icon-size"></i>
                        </button> -->
                    </template>
                    <template #row-details="row">
                        <b-card>
                            <ul>
                                <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                            </ul>
                        </b-card>
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
                <b-modal :id="infoModal.id" size="lg" :title="infoModal.title" ok-only @hide="resetInfoModal">
                    <Loader :loading="isLoading" :class="(isLoading)?'mt-5 p-5' : ''"></Loader>
                    <p v-if="!isLoading" class="p-1 alert alert-warning">* Yellow marked menus are already in assigned
                        role.</p>
                    <table v-if="!isLoading" style="width: 100%" class="table table-bordered" id="modal-table">
                        <thead>
                        <tr class="bg-dark text-light">
                            <!--                            <th rowspan="2" style="vertical-align: middle">Main Menu Name</th>-->
                            <th rowspan="2" style="vertical-align: middle">Sub Menu Name</th>
                            <th colspan="3" class="text-center">Permission</th>
                        </tr>
                        <tr class="bg-dark text-light">
                            <th>Insert</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>

                        <tr :key="index" v-for="(menus, index) in mainMenuList"
                            :class="(menus.menu_type =='PARENT')?'bg-secondary text-light text-center text-uppercase':''"
                            :style="{backgroundColor:(menus.role_id != null)?'cornsilk':''}">
                            <td v-if="menus.menu_type =='PARENT' && menus.main_menu_visibility == 'Y'"
                                :colspan="(menus.menu_type =='PARENT')?'4':'1'">{{menus.main_menu_name}} Module
                            </td>
                            <td v-if="menus.menu_type =='CHILD' && menus.menu_visibility == 'Y' && menus.main_menu_visibility == 'Y'">
                                {{menus.menu_name}} <span class="text-info">{{(menus.part_menu_yn == 'Y')?'(side link)':''}}</span>
                            </td>
                            <td v-if="menus.menu_type =='CHILD' && menus.menu_visibility == 'Y' && menus.main_menu_visibility == 'Y'">
                                <input type="checkbox" :id='`switch_insert_`+index' switch="info"
                                       :checked="(menus.user_menu_insert_status=='Y' ||  (menus.user_menu_insert_status == null && menus.role_id != null))?true:false"
                                       @change="save_permission($event, 1, infoModal.user_id, menus.menu_id, menus.main_menu_id, $event)">
                                <label :for='`switch_insert_`+index' data-on-label="Yes" data-off-label="No"
                                       style="margin-bottom: 0"></label>
                            </td>
                            <td v-if="menus.menu_type =='CHILD' && menus.menu_visibility == 'Y' && menus.main_menu_visibility == 'Y'">
                                <input type="checkbox" :id='`switch_update_`+index' switch="info"
                                       :checked="(menus.user_menu_edit_status=='Y'  ||  (menus.user_menu_insert_status == null && menus.role_id != null))?true:false"
                                       @change="save_permission($event, 2, infoModal.user_id, menus.menu_id, menus.main_menu_id, $event)">
                                <label :for='`switch_update_`+index' data-on-label="Yes" data-off-label="No"
                                       style="margin-bottom: 0"></label>
                            </td>
                            <td v-if="menus.menu_type =='CHILD' && menus.menu_visibility == 'Y' && menus.main_menu_visibility == 'Y'">
                                <input type="checkbox" :id='`switch_delele_`+index' switch="info"
                                       :checked="(menus.user_menu_delete_status=='Y'  ||  (menus.user_menu_insert_status == null && menus.role_id != null))?true:false"
                                       @change="save_permission($event, 3, infoModal.user_id, menus.menu_id, menus.main_menu_id, $event)">
                                <label :for='`switch_delele_`+index' data-on-label="Yes" data-off-label="No"
                                       style="margin-bottom: 0"></label>
                            </td>
                        </tr>
                        </tbody>
                    </table>
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
        name: 'UserTable',
        props: ['formUpdated'],
        components: {Loader},
        data() {
            return {
                user_type_id: null,
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false},
                    {
                        key: 'center_user.center_info.center_name',
                        label: 'Center Name',
                        sortable: true,
                        sortDirection: 'desc'
                    },
                    {key: 'name', label: 'Name', sortable: true, sortDirection: 'desc'},
                    {key: 'login_id', label: 'Login ID', sortable: false, sortDirection: 'desc'},
                    // {key: 'center', label:'Center Name',  sortable: false,sortDirection: 'desc'},
                    // {
                    //     key: 'user_type_name',
                    //     label: 'User Type Name',
                    //     sortable: false,
                    //     sortDirection: 'desc',
                    // },
                    {key: 'brta_employee_id', label: 'Employee ID', sortable: false, sortDirection: 'desc'},
                    {key: 'mobile_no', label: 'Mobile No', sortable: false, sortDirection: 'desc'},
                    {key: 'user_type.user_type_name', label: 'User Type', sortable: false, sortDirection: 'desc'},
                    // {  key: 'division.division_name',
                    //     label: 'Division',
                    //     sortable: false,
                    //     sortDirection: 'desc',
                    // },
                    // {
                    //     key: 'district.district_name',
                    //     label: 'District',
                    //     sortable: false,
                    //     sortDirection: 'desc',
                    // },
                    // {
                    //     key: 'thana.thana_name',
                    //     label: 'Thana',
                    //     sortable: false,
                    //     sortDirection: 'desc',
                    // },
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
                infoModal: {
                    id: 'info-modal',
                    title: 'Assign Menu Permission',
                    content: '',
                    user_id: null
                },
                mainMenuList: null,
                can_insert_yn: false,
                can_update_yn: false,
                can_delete_yn: false,
                menu_permission_id: null,
                permission_yn: 'N',
                new_user_id: null,
                isLoading: false,
                userType: null,
                userTypeList: []
            }
        },
        watch: {
            formUpdated(newData, oldData) {
                if (newData) {
                    this.getTableData();
                }
            }
        },
        computed: {},
        mounted() {
            this.getTableData();
            this.getUserTypeList();
        },
        methods: {
            info(item, index, button) {
                this.infoModal.title = `User Assign Menu Permissions of ` + item.name
                this.infoModal.content = JSON.stringify(item, null, 2)
                this.infoModal.user_id = item.user_id;
                this.new_user_id = item.user_id;
                this.mainMenuList = [];
                this.get_mainmenu_list(this.new_user_id);
                this.$root.$emit('bv::show::modal', this.infoModal.id, button)
            },
            save_permission(event, permission_id, user_id, menu_id, main_menu_id) {
                const selectedData = (event.target.checked) ? 'Y' : 'N';
                const params = {
                    permission_id: permission_id,
                    user_id: user_id,
                    menu_id: menu_id,
                    main_menu_id: main_menu_id,
                    permission_yn: selectedData
                };
                // const headers = { 'Content-Type': 'multipart/form-data' };
                if (this.menu_permission_id) {
                    var axiosObj = this.axios.put(process.env.MIX_API_URL + '/main-menu/create-permission/' + this.menu_permission_id, params, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                } else {
                    var axiosObj = this.axios.post(process.env.MIX_API_URL + '/main-menu/create-permission', params, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                }
                axiosObj.then(response => {
                    var data = response.data;
                    if (data.status) {
                        this.$toastr.success(data.message);
                        this.resetForm()
                    } else {
                        this.$toastr.error(data.message);
                    }
                })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },
            getCenterWiseLane() {
                this.isLoading = true;
                this.axios.get(process.env.MIX_API_URL + '/', {})
            },
            get_mainmenu_list(new_user_id) {
                this.isLoading = true;
                this.axios.get(process.env.MIX_API_URL + '/users/get-user-menu-permission/' + new_user_id, {})
                    .then(
                        response => {
                            this.mainMenuList = (response.data.status) ? response.data.data.data : [];
                            this.isLoading = false;
                        }
                    )
                    .catch(
                        error => {
                            this.isLoading = false;
                        }
                    )
                    .finally(() => {
                        this.isLoading = false;
                    });
            },
            resetInfoModal() {
                this.infoModal.title = ''
                this.infoModal.content = ''
            },
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
                    'search': this.filter,
                    'user_type': (this.userType) ? this.userType : null,
                };
                this.axios
                    .get(process.env.MIX_API_URL + '/users/get-all-user', {
                        params: params, headers: {
                            'Content-Type': 'multipart/form-data'
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
            resetForm() {
                // this.v$.$reset() // reset the dirty state of validation
                this.permission_id = null;
                this.menu_permission_id = null;
                this.permission_yn = 'N';
            },
            handleUserTypeChange(value) {
                this.userType = value;
                this.currentPage = 1;
                this.getTableData();
            },
            getUserTypeList() {
                this.axios.get(process.env.MIX_API_URL + '/users/get-utype-by-id/' + this.$store.getters.getUser.data.user_type_id, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(response => {
                        const res = response.data;

                        if (res.status) {
                            this.userTypeList = res.data;
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
<style>
    .icon-size {
        width: 25px;
        height: 20px;
    }

    #modal-table td {
        padding: 1% !important;
    }
</style>
