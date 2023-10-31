<template>
    <div>
        <div class="main-content">

            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb :title="title"/>
                    <div class="row">
                        <div>
                            <div class="card">
                                <div class="card-body">
                                    <h3 class="card-title">General Settings</h3>
                                    <b-table ref="table"
                                             class="mt-2"
                                             :items="itemsGeneral"
                                             :fields="fieldsGeneral"
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
                                        <template #cell(index)="data">
                                            {{(currentPage-1)*perPage+data.index+1}}
                                        </template>
                                        <template class="align-right" #cell(active_yn)="row">
                                            <!--                                            <input type="checkbox" :id='"switch_required_"+row.index' switch="info"-->
                                            <!--                                                   :checked="(row.item.active_yn=='Y')?true:false"-->
                                            <!--                                                   @change="changeStatus(($event.target.checked)?'Y':'N',row)">-->
                                            <!--                                            <label style="width: 70px" class="mb-0 align-middle active-switch-width"-->
                                            <!--                                                   :for='"switch_required_"+row.index' data-on-label="Active"-->
                                            <!--                                                   data-off-label="Inactive"></label>-->
                                            <b-form-select @change="changeStatus($event,row)" class="form-select col-md-6"
                                                           v-model="row.item.active_yn" :options="statusOptions" name="status"></b-form-select>
                                        </template>
                                    </b-table>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div>
                            <div class="card">
                                <div class="card-body">
                                    <h3 class="card-title">Schedule Task Settings</h3>
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
                                             :busy="isLoading"
                                    >
                                        <template #cell(index)="data">
                                            {{(currentPage-1)*perPage+data.index+1}}
                                        </template>
                                        <template class="align-right" #cell(actions)="row">
                                            <b-button
                                                    @click="showEditModal(row.item)"
                                                    class="m-1 btn-primary p-1"
                                                    variant="primary"
                                                    size="sm" title="Edit Task Setup" v-b-tooltip.hover>
                                                <i class="far fa-edit icon-size"></i>
                                            </b-button>
                                        </template>
                                    </b-table>
                                    <b-modal id="taskEditModal" no-close-on-backdrop size="lg" ok-only
                                             @hide="resetInfoModal">
                                        <div class="col-md-12 ">
                                            <div class="row">
                                                <div class="col-md-3 card-title">Task Code</div>
                                                <div class="col-md-1 d-none d-sm-block">:</div>
                                                <div class="col-md-8 card-text">
                                                    {{ taskData.task_code }}
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-3 card-title">Task Description</div>
                                                <div class="col-md-1 d-none d-sm-block">:</div>
                                                <div class="col-md-8 card-text">
                                                    {{ taskData.task_description }}
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-3 card-title">Task Interval (Second)</div>
                                                <div class="col-md-1 d-none d-sm-block">:</div>
                                                <div class="col-md-3 card-text">
                                                    <input v-model="taskData.task_interval"
                                                           @keypress="isNumber($event)"
                                                           :class="[(v$.taskData.task_interval.$error)?'is-invalid':'']"
                                                           type="number"
                                                           class="form-control">
                                                    <ul v-if="v$.taskData.task_interval.$error"
                                                        class="parsley-errors-list filled">
                                                        <li v-for="(value , key) in v$.taskData.task_interval.$errors"
                                                            :key="key"
                                                            class="parsley-required">{{value.$message}}
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div class="col-md-3 card-text p-2">
                                                    <span v-if="(Math.floor(((taskData.task_interval/60)/60))>=1)">
                                                        {{Math.floor(((taskData.task_interval/60)/60))}} Hours
                                                        {{ ( Math.floor((taskData.task_interval/60))-(Math.floor(((taskData.task_interval/60)/60)) *60))>=1 ?
                                                        ( Math.floor((taskData.task_interval/60))-(Math.floor(((taskData.task_interval/60)/60)) *60))+' min' :''}}
                                                    </span>
                                                    <span v-else-if="(( Math.floor((taskData.task_interval/60))-(Math.floor(((taskData.task_interval/60)/60)) *60))>60)">
                                                        {{(( Math.floor((taskData.task_interval/60))-(Math.floor(((taskData.task_interval/60)/60)) *60)) / 60)+' min'}}
                                                    </span>
                                                    <span v-else-if="(( Math.floor((taskData.task_interval/60))-(Math.floor(((taskData.task_interval/60)/60)) *60))<=60
                                                    && ( Math.floor((taskData.task_interval/60))-(Math.floor(((taskData.task_interval/60)/60)) *60))>=1)">
                                                        {{(( Math.floor((taskData.task_interval/60))-(Math.floor(((taskData.task_interval/60)/60)) *60)))+' min'}}
                                                    </span>
                                                    <span v-else>{{taskData.task_interval+' sec'}}</span>
                                                </div>

                                            </div>
                                            <div v-if="taskData.last_execute_time !=null" class="row">
                                                <div class="col-md-3 card-title">Last Execute Time</div>
                                                <div class="col-md-1 d-none d-sm-block">:</div>
                                                <div class="col-md-8 card-text">
                                                    {{ taskData.last_execute_time }}
                                                </div>
                                            </div>
                                            <div  v-if="taskData.last_change_date !=null" class="row">
                                                <div class="col-md-3 card-title">Last Change Date</div>
                                                <div class="col-md-1 d-none d-sm-block">:</div>
                                                <div class="col-md-8 card-text">
                                                    {{ taskData.last_change_date }}
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-3 card-title">Status</div>
                                                <div class="col-md-1 d-none d-sm-block">:</div>
                                                <div class="col-md-4 card-text">
                                                    <b-form-select class="form-select"
                                                                   :class="[(v$.taskData.active_yn.$error)?'parsley-error':'']"
                                                                   v-model="taskData.active_yn" :options="statusList"
                                                                   name="status"></b-form-select>
                                                    <ul v-if="v$.taskData.active_yn.$error"
                                                        class="parsley-errors-list filled">
                                                        <li v-for="(value , key) in v$.taskData.active_yn.$errors"
                                                            :key="key"
                                                            class="parsley-required">{{value.$message}}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div v-if="taskData.consider_no_of_days_data !=null" class="row mt-2">
                                                <div class="col-md-3 card-title">Consider </div>
                                                <div class="col-md-1 d-none d-sm-block">:</div>
                                                <div class="col-md-4 card-text">
                                                    <input v-model="taskData.consider_no_of_days_data"
                                                           @keypress="isNumber($event)"
                                                           :class="[(v$.taskData.consider_no_of_days_data.$error)?'is-invalid':'']"
                                                           type="number"
                                                           class="form-control">
                                                    <ul v-if="v$.taskData.consider_no_of_days_data.$error"
                                                        class="parsley-errors-list filled">
                                                        <li v-for="(value , key) in v$.taskData.consider_no_of_days_data.$errors"
                                                            :key="key"
                                                            class="parsley-required">{{value.$message}}
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div class="col-md-3 card-text p-2"> Days Older Data</div>
                                            </div>
                                        </div>

                                        <template #modal-footer="{ ok,cancel }">
                                            <b-button v-if="!isTaskSubmit" size="sm" variant="primary"
                                                      @click="submitForm()">
                                                Update
                                            </b-button>
                                            <button v-if="isTaskSubmit" class="btn btn-outline-primary " type="button">
                                                <div class="spinner-border"
                                                     style="height: 1rem !important; width: 1rem !important;">
                                                    <span class="visually-hidden">Processing...</span>
                                                </div>
                                            </button>
                                            <b-button size="sm" variant="danger" @click="cancel()">
                                                Cancel
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
    import useVuelidate from "@vuelidate/core";
    import {required, requiredIf, minValue} from "@vuelidate/validators";
    import Breadcrumb from "../components/common/Breadcrumb";
    import DefaultLayout from "../layouts/DefaultLayout";

    export default {
        name: "ScheduleTaskSetup",
        components: {Breadcrumb},
        data() {
            return {
                toggle: false,
                isLoading: false,
                isBusy: false,
                regNumber: null,
                from_date: '',
                end_date: '',
                status: null,
                btnName: 'Search',
                sendToTable: null,
                title: 'General & Schedule Settings',
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false, tdClass: "p-1",},
                    {
                        key: 'task_description',
                        label: 'Description',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1",
                        thClass: ''

                    },
                    {
                        key: 'task_interval',
                        label: 'Interval',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1 ",
                        thClass: '',
                        formatter: (value, key, item) => {
                            let hour = Math.floor((Math.floor(value/60)/60));
                            let min = Math.floor(((value/60)-(hour*60)));
                            if(min >60){
                                min =   Math.floor((min/60));
                            }
                            if(hour>=1){
                                return hour+' hours '+((min>0)? min+' min':'');
                            }
                            else if(min>=1){
                                return  min+' min';
                            }else {
                                return  value+' sec';
                            }

                        },

                    },
                    {
                        key: 'last_execute_time',
                        label: 'Last Execute Time',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1 ",
                        thClass: '',


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
                            return (value == 'Y') ? ' text-success p-1' : ' text-danger p-1';
                        },
                    },
                    {
                        key: 'actions',
                        label: 'Actions',
                        class: 'text-right',
                        tdClass: "p-1",
                        thClass: ''
                    }
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: process.env.MIX_TABLE_ROW_PER_PAGE,
                sortBy: '',
                sortDesc: true,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
                isPdfLoading: false,
                averageRating: null,
                highestRating: null,
                lowestRating: null,
                totalRating: null,
                centerList: [],
                center_id: (this.$store.getters.getUser.data.center_id !== null) ? this.$store.getters.getUser.data.center_id : null,
                userType: this.$store.getters.getUser.data.user_type_id,
                taskData: {
                    schedule_task_id: null,
                    task_code: null,
                    task_description: null,
                    task_interval: null,
                    last_execute_time: null,
                    last_change_date: null,
                    active_yn: 'N',
                    consider_no_of_days_data: null
                },
                task_interval_day: [],
                task_interval_minute: [],
                task_interval_hour: [],
                statusList: [
                    {value: 'Y', text: 'Active'},
                    {value: 'N', text: 'Inactive'},
                ],
                itemsGeneral: [],
                fieldsGeneral: [
                    {key: 'index', label: 'SL', sortable: false, tdClass: "p-1 col-md-1",},
                    {
                        key: 'setting_description',
                        label: 'Description',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1 col-md-4",
                        thClass: ''

                    },

                    {
                        key: 'last_change_date',
                        label: 'Last Changed',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1 col-md-2",
                        thClass: '',


                    },
                    {
                        key: 'active_yn',
                        label: 'Status',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return value;
                        },
                        tdClass: "p-1",
                    },
                ],
                isTaskSubmit: false,
                statusOptions: [
                    {value: 'Y', text: 'Active',},
                    {value: 'N', text: 'Inactive'},
                ],

            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        validations() {
            return {
                taskData: {
                    active_yn: {
                        required
                    },
                    task_interval: {
                        minValue: minValue(30)
                    },
                    consider_no_of_days_data: {
                        minValue: minValue(1)
                    }
                }
            }
        },
        mounted() {
            this.getTableData();
            this.getGeneralTableData();
        },
        methods: {
            onFiltered(filteredItems) {
                // this.totalRows = filteredItems.length
                // if (this.prevFilter != this.filter) {
                //     this.currentPage = 1
                //     this.getTableData()
                //     this.prevFilter = this.filter
                // }
            },
            onSorted(sortItem) {
                // this.currentPage = 1
                // this.getTableData()
            },
            handlePageChange(pageNo) {
                // this.currentPage = pageNo
                // this.getTableData();
            },
            async getTableData() {
                this.isLoading = true;
                const params = {
                    // 'center_id': this.center_id,
                    'per_page': this.perPage,
                    'page': this.currentPage,
                };
                this.axios
                    .get(process.env.MIX_API_URL + '/schedule-task-setup', {
                        params, headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        var res = response.data;
                        if (res.status) {
                            this.items = res.data;
                            // this.currentPage = res.data.current_page;
                            // this.totalRows = res.data.total;
                            // this.perPage = res.data.per_page;
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
            },
            resetForm() {
                this.getTableData();
            },
            handlePageSizeChange(value) {
                // this.perPage = value;
                // this.currentPage = 1;
                // this.getTableData();
            },
            resetInfoModal() {
                 this.getTableData();
                this.taskData = {
                    schedule_task_id: null,
                    task_code: null,
                    task_description: null,
                    task_interval: null,
                    last_execute_time: null,
                    last_change_date: null,
                    active_yn: 'N',
                    consider_no_of_days_data: null
                }

            },
            showEditModal(data) {
                this.taskData = data;
                this.$bvModal.show('taskEditModal')
            },
            async submitForm() {
                if (await this.v$.$validate()) {
                    this.isTaskSubmit = true;
                    const params = {
                        task_interval: this.taskData.task_interval,
                        consider_no_of_days_data: this.taskData.consider_no_of_days_data,
                        active_yn: this.taskData.active_yn,
                    };
                    Swal.fire({
                        title: 'ARE YOU SURE YOU WANT TO CHANGE IT!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.axios.post(process.env.MIX_API_URL + '/schedule-task-setup/' + this.taskData.schedule_task_id, params, {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).then(response => {
                                var data = response.data;
                                if (data.status) {
                                    this.$toastr.success(data.message);
                                    this.isLoading = false;
                                    this.resetForm()
                                    this.$bvModal.hide('taskEditModal')

                                } else {
                                    this.$toastr.error(data.message);
                                    this.isLoading = false;
                                }
                            })
                                .catch(error => {
                                    this.$toastr.error(error.response.data.message);
                                    this.isTaskSubmit = false;
                                })
                                .finally(() => {
                                    this.isTaskSubmit = false;
                                    this.getTableData();
                                });
                        } else {
                            this.isTaskSubmit = false;
                            this.$bvModal.hide('taskEditModal')
                            this.getTableData();
                        }
                    }).catch(error => {
                        this.isTaskSubmit = false;
                        this.getTableData();
                    })
                        .finally(() => {
                            this.isTaskSubmit = false;
                            this.getTableData();

                        });

                }
            },

            isNumber(evt) {
                evt = (evt) ? evt : window.event;
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
                    evt.preventDefault();
                } else {
                    return true;
                }
            },
            async getGeneralTableData() {
                this.isBusy = true;
                const params = {
                    // 'center_id': this.center_id,
                    // 'per_page': this.perPage,
                    // 'page': this.currentPage,
                };
                this.itemsGeneral =[];
                this.axios
                    .get(process.env.MIX_API_URL + '/settings-setup', {
                        params, headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        var res = response.data;
                        if (res.status) {

                            this.itemsGeneral = res.data;

                            // this.currentPage = res.data.current_page;
                            // this.totalRows = res.data.total;
                            // this.perPage = res.data.per_page;
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
            changeStatus(value, data) {
                this.isBusy = true;
                Swal.fire({
                    title: 'ARE YOU SURE YOU WANT TO CHANGE IT!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.isBusy = true;
                        const params = {
                            active_yn: value,
                        };
                        this.axios
                            .post(process.env.MIX_API_URL + '/settings-setup/' + data.item.setting_code, params, {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                            .then(response => {
                                var res = response.data;
                                this.isBusy = false;
                                this.getGeneralTableData();
                            })
                            .catch(error => {
                                this.$toastr.error(error.response.data.message);
                                this.getGeneralTableData();
                                this.isBusy = false;
                            })
                            .finally(() => {
                                this.isBusy = false;
                                this.getGeneralTableData();

                            });

                    } else {
                        this.getGeneralTableData();
                        this.isBusy = false;
                    }
                }).catch(error => {
                    this.isBusy = false;
                    this.getGeneralTableData();
                })
                    .finally(() => {
                        this.getGeneralTableData();
                        this.isBusy = false;

                    });

            }
        },
        computed: {}

    }
</script>

<style>

</style>
