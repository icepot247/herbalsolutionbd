<template>
    <div>
        <div class="card">
            <div class="card-body">
                <h5 class="">{{tableHeading}}</h5>
                <!--        Filter        -->
               <!-- <b-row>
                    <b-col class="my-2 col-4 p-1" lg="3" md="4">
                        <b-form-group
                            class="mb-0"
                        >
                            <b-form-select
                                :options="pageOptions"
                                @change="handlePageSizeChange"
                                class="col-md-4"
                                id="per-page-select"
                                size="sm"
                                v-model="perPage"
                            ></b-form-select>
                        </b-form-group>
                    </b-col>

                    <b-col class="my-2 col-4" lg="6" md="4"></b-col>
                    <b-col class="my-2 col-4 p-1" lg="3" md="4">
                        <b-form-group
                            class="mb-0"
                        >
                            <b-input-group size="sm">
                                <b-form-input
                                    id="filter-input"
                                    placeholder="Type to Search"
                                    type="search"
                                    v-model="filter"
                                ></b-form-input>
                            </b-input-group>
                        </b-form-group>
                    </b-col>
                </b-row>-->



                <!-- Main table element -->
                <b-table :busy="isBusy"
                         :fields="fields"
                         :filter="filter"
                         :filter-included-fields="filterOn"
                         :items="items"
                         :sort-by.sync="sortBy"
                         :sort-desc.sync="sortDesc"
                         :sort-direction="sortDirection"
                         @filtered="onFiltered"
                         @sort-changed="onSorted"
                         class="mt-2"
                         ref="table"
                         responsive
                         show-empty
                         sort-icon-left
                >
                    <template #table-busy>
                        <div class="text-center text-danger my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>Loading...</strong>
                        </div>
                    </template>
                    <template #cell(index)="data">
                        {{data.index+1}}
                    </template>

                    <template #cell(actions)="row" class="align-right">
                        <button  v-if="!(isLoading && (index==encodeURIComponent(row.item.encAppointmentId)))" @click="sendToPage(encodeURIComponent(row.item.encAppointmentId))" class="btn btn-primary btn-sm m-1 p-1" title="Download Appointment"
                                type="button" v-b-tooltip.hover><i
                            class="fas fa-download icon-size"></i>
                        </button>
                        <button v-if="isLoading && (index==encodeURIComponent(row.item.encAppointmentId)) " class="btn btn-sm btn-outline-primary float-end" type="button">
                            <div class="spinner-border"
                                 style="height: 1rem !important; width: 1rem !important;">
                                <span class="visually-hidden">Processing...</span>
                            </div>
                        </button>
                    </template>

                </b-table>


                <!--    Pagination            -->
                <b-row>
                    <b-col class="mt-2" md="12" sm="12">
                        <b-pagination
                            :per-page="perPage"
                            :total-rows="totalRows"
                            @change="handlePageChange"
                            align="center"
                            class="my-0"
                            v-model="currentPage"
                        ></b-pagination>
                    </b-col>
                </b-row>

            </div>
            <!-- end card body -->
        </div>

    </div>
</template>

<script>

    import Loader from "../common/Loader";
    import LocalStore from "../../plugins/LocalStore";

    export default {
        name: 'InventoryTable',
        props: ['formUpdated'],
        components: {Loader},
        data() {
            return {
                tableHeading:'Appointments for Today',
                center_id: null,
                isLoading: false,
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    // {key: 'index', label: 'SL', sortable: false},
                    {key: 'slNo', label: 'SL', sortable: false, sortDirection: 'asc'},
                    // {key: 'center_info.center_name', label: 'Center Name', sortable: false, sortDirection: 'desc'},
                    {key: 'appointmentId', label: 'Appointment Number', sortable: false},
                    {key: 'registrationNo', label: 'Reg./Chassis Number', sortable: false, sortDirection: 'desc'},
                    {key: 'mobileNo', label: 'Mobile Number', sortable: false, sortDirection: 'desc'},
                    {key: 'branchName', label: 'Branch Name', sortable: false, sortDirection: 'desc'},
                    // {key: 'appointmentDate', label: 'Date', sortable: false, sortDirection: 'desc'},
                    {key: 'slotName', label: 'Time Slot', sortable: false, sortDirection: 'desc'},
                    // {key: 'serialNo', label: 'BSP SL No.', sortable: false},
                    {key: 'actions', label: 'Actions', class: 'text-right'}
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: process.env.MIX_TABLE_ROW_PER_PAGE,
                // perPage: 1,
                sortBy: '',
                sortDesc: true,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
                userInfo : null,
                index : null,
            }
        },
        computed: {},
        mounted() {
            this.userInfo = LocalStore.getStorage('user').data;

            if(this.userInfo.center_id)
            {
                this.center_id = this.userInfo.center_id;
            }else{
                this.center_id = 0;
            }
            this.getTableData();
        },
        watch: {
            formUpdated(newData, oldData) {
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
            getTableData() {
                this.isBusy = true;

                const params = {
                    'per_page': this.perPage,
                    'page': this.currentPage,
                    'sort_by': this.sortBy,
                    'sort_type': (this.sortDesc) ? 'desc' : 'asc',
                    'search': this.filter
                };
                this.axios
                    .get(process.env.MIX_API_URL + '/appointment/appointment-list/'+this.center_id,{params: params})
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
                        //this.$toastr.error(error.response.data.message);
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
            sendToPage(encId) {
                 // window. open(process.env.MIX_BASE_URL+'/api/v1/print/bsp-appointment-print/?encAppointmentId='+encId, '_blank', '')

                this.index = encId;
                this.isLoading = true;
                let url = process.env.MIX_API_URL+'/print/bsp-appointment-print/?encAppointmentId='+encId;
                // let url = process.env.MIX_BASE_URL +"/api/v1/print/que?appointment_id=23020810500210864&lane_queue_id=230208180028";
                this.axios.get(url,{responseType: 'blob'})
                    .then((response) => {
                        // console.log(response)
                        window.open(window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'})));
                        this.isLoading = false;
                        this.index = null;

                    }).catch(error => {
                    this.$toastr.error('Something went wrong. Please try again later!');
                    this.isLoading = false;
                    this.index = null;


                });

            }

        }
    }
</script>
<style>
    .icon-size {
        width: 25px;
        height: 20px;
    }
</style>
