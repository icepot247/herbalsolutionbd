<template>
    <div>
        <!-- ============================================================== -->
        <!-- Start right Content here -->
        <!-- ============================================================== -->
        <div class="main-content">

            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb :title="pageTitle"/>
                    <!--start Certificate Approval -->
                    <div class="row">
                        <div class="col-xl-12">

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

                                <template class="align-right " #cell(actions)="row">

                                    <button v-b-tooltip.hover  type="button" class="btn btn-primary btn-sm m-1 p-1"  @click="queueCancel(row.item, row.index, $event.target)">
                                        Cancel
                                    </button>
                                </template>

                            </b-table>
                            <!--    Pagination            -->
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
                            <!-- end card -->
                        </div>
                        <!-- end col -->
                    </div>
                    <!--end Certificate Approval-->

                </div> <!-- container-fluid -->
            </div>
            <!-- End Page-content -->

        </div>
        <!-- end main content-->
    </div>
</template>

<script>
    import DefaultLayout from "../layouts/DefaultLayout";
    import Breadcrumb from "../components/common/Breadcrumb";


    export default {
        name: 'QueueCancel',
        components: {Breadcrumb},
        data() {
            return {
                pageTitle: 'Queue Cancellation',
                isBusy: true,
                pageOptions: [{value: this.totalRows, text: 'All'}, 5, 10, 100],
                items: [],
                fields: [
                    {key: 'sl', label: 'SL', sortable: false},
                    // {key: 'center_id', label: 'ID', sortable: false, sortDirection: 'desc'},
                    {key: 'queue_no', label: 'Queue Number', sortable: true, sortDirection: 'desc'},
                    {key: 'registration_no', label: ' Registration Number', sortable: true, sortDirection: 'desc'},
                    {key: 'insert_date', label: ' Insert Date', sortable: true, sortDirection: 'desc'},

                    {key: 'actions', label: 'Actions', class: 'text-right'}
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: process.env.MIX_TABLE_ROW_PER_PAGE,
                sortBy: '',
                sortDesc: true,
                sortDirection: 'desc',
                filter: null,
                filterOn: [],


            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {
            this.getTableData();
        },
        computed: {
            itemsWithSno() {
                // return this.items.map((d, index) => ({ ...d, sl: index + 1 }))
            }
        },

        methods: {

            onFiltered(filteredItems) {
                // this.totalRows = filteredItems.length
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
                    'search':this.filter
                };
                this.axios
                    .get(process.env.MIX_API_URL + '/appointment/queue-list', {params:params})
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

            async queueCancel(item,index,event) {
                this.isLoading = true;
                var lane_queue_id = item.lane_queue_id
                Swal.fire({
                    title: 'Are you sure?',
                    text: "YOU WON'T BE ABLE TO REVERT THIS QUEUE!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, Cancel it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.axios
                            .get(process.env.MIX_API_URL + '/appointment/queue-cancel/' + lane_queue_id, {})
                            .then(response => {
                                var res = response.data;
                                if (res.status) {
                                    Swal.fire(
                                        res.message,
                                        'This Queue has been Canceled.',
                                        'success'
                                    )
                                    this.getTableData();
                                }
                                this.isLoading = false;
                            })
                            .catch(error => {
                                Swal.fire(
                                    error.response.data.message,
                                    '',
                                    'error'
                                )
                                // this.$toastr.error(error.response.data.message);
                                this.isLoading = false;
                            })
                            .finally(() => {
                                this.isBusy = false;

                            });

                    }
                })


            },
        }
    }
</script>

<style lang="scss">

</style>

