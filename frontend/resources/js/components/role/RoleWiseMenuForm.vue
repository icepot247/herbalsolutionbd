<template>
    <div>
        <div  class="card">
            <div class="card-body">
                <div class="row">

                    <div class="col-md-3 col-xm-12">
                        <div class="mb-3">
                            <label class="form-label">Select Role <span class="text-danger">*</span></label>
                    
                            <b-form-select class="form-select" :class="[(v$.role_id.$error)?'parsley-error':'']" v-model="role_id" :options="allRoles"
                                        name="role_id" value-field="role_id" text-field="role_name">
                                        <template #first>
                                            <b-form-select-option :value="null">-- Please select a role --</b-form-select-option>
                                        </template>
                            </b-form-select>

                            <ul v-if="v$.role_id.$error" class="parsley-errors-list filled">
                                <li class="parsley-required">The field is required.</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="col-md-3 col-xm-12">
                        <div class="mb-3">
                            <label class="form-label">Select Main Menu <span class="text-danger">*</span></label>
                    
                            <b-form-select class="form-select" :class="[(v$.main_menu_id.$error)?'parsley-error':'']" v-model="main_menu_id" :options="mainMenuList"
                                        name="main_menu_id" value-field="main_menu_id" text-field="main_menu_name"  @change="changeMainMenu()">
                                        <template #first>
                                            <b-form-select-option :value="null">-- Please select a Main Menu --</b-form-select-option>
                                        </template>
                            </b-form-select>

                            <ul v-if="v$.main_menu_id.$error" class="parsley-errors-list filled">
                                <li class="parsley-required">The field is required.</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="col-md-3 col-xm-12">
                        <div class="mb-3">
                            <label class="form-label">Select Menu <span class="text-danger">*</span></label>
                    
                            <b-form-select class="form-select" :class="[(v$.menu_id.$error)?'parsley-error':'']" v-model="menu_id" :options="menuList"
                                        name="menu_id" value-field="menu_id" text-field="manu_name">
                                        <template #first>
                                            <b-form-select-option :value="null">-- Please select a Menu --</b-form-select-option>
                                        </template>
                            </b-form-select>

                            <ul v-if="v$.menu_id.$error" class="parsley-errors-list filled">
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
                            type="button" @click.prevent="submitForm()">Save
                    </button>

                    <button v-if="isLoading" class="btn btn-primary float-end" type="button">
                        <div class="spinner-border" style="height: 1rem !important; width: 1rem !important;">
                            <span class="visually-hidden">Processing...</span>
                        </div>
                    </button>

                    <button class="btn btn-danger mr-2 float-end" type="button">Cancel</button>
                </div>

            </div>
            <!-- end card body -->
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
                allRoles: null,
                mainMenuList: null,
                menuList: null,
                role_id: null,
                main_menu_id: null,
                menu_id: null,
                status: null,
                statusOptions: [
                    {value: null, text: 'Please select an option'},
                    {value: 'Y', text: 'Active'},
                    {value: 'N', text: 'Inactive'},
                ]
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                role_id: {required},
                main_menu_id: {required},
                menu_id: {required},
                status: {required},
            }
        },
        created() {
        },
        watch:{
            formPage(newData, oldData){
                this.get_mainmenu_list();
                this.role_id = newData.role_id;
                this.main_menu_id = newData.main_menu_id;
                this.changeMainMenu();
                this.menu_id = newData.menu_id;
                this.status= newData.active_yn;
                
                this.$refs.rolename.focus(); //on click edit btn focus on the name input field
            }

        },
        mounted() {
            this.get_role_list();
            this.get_mainmenu_list();
        },
        methods: {
            get_role_list(){
                this.axios.get(process.env.MIX_API_URL + '/role', {})
                .then(
                    response => {
                        var res = response.data;

                        if(res.status)
                        {
                            this.allRoles = res.data.data;
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
            get_mainmenu_list(){
                this.axios.get(process.env.MIX_API_URL + '/main-menu', {})
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
            changeMainMenu()
            {
                this.axios.get(process.env.MIX_API_URL + '/menu/menu-by-main-menu-id/'+this.main_menu_id, {})
                .then(
                    response => {
                        var res = response.data;

                        if(res.status)
                        {
                            this.menuList = res.data;
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
            async submitForm() {
                if (await this.v$.$validate()) {
                    this.isLoading = true;
                    const params = {
                        role_id: this.role_id,
                        main_menu_id: this.main_menu_id,
                        menu_id: this.menu_id,
                        active_yn: this.status
                    };
                    
                    var axiosObj =  this.axios.post(process.env.MIX_API_URL + '/role-wise-menu', params)
                   
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
                            console.log('Loading off');
                            this.isLoading = false;
                        });
                }

            },
            resetForm() {
                this.v$.$reset() // reset the dirty state of validation
                this.role_id        = null;
                this.main_menu_id   = null;
                this.menu_id        = null;
                this.status         = null;
            },
            sendToTable(data){
                this.$emit('formUpdated',data);
            }


        },
    }
</script>
