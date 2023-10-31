<template>
    <div>
        <div class="row">
            <div class="col-12">
                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                    <div class="col-md-6 pl-0">
                    <h4 class="mb-sm-0 font-size-18 ">Sub Test Type</h4>
                    </div>
                    <div class="col-md-6 pr-0">
                        <button
                                v-if="$root.hasAccess('SubTestTypePage', 'add') ||
                                $root.hasAccess('SubTestTypePage', 'edit')" @click="showSubTestModal()"
                                class="btn btn-success btn-sm m-1 p-2 float-end"
                                title="Add Sub Test Type"
                                type="button" v-b-tooltip.hover><i
                                class="fas fa-plus-circle "></i> <span class=""> ADD</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>


        <div class="card">
            <div class="card-body">
                <b-row>
                    <b-col lg="1" md="2" class="my-2 col-3">
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
                    <b-col v-if="center_list.length>0 && (userTypeId==1)" lg="4" md="4" class="my-2 col-3">
                        <b-form-group  class="mb-0"
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
                    <b-col lg="3" md="3" class="my-2 col-3">
                        <b-form-group  class="mb-0"
                        >
                            <b-form-select
                                    id="per-page-select"
                                    v-model="sub_test_type_filter_id"
                                    @change="handleSubTestTypeChange"
                                    size="sm"
                                    class="col-md-10"
                            >
                                <option v-for="(val,key) in sub_test_type_filter_list" :key="key" :value="val.value"
                                        :disabled="val.disabled">
                                    {{ (val.text).toUpperCase() }}
                                </option>
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col v-if="center_list.length==0 && (userTypeId==1)" lg="4" md="4" class="my-2 col-3"></b-col>
                    <b-col  :lg="(userTypeId!=1)?'5':'1'" :md="(userTypeId!=1)?'5':'1'" class="my-2 col-3">
                    </b-col>
                    <b-col lg="3" md="3"  class="my-2 col-3">
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

                        <button v-if="(row.item.sub_test_type_id !== -1)" @click="viewSubTestModal(row.item)"
                                  class="btn btn-success btn-sm mb-1"
                                title="Current Sub Test Type" v-b-tooltip.hover>
                            <i class="fas fa-eye fa-xs"></i>
                        </button>
                        <button v-if="$root.hasAccess('SubTestTypePage', 'edit')" @click="modifyConfirm(row.item)"
                                :class="(row.item.sub_test_type_id !== -1)?'btn btn-primary btn-sm mb-1':'btn btn-success btn-sm mb-1'" :title="(row.item.sub_test_type_id !== -1)?'Request For Modification':''"
                                type="button" v-b-tooltip.hover><i
                                :class="(row.item.sub_test_type_id !== -1)?'fas fa-edit fa-xs':'fas fa-eye fa-xs'"></i>
                        </button>
                        <!--                        <button  v-if="$root.hasAccess('SubTestTypePage', 'delete')"  v-b-tooltip.hover title="Delete" type="button" class="btn btn-danger btn-sm m-1 p-1">-->
                        <!--                            <i class="fas fa-trash-alt icon-size"></i>-->
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

                <b-modal :title="modalTitle" scrollable id="subTestTypeModal" size="xl" no-close-on-backdrop
                         @hide="resetInfoModal">
                    <template #modal-header="{ close }">
                        <h5  class="modal-title"> <div v-html="modalTitle"></div> <div v-if="(centerName !=='' && centerName !==null) && ( sub_test_type_id !==null)" class=""> <span class="font-weight-bold">Center: </span>{{centerName}}</div></h5>
                        <button type="button" @click="close()" aria-label="Close" class="close">×</button>
                    </template>
                    <div class="">
                        <div class="">
                            <div v-if="!updateBtn && (center_list.length>0)" class="row">
                                <div class="col-md-3">
                                    <div class="mb-3">

                                        <label for="name" class="form-label required">Center <span
                                                class="text-danger">*</span></label>
                                        <b-form-group  class="mb-0"
                                        >
                                            <b-form-select
                                                    id="per-page-select"
                                                    v-model="center_id"
                                                    size="sm"
                                                    class="col-md-12"
                                            >
                                                <option v-for="(val,key) in center_list" :key="key" :value="val.value"
                                                        :disabled="val.disabled">
                                                    {{ val.text }}
                                                </option>
                                            </b-form-select>
                                        </b-form-group>

                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3 col-xm-12">
                                    <div class="mb-3">
                                        <label for="name" class="form-label required">Sub Test Type <span
                                                class="text-danger">*</span></label>
                                        <input ref="testTypeName" type="text" class="form-control"
                                               :class="[(v$.name.$error)?'is-invalid':'']"
                                               id="name" v-model="name" name="name">
                                        <ul v-if="v$.name.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-3 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">Test type <span class="text-danger">*</span></label>
                                        <b-form-select :disabled="(typeof newData === 'object' && newData !== null)"
                                                       class="form-select"
                                                       :class="[(v$.testType.$error)?'is-invalid':'']"
                                                       v-model="testType" :options="typeList"
                                                       name="testType"></b-form-select>
                                        <ul v-if="v$.testType.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-3 col-xm-12">
                                    <div class="mb-3">
                                        <label for="name" class="form-label required">Sequence <span
                                                class="text-danger">*</span></label>
                                        <b-form-select class="form-select" :class="[(v$.seq.$error)?'is-invalid':'']"
                                                       v-model="seq" :options="seqOptions"></b-form-select>

                                        <ul v-if="v$.seq.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">The field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-3 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">Status <span class="text-danger">*</span></label>
                                        <b-form-select class="form-select" :class="[(v$.status.$error)?'is-invalid':'']"
                                                       v-model="status" :options="statusOptions"
                                                       name="status"></b-form-select>
                                        <ul v-if="v$.status.$error" class="parsley-errors-list filled">
                                            <li class="parsley-required">Status field is required.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <Loader :loading="isBusy"></Loader>
                            <b-table :items="modalItems" :fields="modalFields">
                                <template #cell(item_type)="row">
                                    <input :disabled="(sub_test_type_filter_id ==-1 && !saveBtn)" type="text" class="form-control"
                                           @keypress="changeModalData(row)"
                                           :class="[( !(v$.modalItems.$errors.length > 0)?false:v$.modalItems.$each.$response.$data[row.index].test_item_name.$error)?'is-invalid':'']"
                                           v-model="row.item.test_item_name">
                                </template>
                                <template #cell(type_seq)="row">
                                    <!--                        <b-form-select v-model="row.item.item_seq" :options="seqOptions"-->
                                    <!--                                       class="form-select">-->
                                    <!--                        </b-form-select>                        -->
                                    <b-form-select :disabled="(sub_test_type_filter_id ==-1 && !saveBtn)" v-model="row.item.item_seq" class="form-select"
                                                   :class="[( (v$.modalItems.$errors.length > 0) ? v$.modalItems.$each.$response.$data[row.index].item_seq.$error : false)?'is-invalid':'']"
                                                   @change="changeModalData(row)">
                                        <b-form-select-option v-for="(option,key) in seqOptions" :key="key"
                                                              :class="(modalItems.filter(e => e.item_seq == option).length>0)?'bg-secondary text-white':''"
                                                              :disabled="modalItems.filter(e => e.item_seq == option).length>0"
                                                              :value="option">{{option}}
                                        </b-form-select-option>

                                    </b-form-select>
                                </template>
                                <template #cell(item_type_status)="row">
                                    <b-form-select :disabled="(sub_test_type_filter_id ==-1 && !saveBtn)" v-model="row.item.active_yn"
                                                   :class="[(!(v$.modalItems.$errors.length > 0)?false: v$.modalItems.$each.$response.$data[row.index].active_yn.$error)?'is-invalid':'']"
                                                   @change="changeModalData(row)"
                                                   :options="statusOptions"
                                                   class="form-select">
                                    </b-form-select>
                                </template>
                                <template class="align-right p-1" #cell(actions)="row">
                                    <button :disabled="(sub_test_type_filter_id ==-1 && !saveBtn)" v-b-tooltip.hover title="Add" type="button"
                                            class="btn btn-primary btn-sm mb-1"
                                            @click="addMore(row.index)">
                                        <i class="fas fa-plus-circle fa-xs"></i>
                                    </button>
                                    <button v-if="row.item.test_item_id ==null || row.item.test_item_id ==''" @click="remove(row)" v-b-tooltip.hover
                                            title="Delete" type="button"
                                            class="btn btn-danger btn-sm mb-1">
                                        <i class="fas fa-trash-alt fa-xs"></i>
                                    </button>
                                </template>
                            </b-table>
                        </div>
                    </div>

                    <template #modal-footer="{ cancel }">
                        <div class="col-md-12 pr-2">
                            <div class="row">
                                <div class="col-md-2 ">
                                    <label class="justify-content-start">Comments:<span class="text-danger">*</span>
                                    </label>
                                </div>
                                <div class="col-md-12 p-2">
                                    <textarea :disabled="(sub_test_type_filter_id ==-1 && !saveBtn)" placeholder="Write your comment"
                                              :class="[(v$.comments.$error)?'is-invalid':'']" v-model="comments"
                                              required class="form-control" name="comments" id="" cols="1" rows="1"></textarea>
                                </div>
                            </div>
                        </div>

                        <button v-if="!isLoading && saveBtn " class="btn btn-primary float-end btn-sm"
                                type="button" @click.prevent="submitForm()">Save
                        </button>
                        <button v-if="!isLoading && updateBtn && ( sub_test_type_filter_id !==-1 && !isPendingRequest)" class="btn btn-primary float-end btn-sm"
                                type="button" @click.prevent="updateForm()">Submit
                        </button>
                        <button v-if="isLoading" class="btn btn-primary float-end" type="button">
                            <div class="spinner-border" style="height: 1rem !important; width: 1rem !important;">
                                <span class="visually-hidden">Processing...</span>
                            </div>
                        </button>
                        <b-button @click="cancel()" size="sm" variant="danger">
                            Close
                        </b-button>
                    </template>
                </b-modal>
                <b-modal :title="modalTitle" scrollable id="viewSubTestTypeModal" size="xl" no-close-on-backdrop
                         @hide="resetInfoModal">
                    <template #modal-header="{ close }">
                        <h5  class="modal-title"> <div v-html="modalTitle"></div> <div v-if="(centerName !=='' && centerName !==null)" class=""> <span class="font-weight-bold">Center: </span>{{centerName}}</div></h5>
                        <button type="button" @click="close()" aria-label="Close" class="close">×</button>
                    </template>
                    <div class="">
                        <div class="">
                            <div class="row">
                                <div class="col-md-3 col-xm-12">
                                    <div class="mb-3">
                                        <label for="name" class="form-label required">Sub Test Type <span
                                                class="text-danger">*</span></label>
                                        <input :disabled="true" ref="testTypeName" type="text" class="form-control"
                                               :class="[(v$.name.$error)?'is-invalid':'']"
                                                v-model="name" name="name">
                                    </div>
                                </div>
                                <div class="col-md-3 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">Test type <span class="text-danger">*</span></label>
                                        <b-form-select :disabled="true"
                                                       class="form-select"
                                                       :class="[(v$.testType.$error)?'is-invalid':'']"
                                                       v-model="testType" :options="typeList"
                                                       name="testType"></b-form-select>
                                    </div>
                                </div>
                                <div class="col-md-3 col-xm-12">
                                    <div class="mb-3">
                                        <label for="name" class="form-label required">Sequence <span
                                                class="text-danger">*</span></label>
                                        <b-form-select :disabled="true" class="form-select" :class="[(v$.seq.$error)?'is-invalid':'']"
                                                       v-model="seq" :options="seqOptions"></b-form-select>
                                    </div>
                                </div>
                                <div class="col-md-3 col-xm-12">
                                    <div class="mb-3">
                                        <label class="form-label">Status <span class="text-danger">*</span></label>
                                        <b-form-select :disabled="true" class="form-select" :class="[(v$.status.$error)?'is-invalid':'']"
                                                       v-model="status" :options="statusOptions"
                                                       name="status"></b-form-select>
                                    </div>
                                </div>
                            </div>
                            <Loader :loading="isBusy"></Loader>
                            <b-table :items="modalItems" :fields="modalFields">
                                <template #cell(item_type)="row">
                                    <input type="text" class="form-control" :disabled="true"
                                           v-model="row.item.test_item_name">
                                </template>
                                <template #cell(type_seq)="row">
                                    <!--                        <b-form-select v-model="row.item.item_seq" :options="seqOptions"-->
                                    <!--                                       class="form-select">-->
                                    <!--                        </b-form-select>                        -->
                                    <b-form-select v-model="row.item.item_seq" class="form-select"
                                                   :disabled="true" >
                                        <b-form-select-option v-for="(option,key) in seqOptions" :key="key"
                                                              :class="(modalItems.filter(e => e.item_seq == option).length>0)?'bg-secondary text-white':''"
                                                              :disabled="modalItems.filter(e => e.item_seq == option).length>0"
                                                              :value="option">{{option}}
                                        </b-form-select-option>

                                    </b-form-select>
                                </template>
                                <template #cell(item_type_status)="row">
                                    <b-form-select v-model="row.item.active_yn"
                                                   :disabled="true"
                                                   :options="statusOptions"
                                                   class="form-select">
                                    </b-form-select>
                                </template>
                            </b-table>
                        </div>
                    </div>

                    <template #modal-footer="{ cancel }">
                        <b-button @click="cancel()" size="sm" variant="danger">
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
    import useVuelidate from "@vuelidate/core";
    import {helpers, minValue, required,requiredIf} from "@vuelidate/validators";

    export default {
        name: 'SubTypeTable',
        props: ['formUpdated'],
        components: {Loader},
        data() {
            return {
                isLoading: false,
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                status: false,
                fields: [
                    {
                        key: 'index',
                        label: 'SL',
                        sortable: false,
                        tdClass: 'text-center',
                        thClass: 'text-center'
                    },
                    {
                        key: 'sub_test_type_name',
                        label: 'Sub Test Name',
                        sortable: true,
                        sortDirection: 'desc',
                        tdClass: '',
                        thClass: ''
                    },
                    {
                        key: 'type_seq',
                        label: 'Sequence',
                        sortable: true,
                        sortDirection: 'desc',
                        tdClass: ' pl-5',
                        thClass: ''
                    },
                    {
                        key: 'test_type_id',
                        label: 'Test Type',
                        sortable: false,
                        sortDirection: 'desc',
                        formatter: (value, key, item) => {
                            return (value == 1) ? 'Manual' : 'Automated';
                        },
                        tdClass: 'text-center p-1',
                        thClass: 'text-center'
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
                            return (value == 'Y') ? ' text-success text-center' : ' text-danger text-center';
                        },
                        thClass: 'text-center'
                    },
                    {
                        key: 'actions',
                        label: 'Actions',
                        class: 'text-right',
                        tdClass: 'text-center',
                        thClass: 'text-center'
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
                hasCoverageBranch: true,


                tableData: [],
                typeList: [],
                item_type_name: [],
                updateBtn: false,
                saveBtn: true,
                name: '',
                testType: '',
                seq: '',
                item_seq: [],
                newItem: [],
                item_type_status: [],
                test_item_name: [],
                seqOptions: [...Array(100).keys()].map(i => i + 1),
                statusOptions: [
                    // {value: null, text: 'Please select an option'},
                    {value: 'Y', text: 'Active'},
                    {value: 'N', text: 'Inactive'},
                ],
                modalFields: [
                    {key: 'item_type', label: 'Item Type'},
                    {key: 'type_seq', label: 'Sequence'},
                    {key: 'item_type_status', label: 'Status'},
                    {key: 'actions', label: 'Actions'}
                ],
                modalItems: [],
                allFields: [],
                newData: null,
                modalTitle: 'Sub Type (Request for Addition) ',
                comments: '',
                sub_test_type_filter_id: 1,
                sub_test_type_filter_list: [
                  {value: 1, text: 'Existing Sub Test Type', disabled: false},
                  {value: -1, text: 'New Sub Test Type', disabled: false},
                ],
                center_id: -1,
                center_list: [],
                userTypeId: this.$store.getters.getUser.data.user_type_id,
                centerName: null,
                sub_test_type_id:null,
                isPendingRequest:false,
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                name: {required},
                seq: {required},
                testType: {required},
                status: {required},
                modalItems: {
                    $each: helpers.forEach({
                        test_item_name: {
                            required,
                        },
                        item_seq: {
                            required,
                            minValue: minValue(1),
                        },
                        active_yn: {
                            required,
                            mustBeActive: (value, obj) => {
                                return (this.modalItems.filter(item => (item.active_yn == 'Y')).length > 0);
                            }
                        },
                    })
                },
                comments: {
                    required
                },
            }
        },
        computed: {},
        mounted() {
            this.getTableData();
            this.getTypeList();
            this.addMore();
            this.getCenter();

        },
        watch: { },
        methods: {
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
                    'sub_test_type_filter_id':  this.sub_test_type_filter_id,
                    'center_id':  this.center_id,
                };
                this.axios
                    .get(process.env.MIX_API_URL + '/subtest', {params: params})
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
            // sendToPage(data) {
            //     console.log(data)
            //     this.$emit('sendToPage', data)
            //
            // },

            sendToPage(item) {
                var that = this;
                this.axios
                    .get(process.env.MIX_API_URL + '/subtest/' + item.sub_test_type_id, {})
                    .then(response => {
                        var res = response.data;
                        this.status = true;
                        that.sendDataPage(this.status, res);

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

            sendDataPage(status, res) {
                this.$emit('sendDataPage', status, res);
            },
            resetInfoModal() {
                this.resetForm();

            },
            showSubTestModal(data = null) {
                if (data) {
                    this.newData = data;
                    this.sub_test_type_id = data.sub_test_type_id;
                    this.name = data.sub_test_type_name;
                    this.seq = data.type_seq;
                    this.status = data.active_yn;
                    this.testType = data.test_type_id;
                    this.updateBtn = !!(data.sub_test_type_id);
                    this.saveBtn = false;
                    this.center_id = data.center_id;
                    this.getReplicaSubTestItem(data);
                    this.modalTitle = (data.pending_request=='Y')?'Sub Type (Request Waiting For Approval)':"Sub Type (Request For Modification )";
                    this.centerName = data.center_name;
                    // this.modalItems = data.itemData;
                    this.comments = (data.comments !=='')?data.comments: this.comments;
                    this.isPendingRequest = (data.pending_request =='Y')?true:false;

                }
                this.$bvModal.show("subTestTypeModal")
            },
            addMore() {
                let param = {
                    "test_item_id": "",
                    "test_item_name": "",
                    "active_yn": "",
                    "sub_test_type_id": "",
                    "test_type_id": "",
                    "item_seq": "",
                    "update_date": null,
                    "update_by": null,
                    "reference_no": null
                }
                this.modalItems.push(param);
            },
            remove(item) {
                if (this.modalItems.length === 1) {
                    this.$toastr.error("Sorry! You can't delete the last one");
                } else {
                    this.modalItems.splice(item.index, 1);
                }
            },
            getTypeList() {
                this.axios
                    .get(process.env.MIX_API_URL + '/common/test-type', {})
                    .then(response => {

                        const res = response.data;

                        if (res.status) {
                            this.typeList = res.data
                        }
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },
            async submitForm() {

                if (await this.v$.$validate()) {
                    this.isLoading = true;
                    const params = {
                        name: this.name,
                        testType: this.testType,
                        seq: this.seq,
                        status: this.status,
                        items: this.modalItems,
                        summary: this.comments,
                        center_id: this.center_id,
                    };
                    this.axios.post(process.env.MIX_API_URL + '/wf-subtest', params, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(response => {
                        var data = response.data;

                        if (data.status) {
                            this.$toastr.success(data.o_status_message);
                            this.isLoading = false;
                            this.$bvModal.hide("subTestTypeModal")
                            this.resetForm();
                            this.getTableData();

                            // this.addMore();

                        } else {
                            this.$toastr.error(data.o_status_message);
                            this.isLoading = false;
                        }
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
            async updateForm() {

                if (await this.v$.$validate()) {
                    this.isLoading = true;
                    const params = {
                        sub_test_type_id: this.sub_test_type_id,
                        name: this.name,
                        testType: this.testType,
                        seq: this.seq,
                        status: this.status,
                        items: this.modalItems,
                        summary: this.comments,
                        center_id: this.center_id,

                    };
                    this.axios.put(process.env.MIX_API_URL + '/wf-subtest/' + this.sub_test_type_id, params, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(response => {
                        var data = response.data;

                        if (data.status) {
                            this.$toastr.success(data.message);
                            this.isLoading = false;
                            this.getTableData();
                            // this.resetForm();
                            this.$bvModal.hide("subTestTypeModal")

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
                            this.isLoading = false;

                        });
                }

            },
            resetForm() {
                this.newData = null;
                this.v$.$reset() // reset the dirty state of validation
                this.testType = null;
                this.name = null;
                this.seq = null;
                this.status = null;
                this.saveBtn = true;
                this.updateBtn = false;
                this.sub_test_type_id = null;
                this.modalItems = [];
                this.modalTitle = "Sub Type (Request for Addition) "
                this.addMore();
                this.comments = null;
                this.center_id = -1;
                // this.$refs.testTypeName.focus();
            },
            getSubTestItem(item) {
                const params = {
                    center_id:item.center_id
                }
                this.axios
                    .get(process.env.MIX_API_URL + '/subtest/' + item.sub_test_type_id, {params:params})
                    .then(response => {
                        this.modalItems = (response.data.status) ? response.data.itemData : [];
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
            changeModalData(data) {
                if (data.modalItems.test_item_name !== '') {
                    this.modalItems[data.index] = {
                        "test_item_id": "",
                        "test_item_name": "",
                        "active_yn": "",
                        "sub_test_type_id": "",
                        "test_type_id": "",
                        "item_seq": "",
                        "update_date": null,
                        "update_by": null,
                        "reference_no": null
                    };
                }
                this.reloadValidateModel();
            },
            reloadValidateModel() {
                const items = this.v$.modalItems.$model
                this.v$.modalItems.$model = [];
                this.v$.modalItems.$model = items
            },
            viewSubTestModal(data=null){
                if (data) {
                    this.newData = data;
                    this.sub_test_type_id = data.sub_test_type_id;
                    this.name = data.sub_test_type_name;
                    this.seq = data.type_seq;
                    this.status = data.active_yn;
                    this.testType = data.test_type_id;
                    this.getSubTestItem(data);
                    // this.modalItems = data.itemData;
                    this.modalTitle = "Sub Type (Current Settings)"
                    this.centerName = data.center_name;
                }
                this.$bvModal.show("viewSubTestTypeModal")
            },
            getReplicaSubTestItem(item) {
                const params = {
                    center_id:item.center_id
                }
                this.axios
                    .get(process.env.MIX_API_URL + '/wf-subtest/' + item.sub_test_type_id, {params:params})
                    .then(response => {
                        this.modalItems = (response.data.status) ? response.data.itemData : [];
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
            modifyConfirm(data) {
                this.isLoading = true;
                if (data.copy_yn == 'Y') {
                    this.showSubTestModal(data);

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
                            this.isLoading = false;
                            this.saveSubtestCopy(data)

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
            saveSubtestCopy(data) {
                 const params = {
                     "center_id":data.center_id
                 }
                this.axios
                    .post(process.env.MIX_API_URL + "/subtest/copy/" + data.sub_test_type_id, params)
                    .then(response => {

                        if (response.data.status) {
                            this.showSubTestModal(data)
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
            handleSubTestTypeChange(value) {
                this.sub_test_type_filter_id = value;
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
            handleCenterChange(value) {
                this.center_id = value;
                this.currentPage = 1;
                this.getTableData();
            },


        }
    }
</script>
