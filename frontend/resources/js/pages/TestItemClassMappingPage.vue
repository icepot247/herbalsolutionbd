<template>
    <div>

        <!-- ============================================================== -->
        <!-- Start right Content here -->
        <!-- ============================================================== -->
        <div class="main-content">

            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb :title="pageTitle"/>

                    <!--start Booth Setup  form-->
                    <div class="row">
                        <div class="col-xl-12">
                            <!--     Booth Form       -->
                            <TestItemForm />
                            <!--    Booth Table         -->
<!--                            <BoothTable />-->
                            <SearchDataForm />
                        </div>
                        <!-- end col -->
                    </div>
                    <!--end Booth Setup form-->


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
import TestItemForm from "../components/testItem/TestItemForm";
import SearchDataForm from "../components/testItem/SearchDataForm";

export default {
    name: 'BoothPage',
    components: {Breadcrumb, TestItemForm, SearchDataForm},
    data() {
        return {
            pageTitle: 'Test Item & Class Mapping',
            sendToForm: [],
        }
    },
    created() {
        this.$emit(`update:layout`, DefaultLayout);
    },
    mounted() {
    },
    methods: {

    },
    computed: {}
}
</script>

<style lang="scss">

</style>

