<template>
    <div>
        <div class="card">
            <div class="card-body">
                <h3 class="card-title">Booths</h3>
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
                    <template class="align-right" #cell(actions)="row">
                        <button v-b-tooltip.hover title="Counters"
                                v-if="$root.hasAccess('CounterModal', 'add') || $root.hasAccess('CounterModal', 'edit')"
                                @click="counter(row.item, row.index, $event.target)" class="btn btn-info btn-sm mb-1">
                            <i class="fas fa-align-center fa-xs"></i>
                        </button>
                        <button v-if="$root.hasAccess('BoothPage', 'edit')" v-b-tooltip.hover title="Edit" type="button" class="btn btn-primary btn-sm mb-1"
                                @click="sendToPage(row.item)"><i
                            class="fas fa-edit fa-xs"></i>
                        </button>
                        <!--                        <button v-b-tooltip.hover title="Delete" type="button" class="btn btn-danger btn-sm mb-1">-->
                        <!--                            <i class="fas fa-trash-alt fa-xs"></i>-->
                        <!--                        </button>-->
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
                <b-modal no-close-on-backdrop size="lg" :id="infoModal.id" :title="infoModal.title" ok-only
                         @hide="resetInfoModal">
<!--                    <pre>{{v$}}</pre>-->
<!--                    <pre>{{this.v$.counterItems.$model}}</pre>-->
<!--                    <pre>{{v$.counterItems.$each.$response.$errors[this.changedCounterNo]}}</pre>-->
<!--                    <pre>{{v$.counterItems.$each.$response.$errors[changedCounterNo]}}</pre>-->
<!--                    <pre>{{v$.counterItems.$each}}</pre>-->
                    <b-table ref="table"
                             class="mt-2"
                             :items="counterItems"
                             :fields="counterFields"
                             responsive
                             :busy="isLoading"
                    >
                        <template #table-busy>
                            <div class="text-center text-danger my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Loading...</strong>
                            </div>
                        </template>
                        <template #head(counter_no)="row" :class="'p-1'">
                            {{row.label}}
                            <span class="text-danger">*</span>
                        </template>
                        <template #head(active_yn)="row">
                            {{row.label}}
                            <span class="text-danger">*</span>
                        </template>
                        <template #head(terminal_ip)="row">
                            {{row.label}}
                            <span v-if="infoModal.item.ip_wise == 'Y'" class="text-danger">*</span>
                        </template>
                        <template #head(mac_address)="row">
                            {{row.label}}
                            <span v-if="infoModal.item.mac_wise == 'Y'" class="text-danger">*</span>
                        </template>
                        <template #cell(counter_no)="row" class="p-1">
<!--                            <b-form-select  @change="saveCounterInfo(row,infoModal.item)" v-model="row.item.counter_no"-->
<!--                                           :class="[(v$.counterItems.$each.$response.$data[row.index].counter_no.$error)?'is-invalid':'']"-->
<!--                                           :options="itemsOptions"-->
<!--                                           class="form-select">-->
<!--                            </b-form-select>-->

                            <b-form-select @change="saveCounterInfo(row,infoModal.item)" v-model="row.item.counter_no"
                                           :class="[(v$.counterItems.$each.$response.$data[row.index].counter_no.$error)?'is-invalid':'']"
                            >
                                <b-form-select-option v-for="(option,key) in itemsOptions" :key="key" :class="(counterItems.filter(e => e.counter_no == option).length>0)?'bg-secondary text-white':''" :disabled="counterItems.filter(e => e.counter_no == option).length>0" :value="option" >{{option}}</b-form-select-option>
                            </b-form-select>
<!--                            <ul v-if="v$.counterItems.$each.$response.$data[row.index].counter_no.$error" class="parsley-errors-list filled">-->
<!--                                <li v-if="v$.counterItems.$each.$response.$data[row.index].counter_no.$error && !v$.counterItems.$each.$response.$data[row.index].counter_no.notSameAsCounter"-->
<!--                                    class="parsley-required">Counter No Already Used!-->
<!--                                </li>-->
<!--                            </ul>-->
                        </template>
                        <template  #cell(terminal_ip)="row" class="p-1">
                            <input  @blur="reloadValidateModel" @change="saveCounterInfo(row,infoModal.item)" v-model="row.item.terminal_ip"
                                   :class="[(v$.counterItems.$each.$response.$data[row.index].terminal_ip.$error)?'is-invalid':'']"
                                   class="form-control" type="text"/>
                        </template>
                        <template #cell(mac_address)="row" class="p-1">
                            <input @blur="reloadValidateModel" @change="saveCounterInfo(row,infoModal.item)" v-model="row.item.mac_address"
                                   :class="[(v$.counterItems.$each.$response.$data[row.index].mac_address.$error)?'is-invalid':'']"
                                   class="form-control" type="text"/>

                        </template>
                        <template #cell(active_yn)="row" class="p-1">
                            <b-form-select @change="saveCounterInfo(row,infoModal.item)"
                                           v-model="row.item.active_yn"
                                           :options="statusOptions" class="form-select">
                            </b-form-select>
                        </template>
                        <template class="align-right p-1" #cell(actions)="row">
                            <button  type="button" class="btn btn-primary btn-sm mb-1 mt-1"
                                    @click="addMore">
                                <i class="fas fa-plus-circle fa-xs"></i>
                            </button>
                            <button v-if="row.item.counter_id==null" @click="remove(row,infoModal.item)"  type="button"
                                    class="btn btn-danger btn-sm mb-1 mt-1">
                                <i class="fas fa-trash-alt fa-xs"></i>
                            </button>
                        </template>
                    </b-table>
                    <template #modal-footer="{ ok,cancel }">
                        <b-button size="sm" variant="danger" @click="cancel()">
                            Cancel
                        </b-button>
                        <b-button size="sm" variant="primary" @click="storeUpdateCounter()">
                            Save
                        </b-button>
                    </template>
                </b-modal>
            </div>
        </div>
    </div>
</template>
<script>
    import useVuelidate from "@vuelidate/core";
    import {required,requiredIf,helpers,ipAddress,macAddress,sameAs,not} from "@vuelidate/validators";
    import {reactive} from "vue"

    export default {
        name: 'BoothTable',
        props: ['formUpdated'],
        data() {
            return {
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false},
                    {key: 'booth_name', label: 'Name', sortable: true, sortDirection: 'desc', tdClass: "p-1"},
                    {key: 'booth_no', label: 'Booth No.', sortable: false, sortDirection: 'desc', tdClass: "p-1"},
                    {
                        key: 'booth_type',
                        label: 'Booth Type',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return value.booth_type_name;
                        },
                        tdClass: "p-1"

                    },
                    {
                        key: 'ip_wise',
                        label: 'IP Wise',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return (value == 'Y') ? 'Yes' : 'No';
                        },
                        tdClass: "p-1"
                    },
                    {
                        key: 'mac_wise',
                        label: 'Device Unique Id Wise',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return (value == 'Y') ? 'Yes' : 'No';
                        },
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
                            return (value == 'Y') ? ' text-success' : ' text-danger';
                        },
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
                counterNo: null,
                boothDetails: [],
                counterItems: [],
                itemsOptions: [...Array(100).keys()].map(i => i + 1),
                fieldValues: [],
                ipWise: '',
                macWise: '',
                counterFields: [
                    {key: "counter_no", label: "Counter No",thClass:'p-1',tdClass: "p-1"},
                    {key: "terminal_ip", label: "IP", thClass:'p-1 pl-1',tdClass: "p-1"},
                    {key: "mac_address", label: "Device Unique Id Wise", thClass:'p-1',tdClass: "p-1"},
                    {key: "active_yn", label: "Status", thClass:'p-1',tdClass: "p-1"},
                    {key: "actions", label: "Action", thClass:'p-1',tdClass: "p-1"},
                ],
                allFields: {},
                isLoading: false,
                statusOptions: [
                    {value: 'Y', text: 'Active',},
                    {value: 'N', text: 'Inactive'},
                ],
                counterDeletedId: [],
                changedCounterNo:0,
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                counterItems: {
                    $each: helpers.forEach({
                        counter_no: {
                            required,
                            // notSameAs: not(sameAs(4))
                        },
                        terminal_ip: {
                            required:requiredIf(function () {
                                return this.infoModal.item.ip_wise == 'Y'
                            }),
                            ipAddress,
                        } ,
                        mac_address: {
                            required: requiredIf(function () {
                                return this.infoModal.item.mac_wise == 'Y'
                            }),
                            // macAddress: macAddress(':'),
                        }
                    })
                }

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
            counter(item, index, button) {
                this.infoModal.title = "Counters Setup for Booth ("+ item.booth_name +")";
                this.infoModal.item = item;
                this.getCounters(this.infoModal.item.booth_id);
                this.$root.$emit('bv::show::modal', this.infoModal.id, button)
            },
            resetInfoModal() {
                this.infoModal.title = ''
                this.infoModal.content = ''
                this.infoModal.item = []
            },
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
                    .get(process.env.MIX_API_URL + '/booth', {params: params})
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
            storeUpdateCounter() {
                this.v$.$validate()
                if (this.v$.$invalid) return;

                this.isLoading = true;
                this.allFields.counterInfo = this.counterItems;
                this.allFields.deletedId = (this.counterDeletedId.length>0)?this.counterDeletedId : [];
                this.axios.post(process.env.MIX_API_URL + '/counter/', this.allFields,{ headers: {
                        'Content-Type': 'application/json'
                    }})
                    .then(response => {
                        if (response.data.status) {
                            this.$toastr.success(response.data.message)
                        }else{
                            this.$toastr.error(response.data.message)
                        }
                        // this.isLoading = false;
                        this.getCounters(this.infoModal.item.booth_id);
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                        this.isLoading = false;
                    })
                    .finally(() => {
                        // this.getCounters(this.infoModal.item.booth_id);
                        this.isLoading = false;
                    });
            },
            getCounters(booth_id) {
                this.isLoading = true;
                this.counterItems = [];
                this.counterDeletedId = [];
                this.axios
                    .get(process.env.MIX_API_URL + '/booth/' + booth_id, {})
                    .then(response => {
                        var res = response.data;
                        if (res.status) {
                            if (res.data.counters.length > 0) {
                                this.ipWise = res.data.ip_wise;
                                this.macWise = res.data.mac_wise;
                                this.counterItems = res.data.counters;
                                // console.log(this.counterItems.find(e => e.counter_no === 2))
                                // console.log(this.counterItems.filter(e => e.counter_no == 2).length)
                            } else {
                                this.addMore();
                            }
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
            },
            addMore() {
                var params = {
                    "counter_id": null,
                    "counter_no": null,
                    "booth_id": null,
                    "center_id": null,
                    "booth_type_id": null,
                    "active_yn": "Y",
                    "terminal_ip": "",
                    "mac_address": "",
                    "booth": {}
                };
                this.counterItems.push(params)
            },
            remove(data, boothInfo) {
                if (this.counterItems.length === 1) {
                    this.$toastr.error("Sorry! You can't delete the last one");
                } else {
                    this.counterItems.splice(data.index, 1);
                    (data.item.counter_id) ? this.counterDeletedId.push(data.item.counter_id) : '';
                }
            },
            saveCounterInfo(data, boothInfo) {
                if (data.item.counter_no) {
                    this.counterItems[data.index] = {
                        counter_id: (data.item.counter_id) ? data.item.counter_id : null,
                        counter_no: (data.item.counter_no) ? data.item.counter_no : null,
                        booth_id: boothInfo.booth_id,
                        booth_type_id: boothInfo.booth_type_id,
                        center_id: boothInfo.center_id,
                        terminal_ip: (data.item.terminal_ip) ? data.item.terminal_ip : '',
                        mac_address: (data.item.mac_address) ? data.item.mac_address : '',
                        active_yn: data.item.active_yn,
                    };
                }
            },
            reloadValidateModel(){
                const  counterItem = this.v$.counterItems.$model
                this.v$.counterItems.$model = [];
                this.v$.counterItems.$model = counterItem
            }
        }
    }

</script>
