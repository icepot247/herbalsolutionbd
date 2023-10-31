<template>
    <div>
        <div class="card">
            <div class="card-body">
                <h3 class="card-title">Workflow List</h3>
                <b-row>
                    <b-col lg="1" md="1" class="my-2 col-3">
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
                    <b-col v-if="center_list.length>0 && (userTypeId==1)" lg="3" md="2" class="my-2 col-3">
                        <b-form-group  class="mb-0"
                        >
                            <b-form-select
                                    id="per-page-select"
                                    v-model="center_id"
                                    @change="handleCenterChange"
                                    size="sm"
                                    class="col-md-12"
                            >
                                <option :value="null" >
                                    ALL (CENTER)
                                </option>
                                <option v-for="(val,key) in center_list" :key="key" :value="val.value"
                                        :disabled="val.disabled">
                                    {{ val.text }}
                                </option>
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col lg="3" md="3" class="my-2 col-3">
                        <b-form-group
                                v-if="(userTypeId==1)"
                                class="mb-0"
                        >
                            <b-form-select
                                    id="per-page-select"
                                    v-model="workflow_type_filter"
                                    @change="handleTypeChange"
                                    size="sm"
                                    class="col-md-12"
                            >
                                <option  :value="null" > ALL (TYPE)</option>
                                <option v-for="(val,key) in workflowOptions" :key="key" :value="val.value" >
                                    {{(val.text).toUpperCase()}}
                                </option>
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col lg="2" md="2" class="my-2 col-3">
                        <b-form-group
                                v-if="(userTypeId==1)"
                                class="mb-0"
                        >
                            <b-form-select
                                    id="per-page-select"
                                    v-model="workflow_status_filter"
                                    @change="handleStatusChange"
                                    size="sm"
                                    class="col-md-12"
                            >
                                <option v-for="(val,key) in workflow_status_list" :key="key" :value="val.value"
                                        :disabled="val.disabled">
                                    {{ (val.text).toUpperCase() }}
                                </option>
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col v-if="(userTypeId !=1)" lg="3" md="2"></b-col>
                    <b-col lg="3" md="4" class="my-2 col-3">
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
                        <b-button v-if="(row.item.approval_status_flag=='Y' || userTypeId==1)"
                                  @click="showVehicleClassModal(row.item, row.index, $event.target)"
                                  class="m-1 btn-info p-1"
                                  size="sm" title="Details " v-b-tooltip.hover>
                            <i class="fas fa-network-wired icon-size"></i></b-button>
                        <b-button @click="showWorkflowApprovalDataModal(row.item, row.index, $event.target)"
                                  class="m-1 btn-success p-1"
                                  size="sm" title="Approval Steps" v-b-tooltip.hover>
                            <i class="fas fa-eye icon-size"></i></b-button>

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

                <b-modal :title="modalTitle" scrollable id="itemClassModal" size="xl" no-close-on-backdrop
                         @hide="resetInfoModal">
                    <template #modal-header="{ close }">
                        <h5  class="modal-title"> <div v-html="modalTitle"></div><div v-if="(centerName !=='' && centerName !==null)" class=""> <span class="font-weight-bold">Center: </span>{{centerName}}</div></h5>
                        <button type="button" @click="close()" aria-label="Close" class="close">×</button>
                    </template>
                    <div v-if="(modalData.workflow_type_id ==1)" class="row">
                        <div style="background-color: cyan" class="col-md-12 font-weight-normal p-1  pb-0 card-bg-success">
                            <ul class="mb-0">
                                <li> BOLD TEXT ARE ACTIVE ITEM</li>
                                <li> ADDED / MODIFIED ITEM SHOWN IN RED BORDER</li>
                            </ul>
                        </div>
                    </div>
                    <table v-if="(modalData.workflow_type_id ==1)" class="table ">
                        <thead>
                        <tr>
                            <th class="col-md-4"> Item Test Type</th>
                            <th class="col-md-2"> Sub Test Type</th>
                            <th class="col-md-1"><span title="Required (Must Answer Item)">Required</span></th>
                            <th class="col-md-1"><span title="Criteria (Item Should Passed For Result)">Criteria</span>
                            </th>
                            <th class="col-md-1"><span title="Status (Item will be shown)">Status (View)</span></th>
                        </tr>
                        </thead>
                        <tbody>
                        <Loader v-show="isLoading" :loading="isLoading" class="mt-4"></Loader>
                        <tr :key="index" v-for="(item, index) in itemTypeList"
                            style="background-color: #e6e6e6 !important;">

                            <td class="p-1 align-middle">
                                <span class="fs-6"
                                      :class="(item.sub_test_type_item_active_yn=='Y')?'font-weight-bold':'text-muted'">{{item.text}}</span>
                            </td>

                            <td class="p-1 align-middle">
                                <span class="fs-6"
                                      :class="(item.sub_test_type_active_yn=='Y')?'font-weight-bold':'text-muted'">{{item.sub_test_type_name}}</span>
                            </td>
                            <td  class="p-1 align-middle">
                                <input :disabled="true" type="checkbox" :id='`switch_required_`+index' switch="info"
                                       :checked="(itemTypeList[index].required_yn=='Y')?true:false">
                                <label :style="((modalData.decision_status_flag == 0 ||modalData.decision_status_flag == 1)?((item.required_yn !== itemClassList[index].required_yn)?'border:3px solid red;padding:12px!important;':'') : '') "
                                       class="mb-0 align-middle" style="cursor:not-allowed"
                                       :for='`switch_required_`+index' data-on-label="Yes" data-off-label="No"></label>
                            </td>
                            <td   class="p-1 align-middle">
                                <input :disabled="true" type="checkbox" :id='`switch_criteria_`+index' switch="info"
                                       :checked="(itemTypeList[index].passing_criteria_yn=='Y')?true:false">
                                <label :style="((modalData.decision_status_flag == 0 ||modalData.decision_status_flag == 1)?((item.passing_criteria_yn !== itemClassList[index].passing_criteria_yn)?'border:3px solid red;padding:12px!important;':''):'')"
                                       class="mb-0 align-middle" style="cursor:not-allowed"
                                       :for='`switch_criteria_`+index' data-on-label="Yes" data-off-label="No"></label>
                            </td>
                            <td   class="p-1 align-middle">
                                <input :disabled="true" type="checkbox" :id='`switch_active_yn_`+index' switch="info"
                                       :checked="(itemTypeList[index].active_yn=='Y')?true:false">
                                <label :style="((modalData.decision_status_flag == 0 ||modalData.decision_status_flag == 1)?((item.active_yn !== itemClassList[index].active_yn)?'border:3px solid red;padding:12px!important;':''):'')"
                                       class="mb-0 align-middle" style="cursor:not-allowed"
                                       :for='`switch_active_yn_`+index' data-on-label="Yes" data-off-label="No"></label>
                            </td>
                        </tr>

                        </tbody>
                    </table>

                    <div v-if="(modalData.workflow_type_id ==2)" class="row">
                        <div class="col-md-3 col-xm-12">
                            <div class="mb-3">
                                <label for="name" class="form-label required">Sub Test Type <span
                                        class="text-danger">*</span></label>
                                <input :disabled="true"  ref="testTypeName" type="text" class="form-control"
                                       id="name" v-model="subTestTypeDetails.sub_test_type_name" name="name">
                            </div>
                        </div>
                        <div class="col-md-3 col-xm-12">
                            <div class="mb-3">
                                <label class="form-label">Test type <span class="text-danger">*</span></label>
                                <b-form-select :disabled="true" class="form-select"
                                               v-model="subTestTypeDetails.test_type_id" :options="typeList"
                                               name="testType"></b-form-select>
                            </div>
                        </div>
                        <div class="col-md-3 col-xm-12">
                            <div class="mb-3">
                                <label for="name" class="form-label required">Sequence <span
                                        class="text-danger">*</span></label>
                                <b-form-select :disabled="true"  class="form-select"
                                               v-model="subTestTypeDetails.type_seq" :options="seqOptions"></b-form-select>
                            </div>
                        </div>
                        <div class="col-md-3 col-xm-12">
                            <div class="mb-3">
                                <label class="form-label">Status <span class="text-danger">*</span></label>
                                <b-form-select :disabled="true"  class="form-select"
                                               v-model="subTestTypeDetails.active_yn" :options="statusOptions" name="status"></b-form-select>
                            </div>
                        </div>
                    </div>
                    <b-table v-if="(modalData.workflow_type_id ==2)"  :items="subTestTypeList" :fields="subTestTypeFields">
                        <template #cell(item_type)="row">
                            <input :disabled="true"  type="text" class="form-control"
                                   v-model="row.item.test_item_name" >
                        </template>
                        <template #cell(type_seq)="row">
                            <!--                        <b-form-select v-model="row.item.item_seq" :options="seqOptions"-->
                            <!--                                       class="form-select">-->
                            <!--                        </b-form-select>                        -->
                            <b-form-select :disabled="true"  v-model="row.item.item_seq" class="form-select">
                                <b-form-select-option v-for="(option,key) in seqOptions" :key="key" :class="(items.filter(e => e.item_seq == option).length>0)?'bg-secondary text-white':''" :disabled="items.filter(e => e.item_seq == option).length>0" :value="option" >{{option}}</b-form-select-option>

                            </b-form-select>
                        </template>
                        <template #cell(item_type_status)="row">
                            <b-form-select :disabled="true"  v-model="row.item.active_yn" :options="statusOptions"
                                           class="form-select">
                            </b-form-select>
                        </template>
                    </b-table>

                    <template #modal-footer="{ cancel }">
                        <div class="col-md-12 pr-2">
                            <div class="row">
                                <div class="col-md-2 ">
                                    <label class="justify-content-start">Comments:<span class="text-danger">*</span>
                                    </label>
                                </div>
                                <div class="col-md-12 p-2">
                                    <textarea :readonly="true" placeholder="Write your comment" required
                                              class="form-control" name="comments" id="" cols="1" rows="1">{{modalData.summary}}</textarea>
                                </div>
                            </div>
                        </div>
                        <div v-if="(modalData.decision_status_flag == -2)" class="col-md-12 pr-2">
                            <div class="row">
                                <div class="col-md-2 ">
                                    <label class="justify-content-start">Reject Reason: </label>
                                </div>
                                <div class="col-md-12 p-2">
                                    <textarea :readonly="true" class="form-control" name="comments" cols="1" rows="1">{{modalData.rejection_message}}</textarea>
                                </div>
                            </div>
                        </div>
                        <b-button v-if="(modalData.approval_status_flag !=='N') && !approvalLoader" @click="approveWorkflow()" size="sm"
                                  variant="primary">
                            Approve
                        </b-button>
                        <button v-if="approvalLoader" class="btn btn-outline-primary float-end" type="button">
                            <div class="spinner-border" style="height: 1rem !important; width: 1rem !important;">
                                <span class="visually-hidden">Processing...</span>
                            </div>
                        </button>
                        <b-button v-if="(modalData.approval_status_flag !=='N')" @click="showRejectModal()" size="sm"
                                  variant="danger">
                            Reject
                        </b-button>
                        <b-button @click="cancel()" size="sm" variant="secondary">
                            Close
                        </b-button>
                    </template>
                </b-modal>
                <b-modal :title="modalTitle" scrollable centered id="workflowApprovalDataModal" size="lg"
                         @hide="resetInfoModal">

                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th class="col-md-1">Sequence</th>
                            <th class="col-md-5">User Name</th>
                            <th class="col-md-2">Action</th>
                            <th class="col-md-4">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        <Loader v-show="isLoading" :loading="isLoading" class="mt-4"></Loader>
                        <tr :key="index" v-for="(item, index) in workflowApprovalData">

                            <td class="p-1 text-center">{{item.approval_seq}}</td>
                            <td class="p-1">
                                {{item.user_data.user_name}}
                            </td>
                            <td class="p-1">

                                <span v-if="(item.decision_status == 'APPROVED')"
                                      class="badge badge-success">Approved</span>
                                <span v-else-if="(item.decision_status == 'REJECTED')" class="badge badge-danger">Rejected</span>
                                <span v-else-if="(item.decision_status == 'FORWARDED')" class="badge badge-warning">Forwarded</span>
                                <span v-else-if="(item.decision_status == 'PENDING')" class="badge badge-primary">Pending</span>
                                <span v-else class="badge badge-secondary">{{item.decision_status}}</span>
                            </td>
                            <td class="p-1">
                                {{item.action_date}}
                            </td>
                        </tr>
                        <tr v-if="(workflowApprovalData.length ===0)" class="bg-light">
                            <td colspan="4" class="text-danger text-center">No Data found</td>
                        </tr>

                        </tbody>
                    </table>


                    <template #modal-footer="{ cancel }">
                        <b-button @click="cancel()" size="sm" variant="secondary">
                            Close
                        </b-button>
                    </template>
                </b-modal>
                <b-modal title="Reject Panel" no-close-on-backdrop centered id="rejectModal" size="lg"
                         @hide="resetInfoModal">

                    <div class="row">
                        <div class="col-md-12 col-xm-12">
                            <div class="mb-3">
                                <label class="form-label">Reject Reason:</label>
                                <span class="text-danger">*</span>
                                <textarea class="form-control" rows="1" cols="1" v-model="comments"
                                          :class="[(v$.comments.$error)?'is-invalid':'']"
                                ></textarea>
                                <ul v-if="v$.comments.$error" class="parsley-errors-list filled">
                                    <li class="parsley-required">The field is required.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <template #modal-footer="{ cancel }">
                        <b-button @click="rejectWorkflow()" size="sm" variant="danger">
                            Reject
                        </b-button>
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
    import useVuelidate from "@vuelidate/core";
    import {required} from "@vuelidate/validators";
    import LocalStore from "../../plugins/LocalStore";

    export default {
        name: "WorkflowDashboardTable",
        components: {Loader},
        props: ['formData'],
        data() {
            return {
                isBusy: true,
                pageOptions: [5, 10, 100],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false, sortDirection: 'desc', tdClass: "p-1"},
                    {
                        key: 'reference_name',
                        label: 'Reference Name',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1"
                    },
                    {
                        key: 'workflow_type_name',
                        label: 'Type',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1"
                    },
                    {
                        key: 'action_date',
                        label: 'Action Date',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return value;
                        },
                        tdClass: "p-1"
                    },
                    {
                        key: 'decision_status',
                        label: 'Status',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return value;

                        },
                        tdClass: (value, key, item) => {
                            if (value === "APPROVED") {
                                return ' text-success'
                            } else if (value === "REJECTED") {
                                return ' text-danger'
                            } else {
                                return ' text-secondary'
                            }
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
                isLoading: false,
                stepsFields: [
                    {key: 'step_seq', label: 'Sequence', tdClass: 'col-1 p-1 text-center'},
                    {key: 'user', label: 'User', tdClass: 'col-5 p-1'},
                    {key: 'active_yn', label: 'Status', tdClass: 'col-2 p-1'},
                ],
                modalTitle: '',
                modalData: [],
                itemTypeList: [],
                workflowApprovalData: [],
                comments: null,
                rejectReason: null,
                userTypeId: this.$store.getters.getUser.data.user_type_id,
                workflow_status_filter: null,
                workflow_status_list: [
                    {value: null, text: 'All (Status)', disabled: false},
                    {value: 0, text: 'Pending', disabled: false},
                    {value: 1, text: 'Forwarded', disabled: false},
                    {value: 2, text: 'Approved', disabled: false},
                    {value: -2, text: 'Rejected', disabled: false},
                ],
                subTestTypeList:[],
                subTestTypeDetails:[],
                subTestTypeFields: [
                    {key: 'item_type', label: 'Item Type'},
                    {key: 'type_seq', label: 'Sequence'},
                    {key: 'item_type_status', label: 'Status'},
                ],
                seqOptions: [...Array(100).keys()].map(i => i + 1),
                statusOptions: [
                    {value: null, text: 'Please select an option'},
                    {value: 'Y', text: 'Active'},
                    {value: 'N', text: 'Inactive'},
                ],
                itemClassList:[],
                workflowOptions:[],
                workflow_type_filter:null,
                center_id: -1,
                center_list: [],
                approvalLoader: false,
                centerName: null,

            }
        },
        computed: {},
        mounted() {
            this.getTableData();
            this.getTypeList();
            this.getWorkflowType();
            this.getCenter();
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                comments: {required}
            }
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
                    'workflow_status_filter': (this.workflow_status_filter ||this.workflow_status_filter ===0 ) ? this.workflow_status_filter : null,
                    'workflow_type_filter': this.workflow_type_filter,
                    'center_id': this.center_id,
                };
                this.axios
                    .get(process.env.MIX_API_URL + '/workflow/dashboard', {params: params})
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
            showVehicleClassModal(item, index, button) {
                if(item.workflow_type_id == 1){
                    this.modalTitle = ((item) ? 'Vehicle Class: ' + item.reference_name : '') ;
                    this.modalData = item;
                    this.centerName = item.center_name;
                    this.getVehicleClass(item);
                    this.getVehicleMainClass(item);
                }else if(item.workflow_type_id == 2){
                    this.modalTitle = ((item) ? 'Sub Test Type: ' + item.reference_name : '')+ ((item.center_name !=null && item.center_name!='')?' For: '+item.center_name:'');
                    this.modalData = item;
                    this.getSubTestType(item);
                }

                this.$bvModal.show('itemClassModal')
            },
            getVehicleClass(data) {
                this.isLoading = true;
                var axiosObj = null;
                if (this.userTypeId == 1) {
                    axiosObj = this.axios.get(process.env.MIX_API_URL + '/wf-class-dashboard/' + data.reference_no, {
                        params:{"approval_action_id":this.modalData.workflow_action_id,'center_id':data.center_id}
                    }).catch(error => {
                      this.$toastr.error(error.response.data.message)
                    })
                } else {
                    axiosObj = this.axios.get(process.env.MIX_API_URL + '/wf-class/' + data.reference_no, {
                        params:{'center_id':data.center_id}
                    }).catch(error => {
                      this.$toastr.error(error.response.data.message)
                    })
                }

                axiosObj.then(res => {
                    this.isLoading = false;
                    this.itemTypeList = (res.status) ? res.data.data : [];
                })
                    .catch(error => {
                        this.isLoading = false;
                        this.$toastr.error(error.message);
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            },
            getSubTestType(data) {
                this.isLoading = true;
                var axiosObj = null;
                if (this.userTypeId == 1) {
                    axiosObj = this.axios.get(process.env.MIX_API_URL + '/wf-subtest-dashboard/' + data.reference_no, {
                        params:{"approval_action_id":this.modalData.workflow_action_id,'center_id':data.center_id}
                    }).catch(error => {
                      this.$toastr.error(error.response.data.message)
                    })
                } else {
                    axiosObj = this.axios.get(process.env.MIX_API_URL + '/wf-subtest/' + data.reference_no, {
                        params:{'center_id':data.center_id}
                    }).catch(error => {
                      this.$toastr.error(error.response.data.message)
                    })
                }

                axiosObj.then(res => {
                    this.isLoading = false;
                    this.subTestTypeList = (res.status) ? res.data.itemData : [];
                    this.subTestTypeDetails = (res.status) ? res.data.data : [];
                })
                    .catch(error => {
                        this.isLoading = false;
                        this.$toastr.error(error.message);
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            },
            resetInfoModal() {
                this.modalitems = []
                this.getTableData();
                this.v$.$reset()

            },
            showWorkflowApprovalDataModal(item, index, button) {
                this.modalTitle = ((item) ? 'Vehicle Class: ' + item.reference_name : '')+ ((item.center_name !=null && item.center_name!='')?' For: '+item.center_name:'');
                this.workflowApprovalData = item.workflowApprovalData;
                this.modalData = item;
                this.$bvModal.show('workflowApprovalDataModal')
            },
            async approveWorkflow() {
                this.approvalLoader = true;
                const params = {
                    workFlowActionId: this.modalData.workflow_action_id,
                    approvalStatus: 2
                };
                var config = {headers: {'Content-Type': 'application/json'}};
                this.axios.post(process.env.MIX_API_URL + '/workflow/approval', params, config).then(response => {
                    var data = response.data;
                    if (data.status) {
                        this.$toastr.success(data.message);
                        this.$bvModal.hide('itemClassModal');
                        this.approvalLoader = false;
                        this.checkNotification();
                    } else {
                        this.$toastr.error(data.message);
                        this.isLoading = false;
                    }
                })
                    .catch(error => {
                        this.$toastr.error(error.response.message);
                        this.approvalLoader = false;
                    })
                    .finally(() => {
                        this.approvalLoader = false;
                    });
            },
            async rejectWorkflow() {

                if (await this.v$.$validate()) {
                    this.isLoading = true;
                    const params = {
                        workFlowActionId: this.modalData.workflow_action_id,
                        approvalStatus: -2,
                        comments: this.comments
                    };

                    var config = {headers: {'Content-Type': 'application/json'}};
                    this.axios.post(process.env.MIX_API_URL + '/workflow/approval', params, config)
                        .then(response => {
                            var data = response.data;
                            if (data.status) {
                                this.$toastr.success(data.message);
                                this.isLoading = false;
                                this.$bvModal.hide('rejectModal');
                                this.checkNotification();

                            } else {
                                this.$toastr.error(data.message);
                                this.isLoading = false;
                            }
                        })
                        .catch(error => {
                            this.$toastr.error(error.response.message);
                            this.isLoading = false;
                        })
                        .finally(() => {
                            this.isLoading = false;
                        });
                }

            },
            showRejectModal() {
                this.$bvModal.hide('itemClassModal');
                this.$bvModal.show('rejectModal')
            },
            checkNotification() {
                let res = LocalStore.getStorage('user');
                if (res) {
                    this.$store.dispatch("setNotifications");
                }

            },
            handleStatusChange(value) {
                this.workflow_status_filter = value;
                this.currentPage = 1;
                this.getTableData();
            },
            getTypeList() {
                this.axios
                    .get(process.env.MIX_API_URL + '/common/test-type', {})
                    .then(response => {

                        const res = response.data;

                        if (res.status) {
                            this.typeList = res.data
                        }
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },
            getVehicleMainClass(data) {
                this.isLoading = true;
                const params = {
                    center_id:data.center_id
                }
                this.axios
                    .get(process.env.MIX_API_URL + '/main-class/' + data.reference_no, {params:params})
                    .then(res => {
                        this.isLoading = false;
                        this.itemClassList = (res.status) ? res.data.data : [];
                    })
                    .catch(error => {
                      console.log("MAin ", error)
                        this.isLoading = false;
                        this.$toastr.error(error.message);
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            },
            getWorkflowType() {
                this.axios
                    .get(process.env.MIX_API_URL + '/common/workflow-type', {})
                    .then(response => {
                        this.workflowOptions = (response.data.status) ? response.data.data : [];
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },
            handleTypeChange(value) {
                this.workflow_type_filter = value;
                this.currentPage = 1;
                this.getTableData();
            },
            getCenter() {
                // this.isLoading = true;
                this.axios
                    .get(process.env.MIX_API_URL + '/common/class-wise/center', {})
                    .then(res => {
                        this.center_list = (res.status) ? res.data.data : [];
                    })
                    .catch(error => { this.$toastr.error(error.response.data.message)})
                    .finally(() => { });
            },
            handleCenterChange(value) {
                this.center_id = value;
                this.currentPage = 1;
                this.getTableData();
            },

        }
    }
</script>
