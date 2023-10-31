<template>
    <div>
        <div class="card">
            <div class="card-body">
<!--                <div class="row">-->
<!--                    <div class="offset-xl-4 col-xl-4 offset-md-4 col-md-6 col-sm-12">-->
<!--                        <div class="row mb-3">-->
<!--                            <div class="col-xl-7 col-md-6 col-sm-12">-->
<!--                                <div class="d-flex flew-row "></div>-->
<!--                                <label for="sl_no">Serial No</label>-->
<!--                                <input @keyup.enter="searchForm" type="text" class="form-control" :class="[(v$.sl_no.$error)?'is-invalid':'']"-->
<!--                                       id="sl_no" v-model="sl_no" name="sl_no">-->
<!--                                <ul v-if="v$.sl_no.$error" class="parsley-errors-list filled">-->
<!--                                    <li class="parsley-required">The field is required.</li>-->
<!--                                </ul>-->

<!--                            </div>-->
<!--                            <div class="col-xl-5 col-md-6 col-sm-12 mt-4 p-2">-->
<!--                                <button class="btn btn-primary btn-sm mt-1" @click.prevent="searchForm">search</button>-->
<!--                                <a href="/pad">-->
<!--                                    <button class="btn btn-danger btn-sm mt-1">Clear</button>-->
<!--                                </a>-->
<!--                            </div>-->

<!--                        </div>-->

<!--                    </div>-->

<!--                </div>-->

                <Loader :loading="isLoading" :class="(isLoading)?'mt-5':''"/>
                <div v-if="hasData" class="row ">
                    <div class="col-md-12 col-sm-12">
                        <div class="card border border-dark">
                            <div class="card-header bg-transparent border-dark">
                                <h5 class="my-0 text-dark">FC Lot Information</h5>
                            </div>
                            <div class="card-body">
                                <div v-if="search_data" class="row">

                                    <div class="col-md-6">
                                        <div class="row">
                                            <div class="col-md-3 card-title">Serial No</div>
                                            <div class="col-md-1 d-none d-sm-block">:</div>
                                            <div class="col-md-3 card-text">
                                                <input type="number" :min="search_data.fc_serial_start_no" :max="search_data.fc_serial_end_no" v-model="search_data.last_serial_no" class="form-control"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <div class="col-md-3 card-title">Available Page</div>
                                            <div class="col-md-1 d-none d-sm-block">:</div>
                                            <div class="col-md-3 card-text">
                                                {{(search_data.fc_serial_end_no - search_data.last_serial_no)}}
<!--                                                <input type="number" :min="search_data.fc_serial_start_no" :max="search_data.fc_serial_end_no" v-model="search_data.last_serial_no" class="form-control"/>-->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-12">
                                        <div class="row">
                                            <div class=" col-md-3 card-title">Lot No</div>
                                            <div class="col-md-1 col-sm-1 d-none d-sm-block">:</div>
                                            <div class="col-md-8 col-sm-12 card-text">{{search_data.fc_lot_no}}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <div class="col-md-3 card-title">Serial Start No</div>
                                            <div class="col-md-1 d-none d-sm-block">:</div>
                                            <div class="col-md-8 card-text">{{search_data.fc_serial_start_no}}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-12">
                                        <div class="row">
                                            <div class=" col-md-3 card-title">Serial End No</div>
                                            <div class="col-md-1 col-sm-1 d-none d-sm-block">:</div>
                                            <div class="col-md-8 col-sm-12 card-text">{{search_data.fc_serial_end_no}}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <div class="col-md-3 card-title">Number of FC</div>
                                            <div class="col-md-1 d-none d-sm-block">:</div>
                                            <div class="col-md-8 card-text">{{search_data.no_of_fc }}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-12">
                                        <div class="row">
                                            <div class=" col-md-3 card-title">Last Box No</div>
                                            <div class="col-md-1 col-sm-1 d-none d-sm-block">:</div>
                                            <div class="col-md-8 col-sm-12 card-text">{{search_data.lot_box_no}}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <div class="col-md-3 card-title">Branch Name</div>
                                            <div class="col-md-1 d-none d-sm-block">:</div>
                                            <div class="col-md-8 card-text">{{search_data.branch_info.branch_name}}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <div class="col-md-3 card-title">Lot Finished</div>
                                            <div class="col-md-1 d-none d-sm-block">:</div>
                                            <div class="col-md-8 card-text">{{(search_data.lot_finish_yn == 'Y') ? 'Yes' : 'No'}}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <div class="col-md-3 card-title">Lot Finished Date</div>
                                            <div class="col-md-1 d-none d-sm-block">:</div>
                                            <div class="col-md-8 card-text">{{(search_data.lot_finish_date) ? mixinFormatDate(search_data.lot_finish_date) : ''}}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <div class="col-md-3 card-title">Received Date</div>
                                            <div class="col-md-1 d-none d-sm-block">:</div>
                                            <div class="col-md-8 card-text">{{mixinFormatDate(search_data.received_date)}}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 ">

                                    </div>
                                    <div class="col-md-6 ">
                                        <div class="row">
                                            <div class="col-md-3 card-title">Cancel Reason</div>
                                            <div class="col-md-1 d-none d-sm-block">:</div>
                                            <div class="col-md-8 card-text">
                                                <textarea class="form-control" v-model="cancelReason" cols="2" rows="2" :class="[(v$.cancelReason.$error)?'is-invalid':'']"></textarea>
                                                <ul v-if="v$.cancelReason.$error" class="parsley-errors-list filled">
                                                    <li class="parsley-required">The field is required.</li>
                                                </ul>

                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 mt-2">
                                        <Loader :loading="isLoading" v-if="isLoading"/>
                                        <button v-if="!isLoading" class="btn btn-danger float-end" @click="confirmPopUp">Destroy</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="noData" class="row">
                    <p class="h4 text-center text-danger">No Data Found</p>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import useVuelidate from "@vuelidate/core";
    import {required} from "@vuelidate/validators";
    import Loader from "../common/Loader";
    import {dateTimeFormatterMixin} from "../../mixins/dateTimeFormatterMixin";

    export default {
        name: "PadSearch",
        components: {Loader},
        mixins:[dateTimeFormatterMixin],
        data() {
            return {
                sl_no: null,
                search_data: [],
                hasData: false,
                isLoading: false,
                noData: false,
                cancelReason: '',
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                sl_no: {required},
                cancelReason: {required},
            }
        },
        created() {
        },
        mounted() {
            this.searchForm();
        },
        methods: {

            async searchForm() {
                // if (await this.v$.$validate()) {
                    this.isLoading = true;
                    // this.axios.get(process.env.MIX_API_URL + '/pad/' + this.sl_no, {})
                    this.axios.get(process.env.MIX_API_URL + '/pad/details', {})
                        .then(response => {

                            if(response.status){
                                this.search_data = response.data.data;
                                this.hasData = true;
                                this.isLoading = false;
                            }else {
                                this.noData = true;
                            }

                        })
                        .catch(error => {
                            this.hasData = false;
                            this.$toastr.error('No Data Found');
                            this.noData = true;
                            this.isLoading = false;
                        })
                        .finally(() => {
                            this.isLoading = false;
                        });
                // }
            },
            confirmPopUp(){
                this.v$.$validate();
                if (!this.v$.cancelReason.$error) {
                    Swal.fire({
                        title: 'Are you sure ?',
                        icon: 'warning',
                        showCancelButton: true,
                        cancelButtonText: 'Close',
                        cancelButtonColor: '#dd3333',
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#007bff',

                    }).then((result)=>{
                        if(result.isConfirmed){
                            this.destroy()
                        }
                    });
                }

            },
            destroy(){
                const params = {
                    fc_lot_id: this.search_data.fc_lot_id,
                    branch_id: this.search_data.branch_id,
                    center_id: this.search_data.center_id,
                    serial_no:this.search_data.last_serial_no,
                    cancel_reason: this.cancelReason,
                };
                    this.isLoading = true;
                    this.axios.post(process.env.MIX_API_URL + '/pad' , params,{ headers: {
                            'Content-Type': 'multipart/form-data'
                        }})
                        .then(response => {
                            this.$toastr.success(response.data.message);
                            this.sendToTable(response.data);
                            this.searchForm();
                            this.resetForm();
                        })
                        .catch(error => {
                            this.$toastr.error(error.response.data.message);
                            // this.hasData = false;
                            this.searchForm();
                        })
                        .finally(() => {
                            this.isLoading = false;
                        });

            },
            sendToTable(data) {
                this.$emit('formData', data)
            },
            resetForm() {
                // this.hasData = false;
                // this.search_data = [];
                // this.sl_no = null;
                this.cancelReason  = '';
                this.v$.$reset()
            },
            // formatDate(date){
            //    return moment(date).format('DD-MMM-YYYY');
            // }
        },
        computed: {}
    }
</script>

<style scoped>

</style>
