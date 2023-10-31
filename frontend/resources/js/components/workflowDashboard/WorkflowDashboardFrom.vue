<template>
    <div>
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-12 ">
                        <div class="row">
                            <div class="col-md-4 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label required">Workflow Name
                                        <span class="text-danger">*</span>
                                    </label>
                                    <input ref="workflowName" class="form-control"  :class="[(v$.workflow_name.$error)?'is-invalid':'']" type="text" v-model="workflow_name">
                                    <ul v-if="v$.workflow_name.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>
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
<!--                            <div class="col-md-3 col-xm-12">-->
<!--                                <div class="mb-3">-->
<!--                                    <label class="form-label">Status <span class="text-danger">*</span></label>-->
<!--                                    <b-form-select :disabled="isStatusDisable"  class="form-select" :class="[(v$.status.$error)?'is-invalid':'']"-->
<!--                                                   v-model="status" :options="statusOptions" name="status"></b-form-select>-->
<!--                                    <ul v-if="v$.status.$error" class="parsley-errors-list filled">-->
<!--                                        <li class="parsley-required">Status field is required.</li>-->
<!--                                    </ul>-->
<!--                                </div>-->
<!--                            </div>-->

                            <div class="col-md-4 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label">Description</label>
<!--                                    <textarea class="form-control"  v-model="description" id="" cols="1" rows="1"></textarea>-->
                                    <input class="form-control"  v-model="description" />
                                </div>
                            </div>


                        </div>
                    </div>
<!--                    <pre>{{v$.items}}</pre>-->
                    <div class="col-md-12 mt-2">
                        <p class="h6">Workflow</p>
                        <b-table :items="items" :fields="fields">
                            <template #cell(step_seq)="row">
                                <b-form-select v-model="row.item.step_seq" @change="changeWorkflowSequence(row)" class="form-select"
                                               :class="[(v$.items.$each.$response.$data[row.index].step_seq.$error)?'is-invalid':'']"
                                >
                                    <b-form-select-option v-for="(option,key) in seqOptions" :key="key" :class="(items.filter(e => e.step_seq == option).length>0)?'bg-secondary text-white':''" :disabled="items.filter(e => e.step_seq == option).length>0" :value="option" >{{option}}</b-form-select-option>
                                </b-form-select>
                            </template>
                            <template #cell(user)="row">
<!--                                {{row.item}}-->
<!--                                <b-form-select class="form-select" v-model="row.item.user" :options="userList" name="status"></b-form-select>-->
                                <b-form-select v-model="row.item.user_id" @change="changeWorkflowSequence(row)" :class="[(v$.items.$each.$response.$data[row.index].user_id.$error)?'is-invalid':'']" class="form-select">
                                    <b-form-select-option v-for="(option,key) in userList" :key="key" :class="(items.filter(e => e.user.user_id == option.value).length>0)?'bg-secondary text-white':''" :disabled="items.filter(e => e.user.user_id == option.value).length>0" :value="option.value" >{{option.text}}</b-form-select-option>
                                </b-form-select>
                            </template>
                            <template #cell(active_yn)="row">
                                <b-form-select class="form-select"  @change="changeWorkflowSequence(row)"
                                               v-model="row.item.active_yn" :options="statusOptions" name="status"></b-form-select>
                            </template>
                            <template class="align-right p-1" #cell(actions)="row">
                                <button v-b-tooltip.hover title="ADD" type="button" class="btn btn-primary btn-sm mb-1"
                                        @click="addMore(row.index)">
                                    <i class="fas fa-plus-circle fa-xs"></i>
                                </button>
                                <button v-if="(row.item.workflow_step_id ==null)" @click="remove(row)" v-b-tooltip.hover title="Delete" type="button"
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
            </div>
        </div>
    </div>
</template>

<script>
    import useVuelidate from "@vuelidate/core";
    import {helpers, ipAddress, required, requiredIf,minValue} from "@vuelidate/validators";

    export default {
        name: "WorkflowDashboardFrom",
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
                    {key: 'step_seq', label: 'Sequence' ,tdClass:'col-1 p-1'},
                    {key: 'user', label: 'User',tdClass:'col-5 p-1'},
                    {key: 'active_yn', label: 'Status',tdClass:'col-2 p-1'},
                    {key: 'actions', label: 'Actions',tdClass:'col-5 p-1 text-right',thClass:'text-right'}
                ],
                items: [],
                userList : [],
                description : '',
                workflowOptions : [],
                seqOptions: [...Array(100).keys()].map(i => i + 1),
                centerList:[],
                workflow_name:null,
                workflow_id:null,
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                workflow_type: {required},
                status: {required},
                workflow_name: {required},
                items:{
                    $each: helpers.forEach({
                        step_seq: {
                            required,
                            minValue : minValue(1),
                        },
                        user_id: {
                            required,
                        },
                        // user: {
                        //     user_id:{required},
                        // },
                        // active_yn: {
                        //     required,
                        // },
                    })
                },
            }
        },
        created() {},
        watch: {
            tableData(newData, oldData) {
                if(newData){
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
            this.addMore();
        },
        methods: {
            addMore() {
                const param =  {
                        "workflow_step_id":null,
                        "active_yn":"N",
                        "step_seq":null,
                        "user_id":null,
                        "user":{
                            "user_id":null,
                            "user_name":""
                        }
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
                    .get(process.env.MIX_API_URL + '/users/all',{})
                    .then(response => {
                       // this.userList =  (response.data.status) ? response.data.data : [];
                        let userList  = [];
                        response.data.data.forEach(function (item,index) {
                            // console.log(item.user_id)
                            userList[index] = {
                                value: item.user_id,
                                text: item.user_name+" ("+item.user_type_name+")",
                            };
                        })
                        this.userList = userList;
                        // console.log(this.userList)
                    })
                    .catch(error => {
                        // console.log(error)
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },

            async submitForm() {
                if (await this.v$.$validate()) {
                    this.isLoading = true;
                    const params = {
                        workflow_id: this.workflow_id,
                        workflow_name: this.workflow_name,
                        description: this.description,
                        workflow_type_id: this.workflow_type,
                        steps: this.items,
                    };
                    var axiosObj = null;
                    var config = { headers: {'Content-Type': 'application/json'}};
                    if(this.workflow_id !== null){
                          axiosObj =  this.axios.put(process.env.MIX_API_URL + '/workflow/'+this.workflow_id, params,config)
                    }else{
                         axiosObj =  this.axios.post(process.env.MIX_API_URL + '/workflow', params,config)
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
                this.status =  'N';
                this.workflow_name =  null;
                this.description =  null;
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
            changeWorkflowSequence(data){

                if(data.item.user.user_id !== null){
                    this.items[data.index] = {
                        "workflow_step_id":data.item.workflow_step_id,
                        "active_yn":data.item.active_yn,
                        "step_seq":data.item.step_seq,
                        "user_id":data.item.user.user_id,
                        "user":{
                            "user_id":data.item.user.user_id,
                            "user_name":data.item.user.user_name
                        }
                    };

                }
            },
            getWorkflow() {
                this.axios.get(process.env.MIX_API_URL + '/workflow/'+this.workflow_id, {})
                    .then(response => {
                        const res = response.data;

                        if (res.status) {
                            this.items = res.steps;
                            this.items.map(function (item) {
                                item.user_id = item.user.user_id;
                            })
                            this.workflow_type =  res.data.workflow_type.workflow_type_id;
                            this.status =  res.data.active_yn;
                            this.workflow_name =  res.data.workflow_name;
                            this.description =  res.data.description;
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
                        this.workflowOptions =  (response.data.status) ? response.data.data : [];
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },
        }
    }
</script>
