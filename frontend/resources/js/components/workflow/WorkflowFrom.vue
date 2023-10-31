<template>
    <div>
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-12 ">
                        <div class="row">
<!--                            <div class="col-md-4 col-xm-12">-->
<!--                                <div class="mb-3">-->
<!--                                    <label class="form-label required">Workflow Name-->
<!--                                        <span class="text-danger">*</span>-->
<!--                                    </label>-->
<!--                                    <input ref="workflowName" class="form-control"-->
<!--                                           :class="[(v$.workflow_name.$error)?'is-invalid':'']"-->
<!--                                           type="text" v-model="workflow_name">-->
<!--                                    <ul v-if="v$.workflow_name.$error" class="parsley-errors-list filled">-->
<!--                                        <li class="parsley-required">The field is required.</li>-->
<!--                                    </ul>-->
<!--                                </div>-->
<!--                            </div>-->
                            <div class="col-md-4 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label required">Workflow Type <span
                                            class="text-danger">*</span></label>
                                    <b-form-select ref="type"
                                                   class="form-select"
                                                   :class="[(v$.workflow_type.$error)?'is-invalid':'']"
                                                   v-model="workflow_type" :options="workflowOptions"
                                                   name="status">

                                    </b-form-select>
                                    <ul v-if="v$.workflow_type.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-4 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label">Description</label>
                                    <input class="form-control" v-model="description"/>
                                </div>
                            </div>


                        </div>
                    </div>
                    <div class="col-md-12 mt-2">
                        <p class="h6">Workflow Approval Steps</p>
                        <b-table ref="table" :items="items" :fields="fields">
                            <template #cell(step_seq)="row">
                                <!--                               index {{row.index}} item steps {{row.item.step_seq}}-->
                                <label>{{row.item.step_seq}}</label>
                                <!--                                <input disabled type="number" class="form-control"  v-model="row.item.step_seq">-->
                                <!--                                <b-form-select :disabled="row.item.workflow_step_id !== null"-->
                                <!--                                               v-model="row.item.step_seq" class="form-select"-->
                                <!--                                               :class="[(v$.items.$each.$response.$data[row.index].step_seq.$error && (v$.items.$errors.length > 0))?'is-invalid':'']"-->
                                <!--                                >-->
                                <!--                                    <b-form-select-option v-for="(option,key) in seqOptions" :key="key"-->
                                <!--                                                          :class="(items.filter(e => e.step_seq == option).length>0)?'bg-secondary text-white':''"-->
                                <!--                                                          :disabled="(items.filter(e => e.step_seq == option).length>0)"-->
                                <!--                                                          :value="option">{{option}}-->
                                <!--                                    </b-form-select-option>-->
                                <!--                                </b-form-select>-->
                            </template>
                            <template #cell(user)="row">

                                <div class="input-group">
                                    <input type="hidden" class="form-control" placeholder="Search User"
                                           @blur="reloadValidateModel"
                                           v-model="row.item.user_id"
                                     :class="[(v$.items.$each.$response.$data[row.index].user_id.$error && (v$.items.$errors.length > 0))?'is-invalid':'']"
                                    />
                                    <input :value="row.item.user.user_name" class="form-control"
                                           :readonly="true"
                                           @blur="reloadValidateModel"
                                           :class="[(v$.items.$each.$response.$data[row.index].user_id.$error && (v$.items.$errors.length > 0))?'is-invalid':'']"
                                           type="text">
                                    <div class="input-group-append">
                                        <button v-b-tooltip.hover title="search" type="button"
                                                class="btn btn-primary btn-sm"
                                                @click="showUserModal(row)">
                                            <i class="fas fa-search "></i>
                                        </button>
                                    </div>
                                </div>
                                <!--                                <b-form-select-->
                                <!--                                               v-model="row.item.user_id"-->
                                <!--                                               @change="changeWorkflowSequence(row)"-->
                                <!--                                               :class="[(v$.items.$each.$response.$data[row.index].user_id.$error && (v$.items.$errors.length > 0))?'is-invalid':'']"-->
                                <!--                                               class="form-select">-->
                                <!--                                    <b-form-select-option v-for="(option,key) in userList" :key="key"-->
                                <!--                                                          :class="(items.filter(e => e.user.user_id == option.value).length>0)?'bg-secondary text-white':''"-->
                                <!--                                                          :disabled="(items.filter(e => e.user.user_id == option.value).length>0)"-->
                                <!--                                                          :value="option.value">{{option.text}}-->
                                <!--                                    </b-form-select-option>-->
                                <!--                                </b-form-select>-->

                                <!--                                <button v-b-tooltip.hover title="search" type="button" class="btn btn-primary btn-sm mb-1"-->
                                <!--                                        @click="showUserModal()">-->
                                <!--                                    <i class="bx bx-search-alt-2 "></i>-->
                                <!--                                </button>-->
                            </template>
                            <template #cell(active_yn)="row">
                                <b-form-select  class="form-select" @change="changeWorkflowSequence(row)"
                                                @blur="reloadValidateModel"
                                               :class="[(v$.items.$each.$response.$data[row.index].active_yn.$error && (v$.items.$errors.length > 0))?'is-invalid':'']"
                                               v-model="row.item.active_yn" :options="statusOptions"
                                               name="status"></b-form-select>
                            </template>
                            <template class="align-right p-1" #cell(actions)="row">
                                <button v-b-tooltip.hover title="ADD" type="button" class="btn btn-primary btn-sm mb-1"
                                        @click="addMore()">
                                    <i class="fas fa-plus-circle fa-xs"></i>
                                </button>
                                <button v-if="(row.item.workflow_step_id ==null)" @click="remove(row)" v-b-tooltip.hover
                                        title="Delete" type="button"
                                        class="btn btn-danger btn-sm mb-1">
                                    <i class="fas fa-trash-alt fa-xs"></i>
                                </button>
                            </template>
                        </b-table>
                    </div>
                </div>

                <div>
                    <button v-if="!isLoading" class="btn btn-primary float-end"
                            type="button" @click.prevent="submitForm()">{{saveBtn}}
                    </button>
                    <button v-if="isLoading" class="btn btn-primary float-end" type="button">
                        <div class="spinner-border" style="height: 1rem !important; width: 1rem !important;">
                            <span class="visually-hidden">Processing...</span>
                        </div>
                    </button>
                    <button @click="resetForm" class="btn btn-danger mr-2 float-end" type="button">Cancel</button>
                </div>
                <b-modal :title="modalTitle" id="userModal" size="xl" @hide="resetModalField">

                    <div class="row p-3">
                        <div class="col-md-3">
                            <div class="mb-3">
                                <label class="form-label required">Branch Name </label>
                                <b-form-select ref="branchId" class="form-select"
                                               :class="[(v$.branchId.$error)?'is-invalid':'']"
                                               v-model="branchId"
                                               name="deviceType">
                                    <b-form-select-option disabled :value="null">Please select an option
                                    </b-form-select-option>
                                    <b-form-select-option  v-for="(val ,key) in branchList" :value="val.code"
                                                          :key="key">{{val.label}}
                                    </b-form-select-option>
                                </b-form-select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="mb-3">
                                <label class="form-label required">Designation </label>
                                <b-form-select ref="userDesignation" class="form-select"
                                               :class="[(v$.userDesignation.$error)?'is-invalid':'']"
                                               v-model="userDesignation"
                                               name="deviceType">
                                    <b-form-select-option disabled :value="null">Please select an option
                                    </b-form-select-option>
                                    <b-form-select-option v-for="(val ,key) in userDesignationList" :value="val.value"
                                                          :key="key">{{val.text}}
                                    </b-form-select-option>
                                </b-form-select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="mb-3">
                                <label class="form-label required">Employee Name </label>
                                <input @keyup.enter="searchUser()"  class="form-control" type="text" v-model="employeeName">
                            </div>
                        </div>
                        <div class="col-md-3 mt-4 p-2">
                            <button v-if="!isLoading" class="btn btn-primary float-end"
                                    type="button" @click.prevent="searchUser()">Search
                            </button>
                            <button v-if="isLoading" class="btn btn-primary float-end" type="button">
                                <div class="spinner-border" style="height: 1rem !important; width: 1rem !important;">
                                    <span class="visually-hidden">Processing...</span>
                                </div>
                            </button>
                            <button @click="resetModalField" class="btn btn-danger mr-2 float-end" type="button">
                                Clear
                            </button>
                        </div>
                    </div>

                    <div v-if="bspUserList.length >0" class="row" >
                        <div class="col-md-12 bg-warning font-weight-bold">
                            * Please select a row from table
                        </div>
                        <div style="height: 300px;overflow-y: auto" class="col-md-12 mt-3">
                            <table v-if="bspUserList.length >0" class="table table-hover  mt-3">
                                <thead class="sticky-top bg-dark text-white">
                                <tr>
                                    <th class="col-md-6">Employee Name</th>
                                    <th class="col-md-2 text-end">Employee Id</th>
                                    <th class="col-md-4 text-end">Designation</th>
                                </tr>
                                </thead>
                                <tbody>
                                <Loader v-show="isLoading" :loading="isLoading" class="mt-4"></Loader>
                                <tr @click="saveBRTAUser(item)" style="cursor: pointer;" :key="index"
                                    v-for="(item, index) in bspUserList">

                                    <td class="p-1 ">{{item.employeeName}}</td>
                                    <td class="p-1 text-end"> {{item.employeeId}} </td>
                                    <td class="p-1 text-end">{{item.designationName}}</td>
                                </tr>
                                <tr v-if="(bspUserList.length ===0)" class="bg-light">
                                    <td colspan="4" class="text-danger text-center">No Data found</td>
                                </tr>

                                </tbody>
                            </table>

                        </div>
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
    import useVuelidate from "@vuelidate/core";
    import {helpers, ipAddress, required, requiredIf, minValue, sameAs} from "@vuelidate/validators";
    import Loader from "../common/Loader";

    export default {
        name: "WorkflowFrom",
        components: {Loader},
        props: ['tableData'],
        data() {
            return {
                isLoading: false,
                saveBtn: 'Save',
                workflow_type: '',
                status: 'N',
                statusOptions: [
                    {value: 'Y', text: 'Active'},
                    {value: 'N', text: 'Inactive'},
                ],
                fields: [
                    {key: 'step_seq', label: 'Steps', thClass: 'text-center', tdClass: 'col-1 p-1 text-center'},
                    {key: 'user', label: 'User', tdClass: 'col-7 p-1'},
                    {key: 'active_yn', label: 'Status', tdClass: 'col-2 p-1'},
                    {key: 'actions', label: 'Actions', tdClass: 'col-1 p-1 text-right', thClass: 'text-right'}
                ],
                items: [],
                userList: [],
                description: '',
                workflowOptions: [],
                seqOptions: [...Array(100).keys()].map(i => i + 1),
                centerList: [],
                workflow_name: null,
                workflow_id: null,
                employeeName: null,
                userDesignation: null,
                userDesignationList: [],
                branchId: null,
                branchList: null,
                bspUserList: [ ],
                currentItem:[],
                modalTitle:null,
                branchName:null,
                designation:null,
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                workflow_type: {required},
                workflow_name: {required},
                items: {
                    $each: helpers.forEach({
                        step_seq: {
                            required,
                            minValue: minValue(1),
                        },
                        user_id: {
                            required,
                            userAlreadyExist : (value,obj) =>{
                                return !(this.items.filter(item =>item.user_id==obj.user_id).length > 1);
                            }
                        },
                        // user: {
                        //     user_id:{required},
                        // },
                        active_yn: {
                            required,
                            mustBeActive: (value, obj) => {
                                // var isNotRequired = true;
                                // if ((JSON.stringify(this.items[0])) == (JSON.stringify(obj)) && (obj.active_yn === 'N')) {
                                //     isNotRequired = false;
                                // }
                                return (this.items.filter(item => (item.active_yn == 'Y')).length > 0);
                            }
                        },
                    })
                },
                userDesignation: {required},
                branchId: {required},
            }
        },
        created() {
        },
        watch: {
            tableData(newData, oldData) {
                if (newData) {
                    this.workflow_id = newData.workflow_id;
                    this.getWorkflow();
                    this.$refs.workflowName.focus();
                    this.saveBtn = 'Update';

                }
            }
        },
        mounted() {
            this.getCenterList();
            this.getWorkflowType();
            this.getUserList();
            this.getBrtaBranch();
            this.getDesignation();
            this.addMore();
        },
        methods: {
            addMore() {
                const param = {
                    "workflow_step_id": null,
                    "active_yn": "N",
                    "step_seq": (this.items.length + 1),
                    "user_id": null,
                    "user": {
                        "user_id": null,
                        "user_name": ""
                    },
                    "branchId":null,

                };
                this.items.push(param);
            },
            remove(item) {
                if (this.items.length === 1) {
                    this.$toastr.error("Sorry! You can't delete the last one");
                } else {
                    this.items.splice(item.index, 1);
                }
            },
            getUserList() {
                this.axios
                    .get(process.env.MIX_API_URL + '/users/all', {})
                    .then(response => {
                        // this.userList =  (response.data.status) ? response.data.data : [];
                        let userList = [];
                        response.data.data.forEach(function (item, index) {
                            userList[index] = {
                                value: item.user_id,
                                text: item.user_name + " (" + item.user_type_name + ")",
                            };
                        })
                        this.userList = userList;
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },

            async submitForm() {
                await this.v$.$validate()
                this.v$.userDesignation.$reset()
                this.v$.branchId.$reset()
                if (!(this.v$.$errors.length >0)) {
                    this.isLoading = true;
                    const params = {
                        workflow_id: this.workflow_id,
                        workflow_name: this.workflow_name,
                        description: this.description,
                        workflow_type_id: this.workflow_type,
                        steps: this.items,
                    };
                    var axiosObj = null;
                    var config = {headers: {'Content-Type': 'application/json'}};
                    if (this.workflow_id !== null) {
                        axiosObj = this.axios.put(process.env.MIX_API_URL + '/workflow-setup/' + this.workflow_id, params, config)
                    } else {
                        axiosObj = this.axios.post(process.env.MIX_API_URL + '/workflow-setup', params, config)
                    }
                    axiosObj.then(response => {
                        var data = response.data;
                        if (data.status) {
                            this.$toastr.success(data.message);
                            this.isLoading = false;
                            this.resetForm();
                            this.sendToTable(data);
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
                }
            },
            resetForm() {
                this.items = [];
                this.workflow_type = null;
                this.workflow_id = null;
                this.status = 'N';
                this.workflow_name = null;
                this.description = null;
                this.saveBtn = "Save";
                this.resetTitle()
                this.v$.$reset()
                this.addMore();

            },
            sendToTable(data) {
                this.$emit('formUpdated', data);
            },
            resetTitle() {
                this.$emit('resetPageTitle', true);
            },
            getCenterList() {
                this.axios.get(process.env.MIX_API_URL + '/common/center', {})
                    .then(response => {
                        const res = response.data;

                        if (res.status) {
                            this.centerList = res.data;
                        }
                    })
                    .catch(error => {
                            this.$toastr.error(error.response.data.message);
                        }
                    )
                    .finally();
            },
            changeWorkflowSequence(data) {
                if (data.item.user.user_id !== null) {
                    this.items[data.index] = {
                        "workflow_step_id": data.item.workflow_step_id,
                        "active_yn": data.item.active_yn,
                        "step_seq": data.item.step_seq,
                        "user_id": data.item.user_id,
                        "user": {
                            "user_id": data.item.user_id,
                            "user_name": ''
                        },
                        "branchId":data.item.branchId
                    };
                }
                this.reloadValidateModel();
            },
            getWorkflow() {
                this.axios.get(process.env.MIX_API_URL + '/workflow-setup/' + this.workflow_id, {})
                    .then(response => {
                        const res = response.data;

                        if (res.status) {
                            this.items = res.steps;
                            this.items.map(function (item) {
                                item.user_id = item.user.user_id;
                            })
                            this.workflow_type = res.data.workflow_type.workflow_type_id;
                            this.status = res.data.active_yn;
                            this.workflow_name = res.data.workflow_name;
                            this.description = res.data.description;
                        }
                    })
                    .catch(error => {
                            this.$toastr.error(error.response.data.message);
                        }
                    )
                    .finally();
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
            showUserModal(data) {
                this.currentItem  = data;
                this.modalTitle = "Select User For Step "+this.currentItem.item.step_seq;
                this.$bvModal.show('userModal');
            },
            resetInfoModal() {
                this.modalitems = []
                this.v$.$reset()
            },
            resetModalField() {
                this.employeeName = null;
                this.userDesignation = null;
                this.branchId = null;
                this.bspUserList = [];
                this.branchName = null;
                this.v$.$reset();
            },
            async searchUser() {

                this.v$.branchId.$touch();
                this.v$.userDesignation.$touch();
                this.bspUserList = [];
                if((this.branchId =='' || this.branchId == null) || (this.userDesignation =='' || this.userDesignation ==null)  ){
                    return false;
                }
                this.isLoading = true;
                const params = {
                    branch_id: this.branchId,
                    designation_id: this.userDesignation,
                    employee_name: this.employeeName,
                };

                var config = {headers: {'Content-Type': 'application/json'}};

                this.axios.post(process.env.MIX_API_URL + '/common/brta-branch-users', params, config)
                .then(response => {
                    var data = response.data;
                    if (data.status) {
                        this.bspUserList = response.data.data;
                        this.isLoading = false;
                    } else {
                        this.$toastr.error(data.message);
                        this.isLoading = false;
                    }
                }) .catch(error => {
                        this.$toastr.error(error.response.data.message);
                        this.isLoading = false;
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });


            },
            getBrtaBranch() {
                this.isLoading = true;
                this.axios
                    .get(process.env.MIX_API_URL + '/common/brta-branch', {})
                    .then(response => {
                        this.isLoading = false;
                        this.branchList = (response.data.status) ? response.data.data : [];
                    })
                    .catch(error => {
                        this.isLoading = false;
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            },
            getDesignation() {
                this.isLoading = true;
                this.axios
                    .get(process.env.MIX_API_URL + '/common/designation', {})
                    .then(response => {
                        this.isLoading = false;
                        this.userDesignationList = (response.data.status) ? response.data.data : [];
                    })
                    .catch(error => {
                        this.isLoading = false;
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            },
            saveBRTAUser(data) {

                this.isLoading = true;
                const params = {
                    loginName: data.loginName,
                    employeeId: data.employeeId,
                    employeeName: data.employeeName,
                    designationId: data.designationId,
                    designationName: data.designationName,
                    branchId: this.branchId,
                };
                var config = {headers: {'Content-Type': 'application/json'}};

                this.axios.post(process.env.MIX_API_URL + '/users/brta/save', params, config)
                    .then(response => {
                        if (response.data.status) {
                            this.updateItemDetails(this.currentItem,response.data.data)
                            this.$refs.table.refresh()
                            this.reloadValidateModel();
                            this.$bvModal.hide('userModal')
                            this.isLoading = false;
                        } else {
                            this.updateItemDetails(this.currentItem,response.data.data)
                            this.$refs.table.refresh()
                            this.$bvModal.hide('userModal')
                            this.isLoading = false;
                        }
                    }) .catch(error => {
                    this.$toastr.error(error.response.data.message);
                    this.isLoading = false;
                }) .finally(() => {
                        this.isLoading = false;
                    });


            },
            updateItemDetails(item,data){
                this.items[item.index] = {
                    "workflow_step_id": item.item.workflow_step_id,
                    "active_yn": item.item.active_yn,
                    "step_seq": item.item.step_seq,
                    "user_id": data.userId,
                    "user": {
                        "user_id": data.userId,
                        "user_name": data.employeeName+' ( '+this.userDesignationList.find(item=>item.value==this.userDesignation).text+')'
                    },
                    "branchId":this.branchId,
                };
            },
            reloadValidateModel(){
                const  items = this.v$.items.$model
                this.v$.items.$model = [];
                this.v$.items.$model = items
            },
        }
    }
</script>
