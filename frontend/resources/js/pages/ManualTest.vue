<template>
    <div>
        <div class="main-content">

            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb title="Visual Test"/>
                    <!--start   -->
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="offset-xl-3 col-xl-8 offset-md-3 col-md-8 col-sm-12 p-1">
                                                <div class="col-xl-7 col-md-10 col-sm-12 p-1">
                                                    <div class="d-flex flew-row ">
                                                        <input placeholder="Appointment No" id="search"  name="search" type="text" class="form-control mr-2" />
                                                        <button class="btn btn-primary btn-sm mr-2"><i class="fas fa-search"></i>
                                                        </button>
                                                        <button class="btn btn-danger btn-sm">Clear</button>
                                                    </div>

                                                </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-12">
                            <div class="card">
                                <div class="card-body">
                                    <h6>Test Type : Manual</h6>
                                    <div class="accordion" id="accordionMain">
                                        <div class="accordion-item">
                                            <h2 class="accordion-header" id="headingOne">
                                                <button class="accordion-button fw-medium collapsed" type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target="#collapseOne" aria-expanded="false"
                                                        aria-controls="collapseOne">
                                                    Sub Test : Physical Condition
                                                </button>
                                            </h2>
                                            <div id="collapseOne" class="accordion-collapse collapse"
                                                 aria-labelledby="headingOne"
                                                 data-bs-parent="#accordionMain" style="">
                                                <div class="accordion-body">
                                                    <!-- Main table element -->
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
                                                             responsive
                                                             :busy="isBusy"
                                                    >
                                                        <template #table-busy>
                                                            <div class="text-center text-danger my-2">
                                                                <b-spinner class="align-middle"></b-spinner>
                                                                <strong>Loading...</strong>
                                                            </div>
                                                        </template>


                                                        <template class="align-right" #cell(action)="row">
                                                            <button type="button" class="btn btn-primary btn-sm mb-1">
                                                                Yes
                                                            </button>
                                                            <button type="button" class="btn btn-danger btn-sm mb-1">
                                                                No
                                                            </button>
                                                        </template>
                                                    </b-table>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- end accordion -->
                        </div>
                        <!-- end col -->
                    </div>
                    <!--end  -->

                </div> <!-- container-fluid -->
            </div>
            <!-- End Page-content -->

        </div>

    </div>
</template>

<script>
    import DefaultLayout from "../layouts/DefaultLayout";
    import Breadcrumb from "../components/common/Breadcrumb";

    export default {
        name: "ManualTest",
        components: {Breadcrumb},
        data() {
            return {
                isBusy: false,
                items: [
                    {sl: 1, items: "Looking Glass" , status:'Active'},
                    {sl: 2, items: "Back light" , status:'Active'},
                    {sl: 3, items: "Front Bonnet" , status:'Active'},
                    {sl: 4, items: "Front light" , status:'Inactive'},
                    {sl: 5, items: "Back Glass" , status:'Inactive'},
                ],
                fields: [
                    {key: 'sl', label: 'SL', sortable: true, sortDirection: 'desc', tdClass: "p-1"},
                    {key: 'items', label: 'Items', sortable: false, tdClass: "p-1"},
                    {key: 'status', label: 'Status', sortable: false, tdClass: "p-1"},
                    {key: 'action', label: 'Action', class: 'text-right', tdClass: "p-1"}
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: process.env.MIX_TABLE_ROW_PER_PAGE,
                sortBy: '',
                sortDesc: true,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {
        },
        methods: {},
        computed: {}
    }
</script>

