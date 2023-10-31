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
                                    <b-table ref="table"
                                             class="mt-5 "
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
                                        <template #cell(roles)="data">
                                            <v-select multiple :deselectFromDropdown="true" v-model="data.item.roles"
                                                      @option:deselecting="removeRole(data.item,$event)"
                                                      @option:selected="updateRole(data.item,$event)"
                                                      append-to-body
                                                      :calculate-position="withPopper"
                                                      :options="roleList"></v-select>
                                        </template>
                                        <template #foot()="data">
                                            <span class="mt-5"></span>
                                        </template>
                                    </b-table>
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
    import { createPopper } from '@popperjs/core'
    import moment from "moment";

    export default {
        name: 'UserTypeRoleMappingPage',
        components: {Breadcrumb},
        data() {
            return {
                pageTitle: 'User Type Role Mapping',
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false, tdClass: "p-1 col-md-1"},
                    {
                        key: 'user_type_name',
                        label: 'User Type',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1 col-md-8"
                    },
                    {key: 'roles', label: 'Roles', sortable: false, sortDirection: 'desc', tdClass: "p-1 col-md-3 "},
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: 100,
                sortBy: '',
                sortDesc: true,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
                roles: [],
                roleList: [],
            }
        },
        mounted() {
            this.getTableData();
            this.getRoles();
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
                    .get(process.env.MIX_API_URL + '/user-type-role-mapping', {params: params})
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
            updateRole(data,event) {
                Swal.fire({
                    title: 'Are you sure ?',
                    showCancelButton: true,
                    cancelButtonText: 'Close',
                    cancelButtonColor: '#dd3333',
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#007bff',

                }).then((result)=>{
                    if(result.isConfirmed){
                        const params = {
                            'user_type_id': data.user_type_id,
                            // 'role_id': event.code,
                            'role_id': event[event.length -1].code,
                        };
                        this.axios
                            .post(process.env.MIX_API_URL + '/user-type-role-mapping', params,{ headers: {
                                    'Content-Type': 'multipart/form-data'
                                }})
                            .then(response => {
                                (response.status) ?  this.$toastr.success(response.data.message) : this.$toastr.error(response.data.message);
                                this.getTableData();
                            })
                            .catch(error => {
                                this.$toastr.error(error.response.data.message);
                                this.getTableData();
                            })
                            .finally(() => {
                                this.getTableData();
                            });
                    }else{
                        this.getTableData()
                    }
                });

            },
            getRoles(){
                this.axios.get(process.env.MIX_API_URL + '/common/roles', {})
                    .then(response => {
                        this.roleList = (response.status) ? response.data.data :  [];
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.message);
                    })
                    .finally(() => {
                    });
            },
            removeRole(data,event){
                Swal.fire({
                    title: 'Are you sure ?',
                    showCancelButton: true,
                    cancelButtonText: 'Close',
                    cancelButtonColor: '#dd3333',
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#007bff',

                }).then((result)=>{
                    if(result.isConfirmed){
                        const params = {
                            'user_type_id': data.user_type_id,
                            'role_id': event.code,
                        };
                        this.axios
                            .delete(process.env.MIX_API_URL + '/user-type-role-mapping', {params, headers: {
                                    'Content-Type': 'multipart/form-data'
                                }})
                            .then(response => {
                                (response.status) ?  this.$toastr.success(response.data.message) : this.$toastr.error(response.data.message);
                            })
                            .catch(error => {
                                this.$toastr.error(error.response.data.message);
                                this.getTableData();
                            })
                            .finally(() => {
                                this.getTableData();
                            });
                    }else {
                        this.getTableData();
                    }
                });

            },
            withPopper(dropdownList, component, { width }) {
                dropdownList.style.width = width
                const popper = createPopper(component.$refs.toggle, dropdownList, {
                    placement: 'bottom',
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, -1],
                            },
                        },
                        {
                            name: 'toggleClass',
                            enabled: true,
                            phase: 'write',
                            fn({ state }) {
                                component.$el.classList.toggle(
                                    'drop-up',
                                    state.placement === 'top'
                                )
                            },
                        },
                    ],
                })
                return () => popper.destroy()
            },

        }
    }

</script>
<style>
    .v-select.drop-up.vs--open .vs__dropdown-toggle {
        border-radius: 0 0 4px 4px;
        border-top-color: transparent;
        border-bottom-color: rgba(60, 60, 60, 0.26);
    }

    [data-popper-placement='top'] {
        border-radius: 4px 4px 0 0;
        border-top-style: solid;
        border-bottom-style: none;
        box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.15);
    }

</style>
