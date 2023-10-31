<template>
    <div>
        <div  class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-9 col-xm-12">
                        <div class="mb-3">
                            <label for="name" class="form-label required">Role Name<span class="text-danger">*</span></label>
                            <input ref="rolename" type="text" class="form-control" :class="[(v$.name.$error)?'is-invalid':'']"
                                   id="name" v-model="name" name="name">
                            <ul v-if="v$.name.$error" class="parsley-errors-list filled">
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
                <div>
                    <button v-if="!isLoading" class="btn btn-primary float-end"
                            type="button" @click.prevent="submitForm()">{{btnName}}
                    </button>
                    <button v-if="isLoading" class="btn btn-primary float-end" type="button">
                        <div class="spinner-border" style="height: 1rem !important; width: 1rem !important;">
                            <span class="visually-hidden">Processing...</span>
                        </div>
                    </button>
                    <button @click="resetForm" v-if="!isLoading" class="btn btn-danger mr-2 float-end" type="button">Cancel</button>
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
        props:['formPage'],
        data() {
            return {
                tableData: [],
                isLoading: false,
                role_id: null,
                name: null,
                status: null,
                statusOptions: [
                    {value: null, text: 'Please select an option'},
                    {value: 'Y', text: 'Active'},
                    {value: 'N', text: 'Inactive'},
                ],
                btnName:"Save",
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                name: {required},
                status: {required},
            }
        },
        created() {
        },
        watch:{
            formPage(newData, oldData){
                this.role_id = newData.role_id;
                this.name = newData.role_name;
                this.status= newData.active_yn;
                this.$refs.rolename.focus(); //on click edit btn focus on the name input field
                this.btnName = "Update";
            }
        },
        mounted() {},
        methods: {
            async submitForm() {
                if (await this.v$.$validate()) {
                    this.isLoading = true;
                    const params = {
                        name: this.name,
                        active_yn: this.status
                    };
                    if( this.role_id){
                        var axiosObj =  this.axios.put(process.env.MIX_API_URL + '/role/'+this.role_id, params,{ headers: {
                                'Content-Type': 'multipart/form-data'
                            }})
                    }else{
                        var axiosObj =  this.axios.post(process.env.MIX_API_URL + '/role', params,{ headers: {
                                'Content-Type': 'multipart/form-data'
                            }})
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
                this.v$.$reset() // reset the dirty state of validation
                this.role_id = null;
                this.name = null;
                this.status = null;
                this.btnName = "Save";
                this.resetTitle();
            },
            sendToTable(data){
                this.$emit('formUpdated',data);
            },
            resetTitle() {
                this.$emit('resetPageTitle', true);
            }
        },
    }
</script>
