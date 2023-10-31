<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb :title="pageTitle"/>
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card">
                                <div class="card-body">
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

                                        <template class="align-right" #cell(mapping_lane)="row">
                                            <b-form-select class="form-select col-4"
                                                           v-bind:value="(row.item.mapping_lane != null)?row.item.mapping_lane.lane_type_id:null"
                                                           :options="laneTypeOption"
                                                           @change="setLaneType(row.item,$event )"></b-form-select>
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import DefaultLayout from "../layouts/DefaultLayout";
    import Breadcrumb from "../components/common/Breadcrumb";

    export default {
        name: 'LaneTypeMapping',
        components: {Breadcrumb},
        data() {
            return {
                pageTitle: 'Lane Type Mapping',
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'index', label: 'SL', sortable: false},
                    {key: 'vehicle_class_name', label: 'Vehicle Class', sortable: true, sortDirection: 'desc', tdClass: "p-1"},
                    {key: 'mapping_lane', label: 'Lane Type', class: 'text-right', tdClass: "p-1"},
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: process.env.MIX_TABLE_ROW_PER_PAGE,
                sortBy: '',
                sortDesc: true,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],

                laneTypeOption: [],
            }
        },
        mounted() {
            this.getTableData();
            this.getLaneType();
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
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
                    .get(process.env.MIX_API_URL + '/lane-type-mapping/', {params: params})
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
            getLaneType() {
                this.axios
                    .get(process.env.MIX_API_URL + '/common/lane-types', {})
                    .then(response => {
                        this.laneTypeOption = (response.status) ? response.data.data : [];
                        this.laneTypeOption.unshift({text: 'Select one', value: null})

                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally()
            },
            setLaneType(item, value) {

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
                        if(value == null){
                            return false;
                        }
                        item.mapping_lane = {
                            "lane_type_id": value,
                            "lane_type_name": (value)?this.laneTypeOption[value].text : '',
                            "laravel_through_key": null
                        };
                        this.isBusy = true;
                        this.axios.post(process.env.MIX_API_URL + '/lane-type-mapping', item,{ headers: {
                                'Content-Type': 'application/json'
                            }})
                            .then(response => {
                                var data = response.data;
                                if (data.status) {
                                    this.$toastr.success(data.message);
                                    this.getTableData();
                                    this.isBusy = false;
                                } else {
                                    this.$toastr.error(data.message);
                                    this.isBusy = false;
                                }
                            })
                            .catch(error => {
                                this.$toastr.error(error.response.data.message);
                                this.isBusy = false;
                            })
                            .finally(() => {
                                this.isBusy = false;
                                this.getTableData();
                            });
                    }else{
                        this.getTableData();
                    }
                });


            }

        }
    }

</script>
