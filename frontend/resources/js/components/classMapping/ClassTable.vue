<template>
    <div>
        <div class="card">
            <div class="card-body">
                <h5 class="">Class List</h5>
                <!--        Filter        -->
                <b-row>
                    <b-col lg="1" md="2" class="my-2 col-4">
                        <b-form-group
                                class="mb-0"
                        >
                            <b-form-select
                                    :options="pageOptions"
                                    @change="handlePageSizeChange"
                                    class="col-md-12"
                                    id="per-page-select"
                                    size="sm"
                                    v-model="perPage"
                            ></b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col lg="4" md="4" class="my-2 col-4">
                        <b-form-group v-if="center_list.length>0 && (userTypeId==1)" class="mb-0"
                        >
                            <b-form-select
                                    id="per-page-select"
                                    v-model="center_id"
                                    @change="handleCenterChange"
                                    size="sm"
                                    class="col-md-12"
                            >
                                <option v-for="(val,key) in center_list" :key="key" :value="val.value"
                                        :disabled="val.disabled">
                                    {{ val.text }}
                                </option>
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col lg="4" md="3" class="my-2 col-4"></b-col>
                    <b-col lg="3" md="3" class="my-2 col-4">
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
                </b-row>

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
                        {{(currentPage-1)*perPage+data.index+1}}
                    </template>

                    <template #cell(actions)="row" class="align-right">


                        <b-button @click="showitemClassModal(row.item, row.index, $event.target)"
                                  class="m-1 btn-success p-1"
                                  size="sm" title="Main Class Mapping" v-b-tooltip.hover>
                            <i class="fas fa-eye icon-size"></i></b-button>

                        <b-button @click="modifyConfirm(row.item)"
                                  class="m-1 btn-info p-1"
                                  size="sm" title="Modified Class Mapping " v-b-tooltip.hover>
                            <i class="fas fa-network-wired icon-size"></i></b-button>

                    </template>

                </b-table>

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


                <b-modal :title="modalTitle" scrollable id="itemClassModal" size="xl" no-close-on-backdrop
                         @hide="resetInfoModal">
                    <template #modal-header="{ close }">
                        <h5  class="modal-title"> <div v-html="modalTitle"></div> <div v-if="(centerName !=='' && centerName !==null)" class=""> <span class="font-weight-bold">Center: </span>{{centerName}}</div></h5>
                        <button type="button" @click="close()" aria-label="Close" class="close">×</button>
                    </template>
                    <div class="row">
                        <div style="background-color: cyan" class="col-md-12 font-weight-normal p-1  pb-0 card-bg-success">
                            <ul class="mb-0">
                                <li> BOLD TEXT ARE ACTIVE ITEM</li>
<!--                                <li> ADDED / MODIFIED ITEM SHOWN IN RED BORDER</li>-->
                            </ul>
                        </div>
                    </div>
                    <table class="table ">
                        <thead>
                        <tr>
                            <th class="col-md-4"> Item Test Type</th>
                            <th class="col-md-2"> Sub Test Type</th>
                            <th class="col-md-1"><span title="Required (Must Answer Item)">Required</span></th>
                            <th class="col-md-1"><span title="Criteria (Item Should Passed For Result)">Criteria</span></th>
                            <th class="col-md-1"> <span title="Status (Item will be shown)">Status (View)</span></th>
                        </tr>
                        </thead>
                        <tbody>
                        <Loader v-show="isLoading" :loading="isLoading" class="mt-4"></Loader>
                        <tr :key="index" v-for="(item, index) in itemtypeList"
                            style="background-color: #e6e6e6 !important;">

                            <td class="p-1 align-middle">
                                <span class="fs-6"  :class="(item.sub_test_type_item_active_yn=='Y')?'font-weight-bold':'text-muted'">{{item.text}}</span>
                            </td>

                            <td class="p-1 align-middle" >
                                <span class="fs-6"   :class="(item.sub_test_type_active_yn=='Y')?'font-weight-bold':'text-muted'" >{{item.sub_test_type_name}}</span>
                            </td>
                            <td  class="p-1 align-middle">
                                <input :disabled="true" type="checkbox" :id='`switch_required_`+index' switch="info"
                                       :checked="(itemtypeList[index].required_yn=='Y')?true:false">
                                <label class="mb-0 align-middle" style="cursor:not-allowed" :for='`switch_required_`+index' data-on-label="Yes"
                                       data-off-label="No"></label>
                            </td>
                            <td  class="p-1 align-middle">
                                <input :disabled="true" type="checkbox" :id='`switch_criteria_`+index' switch="info"
                                       :checked="(itemtypeList[index].passing_criteria_yn=='Y')?true:false">
                                <label class="mb-0 align-middle" style="cursor:not-allowed" :for='`switch_criteria_`+index' data-on-label="Yes"
                                       data-off-label="No"></label>
                            </td>
                            <td class="p-1 align-middle">
                                <input :disabled="true" type="checkbox" :id='`switch_active_yn_`+index' switch="info"
                                       :checked="(itemtypeList[index].active_yn=='Y')?true:false">
                                <label class="mb-0 align-middle" style="cursor:not-allowed" :for='`switch_active_yn_`+index' data-on-label="Yes"
                                       data-off-label="No"></label>
                            </td>
                        </tr>

                        </tbody>
                    </table>


                    <template #modal-footer="{ cancel }">
                        <b-button @click="cancel()" size="sm" variant="danger">
                            Close
                        </b-button>
                    </template>
                </b-modal>
                <b-modal scrollable id="itemClassModalReplica" size="xl" no-close-on-backdrop
                         @hide="resetInfoModal">
                    <template #modal-header="{ close }">
                        <h5  class="modal-title"> <div v-html="modalTitle"></div> <div v-if="(centerName !=='' && centerName !==null)" class=""> <span class="font-weight-bold">Center: </span>{{centerName}}</div></h5>
                        <button type="button" @click="close()" aria-label="Close" class="close">×</button>
                    </template>

                    <div class="row">
                        <div style="background-color: cyan" class="col-md-12 font-weight-normal p-1  pb-0 card-bg-success">
                            <ul class="mb-0">
                                <li> BOLD TEXT ARE ACTIVE ITEM</li>
                                <li> ADDED / MODIFIED ITEM SHOWN IN RED BORDER</li>
                            </ul>
                        </div>
                    </div>

                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th class="col-md-4"> Item Test Type</th>
                            <th class="col-md-2"> Sub Test Type</th>
                            <th class="col-md-1"><span title="Required (Must Answer Item)">Required</span></th>
                            <th class="col-md-1"><span title="Criteria (Item Should Passed For Result)">Criteria</span></th>
                            <th class="col-md-1"> <span title="Status (Item will be shown)">Status (View)</span></th>
                        </tr>
                        </thead>
                        <tbody>
                        <Loader v-show="isLoading" :loading="isLoading" class="mt-4"></Loader>
                        <tr :key="index" v-for="(item, index) in itemtypeListReplica">
                            <td class="p-1 align-middle">
                                <span class="fs-6"  :class="(item.sub_test_type_item_active_yn=='Y')?'font-weight-bold':'text-muted'">{{item.text}}</span>
                            </td>

                            <td class="p-1 align-middle" >
                                <span class="fs-6"  :class="(item.sub_test_type_active_yn=='Y')?'font-weight-bold':'text-muted'" >{{item.sub_test_type_name}}</span>
                            </td>

                            <td  class="p-1 align-middle">
                                <input v-if="modalData.pending_request=='N'" type="checkbox" :id='`switch_required_`+index' switch="info"
                                       :checked="(itemtypeListReplica[index].required_yn=='Y')?true:false"
                                       @change="submitForm(($event.target.checked)?'Y':'N', itemtypeListReplica[index].passing_criteria_yn, itemtypeListReplica[index].active_yn,itemtypeListReplica[index])">
                                <input v-if="modalData.pending_request=='Y'" :disabled="true" type="checkbox" :id='`switch_required_`+index' switch="info"
                                       :checked="(itemtypeListReplica[index].required_yn=='Y')?true:false"
                                       >
                                <label  :style="((item.required_yn !== itemtypeList[index].required_yn)?'border:3px solid red;padding:12px!important;'+((modalData.pending_request=='Y')?'cursor:not-allowed':''):((modalData.pending_request=='Y')?'cursor:not-allowed;':''))" class="mb-0 align-middle" :for='`switch_required_`+index' data-on-label="Yes" data-off-label="No"></label>
                            </td>
                            <td  class="p-1 align-middle">
                                <input v-if="modalData.pending_request=='N'" type="checkbox" :id='`switch_criteria_`+index' switch="info"
                                       :checked="(itemtypeListReplica[index].passing_criteria_yn=='Y')?true:false"
                                       @change="submitForm(itemtypeListReplica[index].required_yn, ($event.target.checked)?'Y':'N', itemtypeListReplica[index].active_yn,itemtypeListReplica[index])">
                                <input  v-if="modalData.pending_request=='Y'" :disabled="true" type="checkbox" :id='`switch_criteria_`+index' switch="info"
                                       :checked="(itemtypeListReplica[index].passing_criteria_yn=='Y')?true:false"
                                      >
                                <label :style="(((item.passing_criteria_yn !== itemtypeList[index].passing_criteria_yn)?'border:3px solid red;padding:12px!important;'+((modalData.pending_request=='Y')?'cursor:not-allowed':''):((modalData.pending_request=='Y')?'cursor:not-allowed':'')))" class="mb-0 align-middle" :for='`switch_criteria_`+index' data-on-label="Yes" data-off-label="No"></label>
                            </td>
                            <td  class="p-1 align-middle">
                                <input v-if="modalData.pending_request=='N'" type="checkbox" :id='`switch_active_yn_`+index' switch="info"
                                       :checked="(itemtypeListReplica[index].active_yn=='Y')?true:false"
                                       @change="submitForm(itemtypeListReplica[index].required_yn, itemtypeListReplica[index].passing_criteria_yn, ($event.target.checked)?'Y':'N',itemtypeListReplica[index],($event.target.checked)?'Y':'N')">
                                <input v-if="modalData.pending_request=='Y'" :disabled="true" type="checkbox" :id='`switch_active_yn_`+index' switch="info"
                                       :checked="(itemtypeListReplica[index].active_yn=='Y')?true:false"
                                       >
                                <label :style="(((item.active_yn !== itemtypeList[index].active_yn)?'border:3px solid red;padding:12px!important;'+((modalData.pending_request=='Y')?'cursor:not-allowed':''):((modalData.pending_request=='Y')?'cursor:not-allowed':'')))" class="mb-0 align-middle" :for='`switch_active_yn_`+index' data-on-label="Yes" data-off-label="No"></label>
                            </td>
                        </tr>

                        </tbody>
                    </table>


                    <template #modal-footer="{ cancel }">

                        <div class="col-md-12 pr-2">
                            <div class="row">
                                <div class="col-md-2 ">
                                    <label class="justify-content-start">Comments:<span class="text-danger">*</span>
                                    </label>
                                </div>
                                <div class="col-md-12 p-2">
                                    <textarea :readonly="modalData.pending_request =='Y'" placeholder="Write your comment"
                                              :class="[(v$.comments.$error)?'is-invalid':'']" v-model="comments"
                                              required class="form-control" name="comments" id="" cols="1" rows="1"></textarea>
                                </div>
                            </div>
                        </div>
                        <ul v-if="v$.comments.$error" class="parsley-errors-list filled">
                            <li class="parsley-required">The field is required.</li>
                        </ul>
                        <b-button v-if="modalData.pending_request=='N' && !submitLoader" @click="saveClassInfo(modalData)" size="sm" variant="primary">
                            Submit
                        </b-button>
                        <button v-if="submitLoader" class="btn btn-outline-primary" type="button">
                            <div class="spinner-border" style="height: 1rem !important; width: 1rem !important;">
                                <span class="visually-hidden">Processing...</span>
                            </div>
                        </button>
                        <b-button @click="cancel()" size="sm" variant="danger">
                            Close
                        </b-button>
                    </template>
                </b-modal>

            </div>
            <!-- end card body -->
        </div>

    </div>
</template>

<script>

    import Loader from "../common/Loader";
    import useVuelidate from "@vuelidate/core";
    import {helpers, minValue, required} from "@vuelidate/validators";

    export default {
        name: 'ClassTable',
        props: ['formUpdated'],
        components: {Loader},
        data() {
            return {
                isLoading: false,
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                optionList: [
                    {value: null, text: 'Select an Option'},
                    {value: 'Y', text: 'Yes'},
                    {value: 'N', text: 'No'},
                ],
                statusList: [
                    {value: null, text: 'Select an Option'},
                    {value: 'Y', text: 'Active'},
                    {value: 'N', text: 'Inactive'},
                ],
                items: [],
                modalitems: [],
                item_item_type: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false,tdClass: "p-1"},
                    {
                        key: 'vehicle_class_name',
                        label: 'Vehicle Class',
                        sortable: true,
                        sortDirection: 'desc',
                        tdClass: "p-1"
                    },
                    {
                        key: 'active_yn',
                        label: 'Status',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return (value == 'Y') ? 'Active' : 'Inactive';
                        },
                        tdClass: (value, key, item) => {
                            return (value == 'Y') ? ' text-success p-1' : ' text-danger p-1';
                        },
                    },

                    {key: 'actions', label: 'Actions', class: 'text-right', tdClass: "p-1"}
                ],
                modalfields: [
                    {key: "item_item_type", label: "Test Item Name", tdClass: "p-1"},
                    // {key: "item_type_status", label: "Test Type Name", tdClass: "p-1"},
                    {key: "required_yn", label: "Required ", tdClass: "p-1"},
                    {key: "passing_criteria_yn", label: "Criteria", tdClass: "p-1"},
                    {key: "status", label: "status", tdClass: "p-1"},
                    // {key: "actions", label: "Action", tdClass: "p-1"},

                ],

                totalRows: 1,
                currentPage: 1,
                perPage: process.env.MIX_TABLE_ROW_PER_PAGE,
                sortBy: '',
                sortDesc: true,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
                modalTitle: '',
                modalData: [],
                modalFor: '',
                itemTypeData: [],
                coverageList: [],
                itemtypeList: [],
                item_type_status: [],
                typeList: [],
                required_yn: 'N',
                passing_criteria_yn: 'N',
                status: 'N',
                vehicle_class_id: '',
                hasCoverageBranch: true,
                itemtypeListReplica: [],
                comments: '',
                sub_test_type_id: null,
                center_id: -1,
                center_list: [],
                userTypeId: this.$store.getters.getUser.data.user_type_id,
                submitLoader: false,
                centerName: null,
            }
        },
        computed: {},
        mounted() {
            this.getTableData();
            this.getCenter();
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                comments: {required},
            }
        },
        watch: {
            formUpdated(newData, oldData) {
                if (newData) {
                    this.getTableData();
                }
            }
        },

        methods: {
            addMore(index) {
                this.modalitems.push({})
            },
            remove(item) {
                if (this.modalitems.length === 1) {
                    this.$toastr.error("Sorry! You can't delete the last one");
                } else {
                    this.modalitems.splice(item.index, 1);
                }
            },
            resetInfoModal() {
                this.modalitems = []
                this.comments = null;
                this.v$.$reset()
                this.getTableData();

            },

            showitemClassModal(item, index, button) {
                this.modalTitle = ((item) ? '<b>Vehicle Class: </b>' + item.vehicle_class_name + " (Current Settings)"+
                    ((item.last_updated_date !==null&&item.last_updated_date !=='')?" Last Updated: "+item.last_updated_date:'') : '');

                this.centerName = item.center_name;
                this.modalData = item;
                this.getvehicleClass(item);
                this.$bvModal.show('itemClassModal')
            },

            getvehicleClass(data) {
                this.isLoading = true;
                const params = {
                    center_id:data.center_id
                }
                this.axios
                    .get(process.env.MIX_API_URL + '/class/' + data.vehicle_class_id, {params:params})
                    .then(res => {
                        this.isLoading = false;
                        this.itemtypeList = (res.status) ? res.data.data : [];
                    })
                    .catch(error => {
                        this.isLoading = false;
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            },

            submitForm(required_yn, criteria_yn, active_yn, params, statusCheck = null) {
                // params.required_yn =  (event.target.checked)?'Y':'N';
                params.required_yn = required_yn;
                params.passing_criteria_yn = criteria_yn;
                params.active_yn = active_yn;
                params.center_id = this.modalData.center_id;
                if (statusCheck == null && active_yn !== "Y") {
                    this.$toastr.error("PLEASE ACTIVE STATUS BEFORE CHANGE ");
                    this.getVehicleClassFromReplica(this.modalData);
                    return;
                }
                if (((required_yn === "Y") || (criteria_yn === "Y")) && (active_yn === "N")) {
                    this.$toastr.error("PLEASE INACTIVE REQUIRED AND CRITERIA BEFORE STATUS INACTIVE ");
                    this.getVehicleClassFromReplica(this.modalData);
                    return;

                }
                this.axios.post(process.env.MIX_API_URL + '/class/' + this.modalData.vehicle_class_id, params, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(response => {

                        var data = response.data;
                        if (data.status) {
                            this.$toastr.success(data.message);
                            this.getVehicleClassFromReplica(this.modalData);
                            this.isLoading = false;


                        } else {

                            this.$toastr.error(data.message);
                            this.isLoading = false;

                        }
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                        this.getVehicleClassFromReplica(this.modalData);
                        this.isLoading = false;
                    })
                    .finally(() => {
                        this.isLoading = false;
                        this.resetForm();
                    });
            },

            onFiltered(filteredItems) {
                // this.totalRows = filteredItems.length
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
                    'search': this.filter,
                    'center_id':this.center_id
                };
                this.axios
                    .get(process.env.MIX_API_URL + '/class', {params: params})
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
            handlePageChange(pageNo) {
                this.currentPage = pageNo
                this.getTableData();
            },
            handlePageSizeChange(value) {
                this.perPage = value;
                this.currentPage = 1;
                this.getTableData();
            },
            resetForm() {
                // this.v$.$reset();
                this.required_yn = [];
            },

            itemTypeOption(test_item_id, optionName, optionValue) {
                return 'Y';

            },
            modifyConfirm(data) {
                this.isLoading = true;
                if (data.copy_yn == 'Y') {
                    this.showReplicaModal(data);

                } else {
                    Swal.fire({
                        title: 'ARE YOU SURE YOU WANT TO MODIFY IT!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.saveVehicleCopy(data)

                        }
                    }).catch(error => {
                        this.$toastr.error(error.response.data.message);
                        this.isLoading = false;
                    })
                        .finally(() => {
                            this.isLoading = false;

                        });
                }

            },
            saveVehicleCopy(data) {
                const params = {
                    "center_id":data.center_id
                }
                this.axios
                    .post(process.env.MIX_API_URL + "/class/copy/" + data.vehicle_class_id, params)
                    .then(response => {

                        if (response.data.status) {
                            this.showReplicaModal(data)
                        } else {
                            this.$toastr.error(response.data.message);
                            this.isLoading = false;
                        }
                    }).catch(error => {
                    this.$toastr.error(error.response.data.message);
                    this.isLoading = false;
                }).finally(() => {
                    this.isLoading = false;

                });
            },
            showReplicaModal(data) {
                this.modalTitle = ((data) ? '<b> Vehicle Class: </b>' + data.vehicle_class_name +  ((data.pending_request=='Y')?'<span class="text-success"> (Request Waiting For Approval)</span>': "<span class='text-warning'> (Request For Modification )</span>") : '');
                this.modalData = data;
                this.centerName = data.center_name;
                this.getVehicleClassFromReplica(data);
                this.getvehicleClass(data);
                this.comments = (this.modalData.pending_request =='Y')?this.modalData.comments: this.comments;
                this.$bvModal.show('itemClassModalReplica')
            },
            getVehicleClassFromReplica(data) {
                this.isLoading = true;
                const params = {
                    center_id:data.center_id
                }
                this.axios
                    .get(process.env.MIX_API_URL + '/wf-class/' + data.vehicle_class_id, {params:params})
                    .then(res => {
                        this.isLoading = false;
                        this.itemtypeListReplica = (res.status) ? res.data.data : [];

                    })
                    .catch(error => {
                        this.isLoading = false;
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            },
            async saveClassInfo(data) {
                if (await this.v$.$validate()) {
                    this.submitLoader = true;
                    const params = {
                        'reference_no': data.vehicle_class_id,
                        'summary': this.comments,
                        'center_id': data.center_id,
                    }
                    this.axios.post(process.env.MIX_API_URL + '/wf-class/submit', params, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => {
                            var data = response.data;
                            if (data.status) {
                                this.$toastr.success(data.message);
                                this.$bvModal.hide("itemClassModalReplica")
                                this.submitLoader = false;
                                this.resetInfoModal();

                            } else {
                                this.$toastr.error(data.message);
                                this.submitLoader = false;
                            }

                        })
                        .catch(error => {
                            this.$toastr.error(error.response.data.message);
                            this.submitLoader = false;
                        })
                        .finally(() => {
                            this.submitLoader = false;
                        });
                }


                // Swal.fire({
                //     title: 'Please give some details!',
                //     input: 'text',
                //     inputAttributes: {
                //         autocapitalize: 'off'
                //     },
                //     showCancelButton: false,
                //     confirmButtonText: 'Save',
                //     showLoaderOnConfirm: true,
                //     allowOutsideClick: () => !Swal.isLoading()
                // }).then((result) => {
                //     if (result.isConfirmed) {
                //         const params = {
                //             'reference_no' : data.vehicle_class_id,
                //             'summary' : result.value,
                //         }
                //         this.axios.post(process.env.MIX_API_URL + '/wf-class/submit', params,{ headers: {
                //                 'Content-Type': 'application/json'
                //             }})
                //             .then(response => {
                //                 var data = response.data;
                //                 if (data.status) {
                //                     this.$toastr.success(data.message);
                //                     this.isLoading = false;
                //
                //                 } else {
                //                     this.$toastr.error(data.message);
                //                     this.isLoading = false;
                //                 }
                //             })
                //             .catch(error => {
                //                 this.$toastr.error(error.response.data.message);
                //                 this.isLoading = false;
                //             })
                //             .finally(() => {
                //                 this.isLoading = false;
                //                 this.resetInfoModal();
                //                 this.$bvModal.hide("itemClassModalReplica")
                //             });
                //
                //     }
                // }).catch(error => {
                //     this.$toastr.error(error.response.data.message);
                //     this.isLoading = false;
                // }).finally(() => {
                //     this.isLoading = false;
                //
                // });

            },
            handleCenterChange(value) {
                this.center_id = value;
                this.currentPage = 1;
                this.getTableData();
            },
            getCenter() {
                // this.isLoading = true;
                this.axios
                    .get(process.env.MIX_API_URL + '/common/class-wise/center', {})
                    .then(res => {
                        this.center_list = (res.status) ? res.data.data : [];
                    })
                    .catch(error => { })
                    .finally(() => { });
            },



        }
    }
</script>
<style>
    .icon-size {
        width: 25px;
        height: 20px;
    }
</style>
