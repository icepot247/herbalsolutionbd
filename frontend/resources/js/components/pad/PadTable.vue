<template>
    <div>
        <div class="card">
            <div class="card-body">
                <b-row>
                    <b-col lg="1" md="2" class="my-2 col-4 p-1">
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
                    <b-col lg="2" md="2" class="my-2 col-4 p-1">
                        <b-form-group
                                class="mb-0"
                        >
                            <b-form-select
                                    id="per-page-select"
                                    v-model="status_filter"
                                    @change="handleStatusChange"
                                    size="sm"
                                    class="col-md-12"
                            >
                                <option v-for="(val,key) in status_list" :key="key" :value="val.value"
                                        :disabled="val.disabled">
                                    {{ val.text }}
                                </option>
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col lg="6" md="5" class="my-2 col-4"></b-col>
                    <b-col lg="3" md="3" class="my-2 col-4 p-1">
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
                    <template class="text-center " #cell(action)="row">
                        <button v-b-tooltip.hover title="Cancel Request" type="button" class="btn btn-info btn-sm mb-1"
                                @click="requestApprovalModal(row.item)"><i
                            class="fas fa-paper-plane fa-xs"></i>
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
                <b-modal title="Request for cancel" id="requestModal" size="xl" @hide="resetModalField">
                    <div v-if="Object.keys(modalData).length>0" class="row">
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-3 card-title">Serial No</div>
                                <div class="col-md-1 d-none d-sm-block">:</div>
                                <div class="col-md-3 card-text">
                                    {{modalData.serial_no}}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-3 card-title">Registration No</div>
                                <div class="col-md-1 d-none d-sm-block">:</div>
                                <div class="col-md-8 card-text">
                                    {{modalData.registration_no}}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12">
                            <div class="row">
                                <div class=" col-md-3 card-title">Lot No</div>
                                <div class="col-md-1 col-sm-1 d-none d-sm-block">:</div>
                                <div class="col-md-8 col-sm-12 card-text">{{modalData.lot.fc_lot_no}}</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-3 card-title">Serial Start No</div>
                                <div class="col-md-1 d-none d-sm-block">:</div>
                                <div class="col-md-8 card-text">{{modalData.lot.fc_serial_start_no}}</div>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12">
                            <div class="row">
                                <div class=" col-md-3 card-title">Serial End No</div>
                                <div class="col-md-1 col-sm-1 d-none d-sm-block">:</div>
                                <div class="col-md-8 col-sm-12 card-text">{{modalData.lot.fc_serial_end_no}}</div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-3 card-title">Number of FC</div>
                                <div class="col-md-1 d-none d-sm-block">:</div>
                                <div class="col-md-8 card-text">{{modalData.lot.no_of_fc }}</div>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12">
                            <div class="row">
                                <div class=" col-md-3 card-title">Last Box No</div>
                                <div class="col-md-1 col-sm-1 d-none d-sm-block">:</div>
                                <div class="col-md-8 col-sm-12 card-text">{{modalData.lot.lot_box_no}}</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-3 card-title">Branch Name</div>
                                <div class="col-md-1 d-none d-sm-block">:</div>
                                <div class="col-md-8 card-text">{{modalData.branch.branch_name}}</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-3 card-title">Lot Finished</div>
                                <div class="col-md-1 d-none d-sm-block">:</div>
                                <div class="col-md-8 card-text">{{(modalData.lot.lot_finish_yn == 'Y') ? 'Yes' : 'No'}}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-3 card-title">Lot Received Date</div>
                                <div class="col-md-1 d-none d-sm-block">:</div>
                                <div class="col-md-8 card-text">{{mixinFormatDate(modalData.lot.received_date)}}</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-3 card-title">Lot Finished Date</div>
                                <div class="col-md-1 d-none d-sm-block">:</div>
                                <div class="col-md-8 card-text">{{(modalData.lot.lot_finish_date) ?
                                    mixinFormatDate(modalData.lot.lot_finish_date) : ''}}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-3 card-title">Cancel Status</div>
                                <div class="col-md-1 d-none d-sm-block">:</div>
                                <div class="col-md-8 card-text">
                                    <span v-if="(modalData.cancel_status == 'APPROVED')" class=" text-success">{{pascalCase(modalData.cancel_status)}}</span>
                                    <span v-if="(modalData.cancel_status == 'PENDING')" class=" text-secondary">{{pascalCase(modalData.cancel_status)}}</span>
                                    <span v-if="(modalData.cancel_status == 'REJECTED')" class=" text-danger">{{pascalCase(modalData.cancel_status)}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-3 card-title">Requested By</div>
                                <div class="col-md-1 d-none d-sm-block">:</div>
                                <div class="col-md-8 card-text">{{(modalData.request_by_user)?modalData.request_by_user.name:''}}</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-3 card-title">Request Date</div>
                                <div class="col-md-1 d-none d-sm-block">:</div>
                                <div class="col-md-8 card-text">{{(modalData.request_date)?mixinFormatDate(modalData.request_date):''}}</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-3 card-title">Cancel By</div>
                                <div class="col-md-1 d-none d-sm-block">:</div>
                                <div class="col-md-8 card-text">{{(modalData.cancel_by_user)?modalData.cancel_by_user.name:''}}</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-3 card-title">Cancel Date</div>
                                <div class="col-md-1 d-none d-sm-block">:</div>
                                <div class="col-md-8 card-text">{{(modalData.cancel_date)?mixinFormatDate(modalData.cancel_date):''}}</div>
                            </div>
                        </div>



<!--                        <div class="col-md-6 ">-->
<!--                            <div class="row">-->
<!--                                <div class="col-md-3 card-title">Cancel Reason</div>-->
<!--                                <div class="col-md-1 d-none d-sm-block">:</div>-->
<!--                                <div class="col-md-8 card-text">-->
<!--                                    {{pascalCase(modalData.cancel_reason)}}-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </div>-->
                        <div class="col-12 mt-2">
                            <Loader :loading="isBusy" v-if="isBusy"/>
                            <!--                            <button v-if="!isLoading" class="btn btn-danger float-end" @click="confirmPopUp">Destroy</button>-->
                        </div>
                    </div>
                    <template #modal-footer="{ cancel }">
                        <b-button v-if="(modalData.change_permit_yn == 'Y')" @click="approveRequest(modalData,'APPROVED')" size="sm" variant="primary">
                            Approve
                        </b-button>
                        <b-button v-if="(modalData.change_permit_yn == 'Y')" @click="approveRequest(modalData,'REJECTED')" size="sm" variant="danger">
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
    import moment from "moment";
    import {dateTimeFormatterMixin} from "../../mixins/dateTimeFormatterMixin";
    import Loader from "../common/Loader";


    export default {
        name: "PadTable",
        components: {Loader},
        props: ['formUpdated'],
        mixins:[dateTimeFormatterMixin],
        data() {
            return {
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {
                        key: 'fc_lot_no',
                        label: 'Lot No.',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return value;
                        },
                        tdClass: "p-1"
                    },
                    {key: 'serial_no', label: 'Serial No', sortable: true, sortDirection: 'desc'},
                    {
                        key: 'branch',
                        label: 'Branch Name',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return value.branch_name;
                        },
                        tdClass: "p-1"
                    },

                    {
                        key: 'cancel_by_user',
                        label: 'Cancel By',
                        sortable: false,
                        formatter: (value, key, item) => {
                            if(value){
                                return value.name;
                            }else{
                                return '';
                            }
                        },
                        tdClass: "p-1"
                    },
                    {
                        key: 'request_by_user',
                        label: 'Request By',
                        sortable: false,
                        formatter: (value, key, item) => {
                            if(value){
                                return value.name;
                            }else{
                                return '';
                            }
                        },
                        tdClass: "p-1"
                    },
                    {
                        key: 'cancel_reason',
                        label: 'Cancel Reason',
                        sortable: false,
                        formatter: (value, key, item) => {
                            return value;
                        },
                        tdClass: "p-1"
                    },
                    {
                        key: 'cancel_status',
                        label: 'Status',
                        sortable: false,
                        formatter: (value, key, item) => {
                            return value;
                        },
                        tdClass: (value, key, item) => {
                            if(value == "APPROVED"){
                                return ' text-success'
                            }else if(value=="PENDING"){
                                return " text-secondary"

                            }else if(value == "REJECTED"){
                               return  ' text-danger';
                            }
                        },
                    },
                    {
                        key: 'action',
                        label: 'Action',
                        sortable: false,
                        sortDirection: 'desc',
                        tdClass: "p-1 text-center",
                        thClass:"text-center"
                    },

                ],
                totalRows: 1,
                currentPage: 1,
                perPage: process.env.MIX_TABLE_ROW_PER_PAGE,
                sortBy: '',
                sortDesc: true,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
                modalData: {},
                status_filter: '',
                status_list: [
                    {value: '', text: 'All', disabled: false},
                    {value: "PENDING", text: 'Pending', disabled: false},
                    {value: "APPROVED", text: 'Approved', disabled: false},
                    {value: "REJECTED", text: 'Rejected', disabled: false},
                ],
            }
        },
        mounted() {
            this.getTableData();
        },
        computed: {},
        watch:{
            formUpdated(newData, oldData){
                if(newData){
                    this.getTableData();
                }
            }
        },
        methods: {
            onFiltered(filteredItems) {
                if(this.prevFilter != this.filter){
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
                    'page':this.currentPage,
                    'sort_by':this.sortBy,
                    'sort_type':(this.sortDesc)?'desc':'asc',
                    'search':this.filter,
                    'cancelStatus':this.status_filter,
                };
                this.axios
                    .get(process.env.MIX_API_URL + '/pad', {params:params})
                    .then(response => {
                        var res = response.data;
                        if (res.status) {
                            this.items = res.data.data;
                            this.currentPage = res.data.current_page;
                            this.totalRows = res.data.total;
                            this.perPage = res.data.per_page;
                        }else{
                            this.items = []
                        }
                        this.isBusy = false;
                    })
                    .catch(error => {
                        // this.$toastr.error(error.response.data.message);
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
            sendToPage(data){
                this.$emit('sendToPage', data)
            },
            requestApprovalModal(data){
                this.modalData = data;
                this.$bvModal.show('requestModal');

            },
            async searchForm() {
                this.isBusy = true;
                await this.axios.get(process.env.MIX_API_URL + '/pad/details', {})
                    .then(response => {
                        if(response.status){
                            this.search_data = response.data.data;
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
                this.modalData = {};
                this.getTableData()
            },
            approveRequest(data,status){
                const params = {
                    cancel_id:data.cancel_id,
                    cancel_status:status
                };
                this.isBusy = true;
                 this.axios.post(process.env.MIX_API_URL + '/pad/cancel-request/change' , params,{ headers: {
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
            },
            handleStatusChange(value) {
                this.status_filter = value;
                this.currentPage = 1;
                this.getTableData();
            },

            pascalCase(val){
                return val.toLowerCase().replace(/(\w)(\w*)/g,
                    function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});
            }
        }
    }
</script>

<style scoped>

</style>
