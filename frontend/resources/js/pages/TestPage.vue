<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb title="Test"/>
                    <!-- Start content -->
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="invoice-title">
                                        <h4 class="float-end font-size-16">Order # 12345</h4>
                                        <div class="mb-4">
                                            hello
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            content
                                        </div>
                                    </div>
                                    <div class="d-print-none">
                                        <div class="float-end">
                                            <a href="javascript: void(0);" class="btn btn-primary w-md waves-effect waves-light">Send</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- end content -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import DefaultLayout from "../layouts/DefaultLayout";
    import Breadcrumb from "../components/Breadcrumb";

    export default {
        name: 'TestPage',
        components: {Breadcrumb},
        data() {
            return {}
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {
            // console.log(this.$store);
        },
        methods: {
            save(){
            },
        },
        computed:{

        }
    }
</script>

<style lang="scss">

</style>

