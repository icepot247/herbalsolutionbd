<template>
    <div>
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-12">
                        <div class="row  ">
                            <div class="col-md-3 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label">Date:</label>
                                    <span class="text-danger">*</span>
                                    <input ref="shiftDate" v-model="date" name="date" :class="[(v$.date.$error)?'is-invalid':'']"
                                           @change="getDetails" :min="todayDate"
                                           type="date" class="form-control">
                                    <ul v-if="v$.date.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-3 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label">Shift:</label>
                                    <span class="text-danger">*</span>
                                    <b-form-select class="form-select" :class="[(v$.slot.$error)?'is-invalid':'']"
                                                   @change="getDetails"
                                                   v-model="slot" :options="slotList"
                                                   name="slot">

                                    </b-form-select>
                                    <ul v-if="v$.slot.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-3 col-xm-12">
                                <Loader class="col-12 mt-5" :loading="isLoading"></Loader>
                            </div>
                        </div>
                    </div>
                    <div v-if="shiftDetails.length > 0 " class="col-12 pt-5 border-top">
                        <div class="row">
                            <div class="col-md-12 col-xm-12 table-responsive">
                                <table class="table">
                                    <colgroup>
                                        <col style="width: 40%">
                                        <col style="width: 30%">
                                        <col style="width: 30%">
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th scope="col">Booth</th>
                                        <th scope="col">Counter</th>
                                        <th scope="col">User</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(data, index) in shiftDetails" :key="index">
                                        <td scope="row">{{data.booth.booth_name}}</td>
                                        <td class="p-1">
                                            <div class="col-md-12 text-left p-0">Counter - {{data.counter_no}}</div>
                                        </td>
                                        <td class="p-1">
                                            <div class="col-md-12 p-0">
<!--                                                <b-form-select :disabled="(date<todayDate)? true : false" class="form-select" @change="updateShift(data)"-->
<!--                                                               v-model="data.user_id" :options="userList"-->
<!--                                                               name="user"></b-form-select>-->


                                                <b-form-select @change="updateShift(data)" v-model="data.user_id">
                                                    <b-form-select-option v-for="(option,key) in userList" :key="key" :class="(shiftDetails.filter(e => e.user_id == option.value).length>0)?' font-weight-bold' : ''"  :value="option.value" >{{option.text}}</b-form-select-option>
                                                </b-form-select>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div v-if="shiftDetails.length > 0 " class="col-12">
                        <button @click="resetForm" class="btn btn-danger mr-2 float-end" type="button">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import useVuelidate from "@vuelidate/core";
    import {required} from "@vuelidate/validators";
    import vMultiselectListbox from 'vue-multiselect-listbox'
    import 'vue-multiselect-listbox/dist/vue-multi-select-listbox.css';
    import LocalStore from "../../plugins/LocalStore";
    import Loader from "../common/Loader";

    export default {
        name: "ShiftManagementForm",
        props: ['tableData'],
        components: {Loader, vMultiselectListbox},
        data() {
            return {
                isLoading: false,
                slot: null,
                date: null,
                users: [],
                slotList: [],
                userList: [],
                shiftDetails: [],
                todayDate: new Date().toISOString().split("T")[0]
            }
        },
        created() {
            this.getSlotList();
            this.getUserList();
        },
        watch: {
            tableData(newValue, oldValue) {
                this.slot = newValue.shift_id;
                this.date = newValue.slot_date;
                this.getDetails();
                this.$refs.shiftDate.focus();
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                slot: {required},
                date: {required},
            }
        },
        methods: {
            getDetails() {
                if (this.date != null && this.slot != null) {
                    let formatedDate = (new Date(this.date)).toLocaleDateString(); // formated to mm/dd/YYYY
                    const axiosObj = this.axios.get(process.env.MIX_API_URL + '/shift-management/view?shift_id=' + this.slot + "&shift_date=" + formatedDate, {})
                    this.isLoading = true;
                    axiosObj.then(response => {
                        this.shiftDetails = (response.status) ? response.data.data : [];
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
                this.slot = null;
                this.date = null;
                this.shiftDetails = [];
                this.sendToTable({});
            },
            sendToTable(data) {
                this.$emit('formData', data)
            },
            getSlotList() {
                this.axios
                    .get(process.env.MIX_API_URL + '/common/slots/' + this.$store.getters.getUser.data.center_id, {})
                    .then(response => {
                        this.slotList = (response.status) ? response.data.data : [];
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },
            getUserList() {
                this.axios
                    .get(process.env.MIX_API_URL + '/common/users/' + this.$store.getters.getUser.data.center_id, {})
                    .then(response => {
                        this.userList = (response.data.status) ? response.data.data : [];
                    })
                    .catch(error => {
                        this.toaster().error(error.response.data.message);
                    })
                    .finally(() => {
                    })
            },
            updateShift(data) {
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
                            counter_id: data.counter_id,
                            user_id: data.user_id,
                            dates: this.date,
                            shift_id: this.slot,
                            active_yn: 'Y',
                        };
                        const axiosObj = this.axios.put(process.env.MIX_API_URL + '/shift-management/update', params,{ headers: {
                                'Content-Type': 'multipart/form-data'
                            }})
                        axiosObj.then(response => {
                            var data = response.data;
                            if (data.status) {
                                this.$toastr.success(data.message);
                                this.isLoading = false;
                                this.sendToTable(data);
                            } else {
                                this.$toastr.error(data.message);
                                this.isLoading = false;
                            }
                        })
                            .catch(error => {
                                this.$toastr.error(error.response.data.message);
                                this.isLoading = false;
                                this.getDetails();
                            })
                            .finally(() => {
                                this.isLoading = false;
                            });
                    }else{
                        this.getDetails();
                    }

                });
            }
        }
    }
</script>

