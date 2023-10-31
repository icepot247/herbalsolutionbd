<template>
    <div>
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3 col-xm-12">
                        <div class="mb-3">
                            <label for="name" class="form-label required">Sub Test Type <span
                                class="text-danger">*</span></label>
                            <input ref="testTypeName" type="text" class="form-control"
                                   :class="[(v$.name.$error)?'is-invalid':'']"
                                   id="name" v-model="name" name="name">
                            <ul v-if="v$.name.$error" class="parsley-errors-list filled">
                                <li class="parsley-required">The field is required.</li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-3 col-xm-12">
                        <div class="mb-3">
                            <label class="form-label">Test type <span class="text-danger">*</span></label>
                            <b-form-select :disabled="(typeof newData === 'object' && newData !== null)" class="form-select" :class="[(v$.testType.$error)?'is-invalid':'']"
                                           v-model="testType" :options="typeList"
                                           name="testType"></b-form-select>
                            <ul v-if="v$.testType.$error" class="parsley-errors-list filled">
                                <li class="parsley-required">The field is required.</li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-3 col-xm-12">
                        <div class="mb-3">
                            <label for="name" class="form-label required">Sequence <span
                                class="text-danger">*</span></label>
                            <b-form-select class="form-select" :class="[(v$.status.$error)?'is-invalid':'']"
                                           v-model="seq" :options="seqOptions"></b-form-select>

                            <ul v-if="v$.seq.$error" class="parsley-errors-list filled">
                                <li class="parsley-required">The field is required.</li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-3 col-xm-12">
                        <div class="mb-3">
                            <label class="form-label">Status <span class="text-danger">*</span></label>
                            <b-form-select class="form-select" :class="[(v$.status.$error)?'is-invalid':'']"
                                           v-model="status" :options="statusOptions" name="status"></b-form-select>
                            <ul v-if="v$.status.$error" class="parsley-errors-list filled">
                                <li class="parsley-required">Status field is required.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <b-table :items="items" :fields="fields">
                    <template #cell(item_type)="row">
                        <input type="text" class="form-control"
                              v-model="row.item.test_item_name" >
                    </template>
                    <template #cell(type_seq)="row">
<!--                        <b-form-select v-model="row.item.item_seq" :options="seqOptions"-->
<!--                                       class="form-select">-->
<!--                        </b-form-select>                        -->
                        <b-form-select v-model="row.item.item_seq" class="form-select">
                            <b-form-select-option v-for="(option,key) in seqOptions" :key="key" :class="(items.filter(e => e.item_seq == option).length>0)?'bg-secondary text-white':''" :disabled="items.filter(e => e.item_seq == option).length>0" :value="option" >{{option}}</b-form-select-option>

                        </b-form-select>
                    </template>
                    <template #cell(item_type_status)="row">
                        <b-form-select v-model="row.item.active_yn" :options="statusOptions"
                                       class="form-select">
                        </b-form-select>
                    </template>
                    <template class="align-right p-1" #cell(actions)="row">
                        <button v-b-tooltip.hover title="ADD" type="button" class="btn btn-primary btn-sm mb-1"
                                @click="addMore(row.index)">
                            <i class="fas fa-plus-circle fa-xs"></i>
                        </button>
                        <button v-if="row.item.test_item_id ==null" @click="remove(row)" v-b-tooltip.hover title="Delete" type="button"
                                class="btn btn-danger btn-sm mb-1">
                            <i class="fas fa-trash-alt fa-xs"></i>
                        </button>
                    </template>
                </b-table>
                <div>
                    <button v-if="!isLoading && saveBtn " class="btn btn-primary float-end"
                            type="button" @click.prevent="submitForm()">Save
                    </button>
                    <button v-if="!isLoading && updateBtn" class="btn btn-primary float-end"
                            type="button" @click.prevent="updateForm()">Update
                    </button>
                    <button v-if="isLoading" class="btn btn-primary float-end" type="button">
                        <div class="spinner-border" style="height: 1rem !important; width: 1rem !important;">
                            <span class="visually-hidden">Processing...</span>
                        </div>
                    </button>
                    <button v-if="!isLoading" @click="resetForm" class="btn btn-danger mr-2 float-end"
                            type="button">Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import useVuelidate from '@vuelidate/core'
    import {required} from '@vuelidate/validators'

    export default {
        name: 'CreateForm',
        props: ['formPage','sendForm'],
        data() {
            return {
                tableData: [],
                typeList: [],
                item_type_name: [],
                isLoading: false,
                updateBtn: false,
                saveBtn:true,
                name: '',
                testType: '',
                seq: '',
                item_seq:[],
                status: '',
                newItem:[],
                item_type_status: [],
                test_item_name:[],
                seqOptions: [...Array(100).keys()].map(i => i + 1),
                statusOptions: [
                    {value: null, text: 'Please select an option'},
                    {value: 'Y', text: 'Active'},
                    {value: 'N', text: 'Inactive'},
                ],
                fields: [
                    {key: 'item_type', label: 'Item Type'},
                    {key: 'type_seq', label: 'Sequence'},
                    {key: 'item_type_status', label: 'Status'},
                    {key: 'actions', label: 'Actions'}
                ],
                items: [{}],
                allFields: [],
                newData: null,
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                name: {required},
                seq: {required},
                testType: {required},
                status: {required},
            }
        },
        created() {
        },
        watch:{

            sendForm(newData, oldData){
                this.newData = newData;
                this.sub_test_type_id = newData.data.sub_test_type_id;
                this.name = newData.data.sub_test_type_name;
                this.seq= newData.data.type_seq;
                this.status= newData.data.active_yn;
                this.testType= newData.data.test_type_id;
                this.updateBtn = newData.status;
                this.saveBtn = false;
                this.items = newData.itemData;
                this.$refs.testTypeName.focus();
            }

        },


        mounted() {
            this.getTypeList();
        },
        methods: {
            addMore(index) {
                this.items.push({
                });
            },
            remove(item) {
                if (this.items.length === 1) {
                    this.$toastr.error("Sorry! You can't delete the last one");
                } else {
                    this.items.splice(item.index, 1);
                }
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


            async submitForm() {

                if (await this.v$.$validate()) {
                    this.isLoading = true;
                    const params = {
                        name: this.name,
                        testType: this.testType,
                        seq: this.seq,
                        status: this.status,
                       items: this.items,
                    };

                        var axiosObj =  this.axios.post(process.env.MIX_API_URL + '/subtest', params,{ headers: {
                                'Content-Type': 'application/json'
                            }})

                    axiosObj.then(response => {
                        var data = response.data;

                        if (data.status) {
                            this.$toastr.success(data.message);
                            this.isLoading = false;
                            this.resetForm();
                            this.items = [{}];
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
            async updateForm() {

                // if (await this.v$.$validate()) {
                //     this.isLoading = true;
                    const params = {
                        sub_test_type_id:this.sub_test_type_id,
                        name: this.name,
                        testType: this.testType,
                        seq: this.seq,
                        status: this.status,
                       items: this.items,
                    };

                var axiosObj =  this.axios.put(process.env.MIX_API_URL + '/subtest/'+this.sub_test_type_id , params,{ headers: {
                        'Content-Type': 'application/json'
                    }})

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
                // }

            },
            resetForm() {
                this.newData = null;
                this.v$.$reset() // reset the dirty state of validation
                this.testType = null;
                this.name = null;
                this.seq = null;
                this.status = null;
                this.items = [{}];
                this.resetTitle();
                this.saveBtn = true;
                this.updateBtn = false;
                this.sub_test_type_id = null;
                this.$refs.testTypeName.focus();


            },
            sendToTable(data) {
                this.$emit('formUpdated', data);
            },
            resetTitle(){
                this.$emit('resetPageTitle',true)
            }


        },
    }
</script>
