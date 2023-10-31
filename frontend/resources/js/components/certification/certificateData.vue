<template>
    <div>
        <div class="card">
            <div class="card-body">
                <h5 class="">Certificate</h5>
                <b-row>
                    <b-col lg="3" md="4" class="my-2 col-4 p-1">
                        <b-form-group
                            class="mb-0"
                        >
                            <b-form-select
                                id="per-page-select"
                                v-model="perPage"
                                :options="pageOptions"
                                @change="handlePageSizeChange"
                                size="sm"
                                class="col-md-4"
                            ></b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col lg="6" md="4" class="my-2 col-4"></b-col>
                    <b-col lg="3" md="4" class="my-2 col-4 p-1">
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
                  <template #cell(registration_no)="row" :class="'p-1'">
                    {{((row.item.registration_no != null && row.item.registration_no != '') ? row.item.registration_no   :  row.item.chassis_no )}}
                  </template>
                    <template class="align-right " #cell(action)="row">

                        <button v-if="row.item['insp'] == null" v-b-tooltip.hover title="Generate Certificate"
                                type="button" class="btn btn-info m-1 p-1"
                                @click="generate(row.item, row.index, $event.target)">

                            <i class="fas fa-certificate fa-xs icon-size"></i>
                        </button>
                        <button v-else-if="!isPdfLoading && row.item['insp'] != null" v-b-tooltip.hover title="Print Certificate" type="button"
                                class="btn btn-primary btn-sm m-1 p-1"
                                @click="generatePrint(row.item, row.index, $event.target)">
                            <i class="fas fa-print icon-size"></i>
                        </button>
                      <button v-if="isPdfLoading" class="btn btn-outline-success float-end" type="button">
                        <div class="spinner-border"
                             style="height: 1rem !important; width: 1rem !important;">
                          <span class="visually-hidden">Processing...</span>
                        </div>
                      </button>
                        <b-button v-if="!isShowLoading" @click="printresult(row.item)"
                                  class="m-1 btn-success p-1"
                                  size="sm" title="Show Result" v-b-tooltip.hover>
                            <i class="fas fa-eye icon-size"></i>
                        </b-button>

                      <button v-if="isShowLoading" class="btn btn-outline-success" type="button">
                        <div class="spinner-border"
                             style="height: 1rem !important; width: 1rem !important;">
                          <span class="visually-hidden">Processing...</span>
                        </div>
                      </button>

                        <button v-if="!isBusy" title="Certificate Page Cancel" type="button"
                                class="btn btn-danger btn-sm m-1 p-1"
                                @click="certificatePageCancel(row.item, row.index, $event.target)">
                            <i class="fas fa-trash icon-size"></i>
                        </button>
                        <button v-if="isBusy" class="btn btn-outline-success float-end" type="button">
                            <div class="spinner-border"
                                 style="height: 1rem !important; width: 1rem !important;">
                                <span class="visually-hidden">Processing...</span>
                            </div>
                        </button>
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
                <b-modal title="Certificate Page Cancel Request" id="requestModal" size="xl" @hide="resetModalField">
                    <div v-if="search_data" class="row">

                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-3 card-title">Serial No</div>
                                <div class="col-md-1 d-none d-sm-block">:</div>
                                <div class="col-md-3 card-text">
                                    <input :class="[(v$.last_serial_no.$error)?'is-invalid':'']" @keypress="isNumber($event)" v-model="last_serial_no" type="text" class="form-control">
                                    <ul v-if="v$.last_serial_no.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-3 card-title">Registration No</div>
                                <div class="col-md-1 d-none d-sm-block">:</div>
                                <div class="col-md-8 card-text">
                                    {{registration_no}}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-3 card-title">Available Page</div>
                                <div class="col-md-1 d-none d-sm-block">:</div>
                                <div class="col-md-3 card-text">
                                    {{(search_data.fc_serial_end_no - search_data.last_serial_no)}}
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

                      <div class="col-md-6">
                        <div class="row">
                          <div class="col-md-3 card-title">Chassis No</div>
                          <div class="col-md-1 d-none d-sm-block">:</div>
                          <div class="col-md-8 card-text">
                            {{chassis_no}}
                          </div>
                        </div>
                      </div>

                        <div class="col-12 mt-2">
                            <Loader :loading="isBusy" v-if="isBusy"/>
<!--                            <button v-if="!isLoading" class="btn btn-danger float-end" @click="confirmPopUp">Destroy</button>-->
                        </div>
                    </div>

                    <template #modal-footer="{ cancel }">
                        <b-button v-if="!isBusy" @click="certificatePageCancelSubmit()" size="sm" variant="primary">
                            Submit
                        </b-button>
                        <button v-if="isBusy" class="btn btn-sm btn-outline-primary float-end" type="button">
                            <div class="spinner-border"
                                 style="height: 1rem !important; width: 1rem !important;">
                                <span class="visually-hidden">Processing...</span>
                            </div>
                        </button>
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
    import {dateTimeFormatterMixin} from "../../mixins/dateTimeFormatterMixin";
    import useVuelidate from "@vuelidate/core";
    import {required} from "@vuelidate/validators";
    import Loader from "../common/Loader";
    export default {
        name: 'certificateData',
        components: {Loader},
        props: ['resSearchData'],
        mixins:[dateTimeFormatterMixin],
        data() {
            return {
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false, sortDirection: 'desc', tdClass: "p-1"},
                    {key: 'registration_no', label: 'Reg./Chassis No.', sortable: true, sortDirection: 'desc'},
                    // {key: 'chassis_no', label: 'Chassis No.', sortable: true, sortDirection: 'desc'},
                    {key: 'dates', label: 'Inspection Date', sortable: true, sortDirection: 'desc'},
                    {
                        key: 'passed_yn',
                        label: 'Result',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return (value == 'Y') ? 'PASS' : 'FAIL';
                        },
                        tdClass: "p-1"
                    },
                    {key: 'action', label: 'Actions', class: 'text-right'}
                    // {key: 'expiry_date', label: 'Expire Date', sortable: true, sortDirection: 'desc'},
                    // {key: 'last_expiry_date', label: 'Last Expire Date', sortable: true, sortDirection: 'desc'},
                    // {key: 'actions', label: 'Actions', class: 'text-right'}
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: process.env.MIX_TABLE_ROW_PER_PAGE,
                sortBy: '',
                sortDesc: true,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
                print_url: '#',
                modalTitle: '',
                modalData: [],
                search_data: null,
                registration_no: null,
                chassis_no: null,
                registration_id:null,
                cancelReason: null,
                lane_queue_id: null,
                warningText: "",
                lotNotFoundError: false,
              isPdfLoading:false,
              isShowLoading:false,
              last_serial_no:null,


            }
        },
        mounted() {
            this.getTableData();
        },
        computed: {
            itemsWithSno() {
                return this.items.map((d, index) => ({...d, sl: index + 1}))
            }
        },
        watch: {
            resSearchData(newData, oldData) {

                if (newData) {
                    this.items = newData;
                }
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                cancelReason : {required},
                last_serial_no : {required},
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
                    'search': this.filter
                };
                this.axios
                    .get(process.env.MIX_API_URL + '/certificate', {params: params})
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
            async generate(row, index, event) {
                this.isBusy = true;
                var lane_queue_id = row.lane_queue_id

                if(!this.lotNotFoundError){
                    Swal.fire({
                        title: 'ARE YOU SURE !',
                        // text: "YOU WON'T BE ABLE TO REVERT THIS QUEUE!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        showLoaderOnConfirm: true,
                        confirmButtonText: 'Yes, Generate It!'
                    }).then((result) => {
                        if (result.isConfirmed) {

                            this.axios
                                .get(process.env.MIX_API_URL + '/certificate/generate/' + lane_queue_id, {})
                                .then(response => {

                                    var res = response.data;

                                    if (res.status) {
                                        this.searchdata();
                                        this.generatePrint(row);
                                        // Swal.fire({
                                        //     title: response.data.message,
                                        //     icon: 'success',
                                        //     // text: "DO YOU WANT TO PRINT IT",
                                        //     html: "DO YOU WANT TO PRINT IT <br>"+this.warningText,
                                        //     showCancelButton: true,
                                        //     confirmButtonColor: '#3085d6',
                                        //     cancelButtonColor: '#d33',
                                        //     showLoaderOnConfirm: true,
                                        //     confirmButtonText: 'Yes, Print It!'
                                        // }).then((result) => {
                                        //     if (result.isConfirmed) {
                                        //         this.axios
                                        //             .get(process.env.MIX_API_URL + '/certificate/print/' + lane_queue_id, {})
                                        //
                                        //             .then(response => {
                                        //                 var res = response.data;
                                        //                 if (res.status) {
                                        //                     this.print_url = process.env.MIX_API_URL + '/print/certificate/' + lane_queue_id;
                                        //                     // window.open(this.print_url, '_blank');
                                        //
                                        //                     this.axios.get(this.print_url,{responseType: 'blob'})
                                        //                         .then((response) => {
                                        //                             window.open(window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'})));
                                        //                             this.getTableData();
                                        //                         }).catch(error => {
                                        //                         this.$toastr.error('Something went wrong. Please try again later!');
                                        //
                                        //                     });
                                        //                 }
                                        //             })
                                        //
                                        //     }
                                        // }).catch(error => {
                                        //     this.$toastr.error(error.response.data.message);
                                        //     this.isBusy = false;
                                        // })

                                    }

                                    this.isBusy = false;
                                })
                                .catch(error => {
                                    this.$toastr.error(error.response.data.message);
                                    this.isBusy = false;
                                })
                        }
                    })
                        .catch(error => {

                            this.$toastr.error(error.response.data.message);
                            this.isBusy = false;
                        })
                        .finally(() => {
                            this.isBusy = false;

                        });
                }

            },
            async generatePrint(row, index, event) {

                this.isBusy = true;
                await this.availableFCLot(row)
                var lane_queue_id = row.lane_queue_id
                Swal.fire({
                    title: 'ARE YOU SURE !',
                    html: this.warningText,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    showLoaderOnConfirm: true,
                    confirmButtonText: 'Yes, Print It!'
                }).then((result) => {
                    if (result.isConfirmed) {
                      this.isPdfLoading = true;
                        this.axios
                            .get(process.env.MIX_API_URL + '/certificate/print/' + lane_queue_id, {})

                            .then(response => {
                                var res = response.data;

                                if (res.status) {
                                    this.print_url = process.env.MIX_API_URL + '/print/certificate/' + lane_queue_id;
                                    // window.open(this.print_url, '_blank');

                                    this.axios.get(this.print_url,{responseType: 'blob'})
                                        .then((response) => {
                                            window.open(window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'})));
                                            this.getTableData();

                                        }).catch(error => {
                                        this.$toastr.error(error.response.data.message);
                                    });
                                }
                            }).catch(error => {
                            this.$toastr.error(error.response.data.message);
                            this.isBusy = false;
                        })
                            .finally(() => {
                              this.isPdfLoading = false;
                            });
                    }
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


            printque(print_url) {
                this.print_url = process.env.MIX_API_URL + '/print/certificate/' + print_url.lane_queue_id;

                this.axios.get(this.print_url,{responseType: 'blob'})
                    .then((response) => {
                        window.open(window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'})));
                    }).catch(error => {
                    this.$toastr.error(error.response.data.message);
                });
            },
            printresult(print_url) {

              this.isShowLoading=true;
                this.print_url = process.env.MIX_API_URL + '/print/result?lane_que_id=' + print_url.lane_queue_id
                this.axios.get(this.print_url,{responseType: 'blob'})
                    .then((response) => {
                        window.open(window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'})));
                    }).catch(error => {
                    this.$toastr.error(error.response.data.message);
                })
                    .finally(() => {
                      this.isShowLoading = false;
                    });
            },
            sendToPage(data) {
                this.$emit('sendToPage', data)

            },
            searchdata() {
                const params = {
                    queue_no: this.items[0]['lane_queue_id'],
                }

                this.axios.get(process.env.MIX_API_URL + '/certificate/view/certificate', {params: params})
                    .then(response => {
                        this.items = response.data.data

                    })
                    .catch(error => {
                        // this.$toastr.error(error.response.data.message);


                    })
                    .finally(() => {
                        this.isBusy = false;

                    });

            },
            async certificatePageCancel(row, index, event) {

                await this.searchForm();
                this.lane_queue_id = row.lane_queue_id;
                this.registration_no = row.registration_no;
                this.chassis_no=row.chassis_no;
                this.registration_id=row.registration_id;
                this.$bvModal.show('requestModal');
            },
             async searchForm() {
                this.isBusy = true;
                await this.axios.get(process.env.MIX_API_URL + '/pad/details', {})
                    .then(response => {
                        if(response.status){
                            this.search_data = response.data.data;
                            this.last_serial_no = this.search_data.last_serial_no;
                            this.isBusy = false;
                        }
                    })
                    .catch(error => {
                        this.$toastr.error('No Data Found');
                        this.isBusy = false;
                    })
                    .finally(() => {
                        this.isBusy = false;
                    });
            },
            resetModalField() {
                this.search_data = null;
                this.lane_queue_id = null;
                this.registration_no = null;
                this.cancelReason = null;
                this.v$.$reset();
            },
           async certificatePageCancelSubmit(){
                if(await this.v$.$validate()){
                    this.isBusy = true;
                    const params = {
                        lane_queue_id: this.lane_queue_id,
                        registration_no: this.registration_no,
                        chassis_no : this.chassis_no,
                        cancel_reason: this.cancelReason,
                        registration_id:this.registration_id,
                        serial_no:this.last_serial_no,
                    };
                    this.isLoading = true;
                    await this.axios.post(process.env.MIX_API_URL + '/pad/cancel-request' , params,{ headers: {
                            'Content-Type': 'application/json'
                        }})
                        .then(response => {
                            this.$toastr.success(response.data.message);
                            this.isBusy = false;
                            this.$bvModal.hide('requestModal');

                        })
                        .catch(error => {
                            this.$toastr.error(error.response.data.message);
                            this.isBusy = false;
                        })
                        .finally(() => {
                            this.isBusy = false;
                        });
                }
            },
           async availableFCLot(data){
                let lane_queue_id = data.lane_queue_id;
                await this.axios
                    .get(process.env.MIX_API_URL + '/inventory/current-lot-info', {
                        params : {"lane_queue_id":lane_queue_id}
                    })

                    .then(response => {
                        if(response.status){
                            if(response.data.available_pages>10){
                                this.warningText = "<span class='text-success font-weight-bold'>Current Lot No: "+response.data.current_lot_number+". Available Certificate Page: "+response.data.available_pages+"</span>";
                            }else if(response.data.available_pages <=10){
                                this.warningText = "<span class='text-danger font-weight-bold'>Current Lot No: "+response.data.current_lot_number+". Only "+response.data.available_pages+" Certificate Page Left</span>";
                            }

                        }

                    }).catch(error => {
                        this.lotNotFoundError = true;
                    this.$toastr.error(error.response.data.message);
                    this.isBusy = false;
                })
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
        },


    }
</script>
