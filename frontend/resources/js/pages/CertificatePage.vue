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

                            <certificateSearch  @sendToPage="getFromTable"/>

                            <certificateData :resSearchData="searchdata"/>
                            <!--                            <certificateData :resSearchData="searchdata"/>-->
                            <!--                            <certificateDate/>-->
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
    import certificateSearch from "../components/certification/certificateSearch";
    import certificateData from "../components/certification/certificateData";

    export default {
        name: 'CertificatePage',
        components: {Breadcrumb, certificateSearch, certificateData},
        data() {
            return {
                pageTitle: 'Certificate',
                searchdata:[],
            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {
        },
        methods: {

            getFromTable(status,data){
                this.status = status;
                this.searchdata = data;

            }

        },
        computed: {}
    }
</script>

<style lang="scss">

</style>

