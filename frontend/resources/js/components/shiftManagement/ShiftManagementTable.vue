<template>
    <div>
        <div class="card">
            <div class="card-body">
                <h3 class="card-title">Shift Slots</h3>
                <b-row>
                    <b-col lg="3" md="4" class="my-2 col-4">
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
                    <b-col lg="3" md="4" class="my-2 col-4">
                        <b-form-group
                            class="mb-0"
                        >
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

                    <template class="align-right" #cell(actions)="row">
                        <button  v-if="$root.hasAccess('CloneModal', 'add') || $root.hasAccess('CloneModal', 'edit')"  v-b-tooltip.hover title="Clone" type="button" class="btn btn-info btn-sm mb-1"
                                @click="showModal(row.item)"><i
                            class="far fa-clone fa-xs"></i>
                        </button>
                        <button  v-if="$root.hasAccess('ShiftManagementPage', 'edit')"  v-b-tooltip.hover title="Edit" type="button" class="btn btn-primary btn-sm mb-1"
                                @click="sendToPage(row.item)"><i
                            class="fas fa-edit fa-xs"></i>
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
                <b-modal  :title="modalTitle" id="clone-modal" size="lg" @close="reset"  no-close-on-backdrop >
                    <loader :loading="isLoading" :class="(isLoading)?'mt-4':''"/>

                    <div class="row">
                        <div class="col-md-4 col-xm-12">
                            <div class="mb-3">
                                <label class="form-label">Date:</label>
                                <input v-model="date" name="date" type="date" class="form-control" readonly>
                            </div>
                        </div>
                        <div class="col-md-4 col-xm-12">
                            <div class="mb-3">
                                <label class="form-label">Shift:</label>
                                <input v-model="shift" name="shift" type="text" class="form-control" readonly>
                            </div>
                        </div>
                        <div class="col-md-4 col-xm-12">
                            <div class="mb-3">
                                <label class="form-label">Clone Date:</label>
                                <span class="text-danger">*</span>
                                <input v-model="cloneShift" name="cloneShift" :class="[(v$.cloneShift.$error)?'is-invalid':'']"
                                       type="date" :min="date" class="form-control" >
                                <ul v-if="v$.cloneShift.$error" class="parsley-errors-list filled">
                                    <li class="parsley-required">The field is required.</li>
                                </ul>
                            </div>
                        </div>
                    </div>


                    <template #modal-footer="{ cancel }">
                        <b-button @click="saveCloneShift" size="sm" variant="primary">
                            Clone Shift
                        </b-button>
                        <b-button @click="reset()" size="sm" variant="danger">
                            Close
                        </b-button>
                    </template>
                </b-modal>

            </div>
        </div>
    </div>
</template>
<script>
    import useVuelidate from "@vuelidate/core";
    import {required} from "@vuelidate/validators";
    import Loader from "../common/Loader";

    export default {
        name: "ShiftManagementTable",
        components: {Loader},
        props: ['formData'],
        data() {
            return {
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false, sortDirection: 'desc', tdClass: "p-1"},
                    {
                        key: 'dates',
                        label: 'Date (MM/DD/YYYY)',
                        sortable: true,
                        sortDirection: 'desc',
                        tdClass: "p-1"
                    },
                    {
                        key: 'slot',
                        label: 'Shift Slot',
                        sortable: false,
                        tdClass: "p-1"
                    },
                    {key: 'actions', label: 'Actions', class: 'text-right', tdClass: "p-1"}
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: process.env.MIX_TABLE_ROW_PER_PAGE,
                sortBy: '',
                sortDesc: true,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
                infoModal: {
                    id: 'info-modal',
                    title: '',
                    item: '',
                },
                counterData: [],
                date : null,
                modalTitle : 'Clone Shift',
                shift : null,
                cloneShift : null,
                shiftDetails : [],
                isLoading : false,
            }
        },
        computed: {},
        mounted() {
            this.getTableData();
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                cloneShift: {
                    required,

                },
            }
        },
        watch: {
            formData(newData, oldData) {
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
                    .get(process.env.MIX_API_URL + '/shift-management', {params: params})
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
            sendToPage(data) {
                this.$emit('sendToPage', data)
            },
            showModal(data){
                this.shiftDetails = data;
                this.date = data.slot_date;
                this.shift = data.slot;
                this.$bvModal.show('clone-modal')
            },
            saveCloneShift(){
                this.v$.$validate();
                if (!this.v$.cloneShift.$error) {
                    this.isLoading = true;
                    const params = {
                        'shift_id': this.shiftDetails.shift_id,
                        'from_date': this.shiftDetails.slot_date,
                        'new_date': this.cloneShift,
                    };
                    this.axios.post(process.env.MIX_API_URL + '/shift-management/clone', params,{ headers: {
                            'Content-Type': 'multipart/form-data'
                        }})
                        .then(response => {
                            let res = response.data;
                            if (res.status) {
                                this.$toastr.success(res.message);
                                this.getTableData();
                                this.$bvModal.hide('clone-modal');
                                this.reset();
                            }else{
                                this.$toastr.error(res.message);
                            }
                            this.isLoading = false;
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
            reset(){
                this.$bvModal.hide('clone-modal');
                this.v$.$reset();
                this.cloneShift = null;
                this.shiftDetails = [];
            }
        }
    }
</script>
