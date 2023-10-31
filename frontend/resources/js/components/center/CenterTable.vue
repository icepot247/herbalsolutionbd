<template>
    <div>
        <div class="card">
            <div class="card-body">
                <h5 class="">Centers</h5>
                <b-row>
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
                </b-row>
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
                        <a :href="'/screen?center_id='+row.item.center_id" target="_blank"
                           class="btn btn-success btn-sm mb-1"
                           title="Screen" v-b-tooltip.hover
                           v-if="$root.hasAccess( 'ScreenPage', 'add')">
                            <i class="mdi mdi-monitor fa-xs"></i>
                        </a>
                        <b-button @click="showInspectorModal(row.item, row.index, $event.target)"
                                  class="btn btn-secondary btn-sm mb-1"
                                  title="Inspector" v-b-tooltip.hover
                                  v-if="$root.hasAccess( 'InspectorModal', 'add') || $root.hasAccess( 'InspectorModal', 'edit')">
                            <i class="fas fa-user fa-xs"></i>
                        </b-button>
                        <b-button @click="showCoverageModal(row.item, row.index, $event.target)"
                                  class="btn btn-info btn-sm mb-1"
                                  size="sm" title="Coverage" v-b-tooltip.hover
                                  v-if="$root.hasAccess( 'CoverageModal', 'add') || $root.hasAccess( 'CoverageModal', 'edit')">
                            <i class="fas fa-network-wired fa-xs"></i>
                        </b-button>
                        <button @click="sendToPage(row.item)" class="btn btn-primary btn-sm mb-1" title="Edit"
                                type="button" v-b-tooltip.hover
                                v-if="$root.hasAccess( 'CenterPage', 'edit')"><i
                                class="fas fa-edit fa-xs"></i>
                        </button>
                        <!--                        <button v-b-tooltip.hover title="Delete" type="button" class="btn btn-danger btn-sm mb-1">-->
                        <!--                            <i class="fas fa-trash-alt fa-xs"></i>-->
                        <!--                        </button>-->
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
                <b-modal :title="modalTitle" id="coverageModal" no-close-on-backdrop>
                    <Loader :loading="isLoading" class="mt-4"></Loader>
                    <div v-if="!isLoading">
                        <p class="fw-bold">Coverage Branch</p>
                        <b-list-group>
                            <b-list-group-item :key="index" v-for="(item, index) in coverageList">
                                <b-form-checkbox
                                        :checked="coverage"
                                        :value="item.code"
                                        @change="updateCoverage($event, item.code)"
                                        unchecked-value="not_accepted"
                                        v-model="coverage"
                                >
                                    {{item.label}}
                                </b-form-checkbox>
                            </b-list-group-item>
                        </b-list-group>
                    </div>
                    <template #modal-footer="{ cancel }">
                        <b-button @click="cancel()" size="sm" variant="secondary">
                            Close
                        </b-button>
                    </template>
                </b-modal>
                <b-modal :title="modalTitle" class="p-0" id="inspectorModal" no-close-on-backdrop size="lg">
                    <Loader v-show="isLoading" :loading="isLoading" class="mt-4"></Loader>

                    <div class="accordion" id="accordionMain" v-if="!isLoading && hasCoverageBranch">
                        <div class="accordion-item" v-for="(branch,index) in modalData.coverages" :key="index">
                            <h2 class="accordion-header" id="headingOne">
                                <button class="accordion-button fw-medium collapsed" type="button"
                                        data-bs-toggle="collapse"
                                        :data-bs-target="'#collapseOne'+index" aria-expanded="false"
                                        aria-controls="collapseOne"
                                >
                                    <h6> Branch: {{branch.brta_branch.branch_name}}</h6>
                                </button>
                            </h2>
                            <div :id="'collapseOne'+index" class="accordion-collapse collapse"
                                 aria-labelledby="headingOne"
                                 data-bs-parent="#accordionMain" style="">
                                <div class="accordion-body">
                                    <h6>Inspectors</h6>
                                    <b-list-group>
                                        <b-list-group-item :key="index"
                                                           v-for="(item, index) in inspectorList[branch.branch_id]">
                                            <b-form-checkbox
                                                    :checked="inspectors"
                                                    :value="item.value"
                                                    unchecked-value="not_accepted"
                                                    v-model="inspectors"
                                                    @change="updateInspector(item.value, branch.branch_id)"
                                            >
                                                {{item.text}}
                                            </b-form-checkbox>
                                        </b-list-group-item>
                                    </b-list-group>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div v-if="!isLoading && !hasCoverageBranch">
                        <h6 class="text-danger text-center">There is no coverage branch found.</h6>
                    </div>

                    <template #modal-footer="{ cancel }">
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
    import Loader from "../common/Loader";

    export default {
        name: 'CenterTable',
        props: ['formUpdated'],
        components: {Loader},
        data() {
            return {
                isLoading: false,
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false},
                    {key: 'center_name', label: 'Name', sortable: true, sortDirection: 'desc'},
                    {
                        key: 'division',
                        label: 'Division',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return value.division_name;
                        },
                    },
                    {
                        key: 'district',
                        label: 'District',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return value.district_name;
                        },
                    },
                    {
                        key: 'thana',
                        label: 'Thana',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return value.thana_name;
                        },
                    },
                    {key: 'location_address', label: 'Address', sortable: false, sortDirection: 'desc'},
                    {
                        key: 'coverages',
                        label: 'Coverages',
                        sortable: false,
                        formatter: (value, key, item) => {
                            let coverages = '';
                            if (value) {
                                value.forEach(function (val, key) {
                                    coverages += val.brta_branch.branch_name + ((value.length ===1) ? "" : (value.length ===(key+1))?"": ", ");
                                })
                            }
                            return coverages;
                        },
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
                            return (value == 'Y') ? ' text-success' : ' text-danger';
                        },
                    },
                    {key: 'actions', label: 'Actions', class: 'text-right',
                        tdClass:(value, key, item)=>{
                        return "col-md-2"
                        },
                    }
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: process.env.MIX_TABLE_ROW_PER_PAGE,
                sortBy: '',
                sortDesc: true,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
                inspectorModal: {
                    id: 'inspector-modal',
                    title: '',
                    content: ''
                },
                modalTitle: '',
                modalData: {},
                modalFor: '',
                coverage: [],
                coverageList: [],
                inspectorList: [],
                inspectorListData: [],
                inspectors: [],
                hasCoverageBranch: true
            }
        },
        computed: {},
        mounted() {
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
                    .get(process.env.MIX_API_URL + '/center', {params: params})
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
            showCoverageModal(item, index, button) {
                this.modalTitle = (item) ? 'CENTER: ' + item.center_name : '';
                this.modalData = item;
                this.coverage = [];
                this.getBrtaBranch(item);
                this.$bvModal.show('coverageModal')
            },
            getBrtaBranch(data) {
                this.isLoading = true;
                this.axios
                    .get(process.env.MIX_API_URL + '/common/brta-branch/'+data.division.division_id, {})
                    .then(response => {
                        this.isLoading = false;
                        const res = response.data;
                        if (res.status) {
                            console.log("response",res.data)
                            this.coverageList = res.data
                            if (this.modalData.coverages.length > 0) {
                                this.coverage = [];
                                for (var i in this.modalData.coverages) {
                                    this.coverage.push(this.modalData.coverages[i].branch_id);
                                }
                            }
                        }
                    })
                    .catch(error => {
                        this.isLoading = false;
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            },
            updateCoverage(event, branchId) {
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

                        this.axios
                            .post(process.env.MIX_API_URL + '/center/coverage/' + this.modalData.center_id, {'branch_id': branchId}, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            })
                            .then(response => {
                                var res = response.data;
                                if (res.status) {
                                    this.$toastr.success(res.message);
                                    this.getTableData();
                                }
                                this.isLoading = false;
                            })
                            .catch(error => {
                                this.$toastr.error(error.response.data.message);
                                this.coverage = this.coverage.filter(val => val !== branchId);
                                this.isLoading = false;
                            })
                            .finally(() => {
                                this.isLoading = false;
                            });
                    }
                });

            },
            showInspectorModal(item, index, button) {
                this.isLoading = true
                this.modalTitle = (item) ? 'CENTER: ' + item.center_name : '';
                this.modalData = item;
                this.$bvModal.show('inspectorModal')
                this.isLoading = false;
                if (this.modalData.coverages.length > 0) {
                    for (var i in this.modalData.coverages) {
                        this.getInspectors(this.modalData.coverages[i].branch_id);
                    }
                    this.hasCoverageBranch = true
                } else {
                    this.hasCoverageBranch = false
                }
            },
            getInspectors(branchId) {
                this.isLoading = true;
                this.axios
                    .get(process.env.MIX_API_URL + '/common/brta-branch-inspectors/' + branchId, {})
                    .then(response => {
                        this.isLoading = false;
                        const res = response.data;
                        if (res.status) {
                            this.inspectorList[branchId] = [];
                            this.inspectorListData[branchId] = [];
                            for (var i in res.data) {
                                this.inspectorListData[branchId].push(res.data[i]);
                                this.inspectorList[branchId].push({
                                    text: res.data[i].employeeName + ' (' + res.data[i].employeeId + ' :: ' + res.data[i].loginName + ')',
                                    value: res.data[i].employeeId
                                },);
                            }
                            if (this.modalData.coverages) {
                                for (var b in this.modalData.coverages) {
                                    if (this.modalData.coverages[b].brta_branch.inspectors) {
                                        for (var i in this.modalData.coverages[b].brta_branch.inspectors) {
                                            this.inspectors.push(this.modalData.coverages[b].brta_branch.inspectors[i].brta_employee_id);
                                        }
                                    }
                                }
                            }

                        }
                    })
                    .catch(error => {
                        this.isLoading = false;
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            },
            updateInspector(brtaEmpId, branchId) {
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
                        if (brtaEmpId.length > 0 && this.inspectorListData[branchId]) {
                            var selectedBrtaInspector = this.inspectorListData[branchId].filter(i => i.employeeId === brtaEmpId);
                            if (selectedBrtaInspector) {
                                var params = {
                                    'branch_id': branchId,
                                    'designation_id': selectedBrtaInspector[0].designationId,
                                    'name': selectedBrtaInspector[0].employeeName,
                                    'login_id': selectedBrtaInspector[0].loginName,
                                    'brta_employee_id': selectedBrtaInspector[0].employeeId,
                                }
                                this.axios
                                    .post(process.env.MIX_API_URL + '/center/inspector/' + this.modalData.center_id, params, {
                                        headers: {
                                            'Content-Type': 'multipart/form-data'
                                        }
                                    })
                                    .then(response => {
                                        var res = response.data;
                                        if (res.status) {
                                            this.$toastr.success(res.message);
                                            this.getTableData();
                                        }
                                        this.isLoading = false;
                                    })
                                    .catch(error => {
                                        this.$toastr.error(error.response.data.message);
                                        this.inspectors = this.inspectors.filter(val => val !== brtaEmpId);
                                        this.isLoading = false;
                                    })
                                    .finally(() => {
                                        this.isLoading = false;
                                    });
                            }
                        } else {
                            this.$toastr.error('Invalid BRTA Inspector');
                        }
                    }else{
                        this.inspectors = this.inspectors.filter(val => val !== brtaEmpId);
                    }
                });

            },
        }
    }
</script>
