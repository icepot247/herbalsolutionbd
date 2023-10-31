<template>
    <div>
        <!-- ============================================================== -->
        <!-- Start right Content here -->
        <!-- ============================================================== -->
        <div class="main-content">

            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb title="Shift"/>

                    <!--start Shift Setup  form-->
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card">
                                <div class="card-body">
                                    <form action="" method="">

                                        <div class="row">
                                            <div class="col-12">
                                                <div class="row">
                                                    <div class="col-md-4 col-xm-12">
                                                        <div class="mb-3">
                                                            <label class="form-label">Both no:</label>
                                                            <select name="booth_no" class="form-select">
                                                                <option selected="">Choose...</option>
                                                                <option>...</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-2 col-xm-12">
                                                        <div class="mb-3">
                                                            <label class="form-label">Start Time:</label>
                                                            <input name="start_time" type="time" class="form-control">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-2 col-xm-12">
                                                        <div class="mb-3">
                                                            <label class="form-label">End Time:</label>
                                                            <input name="end_time" type="time" class="form-control">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-2 col-xm-12">
                                                        <div class="mb-3">
                                                            <label class="form-label">Start Date:</label>
                                                            <input name="start_date" type="date" class="form-control">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-2 col-xm-12">
                                                        <div class="mb-3">
                                                            <label class="form-label">End Date:</label>
                                                            <input name="end_date" type="date" class="form-control">
                                                        </div>
                                                    </div>

                                                    <div class="form-group col-md-12 col-sm-12">
                                                        <div class="row">
                                                            <div class="col-md-6">
                                                                <label for="users">Users</label>
                                                                <select multiple class="form-control" id="users">
                                                                    <option>1</option>
                                                                    <option>2</option>
                                                                    <option>3</option>
                                                                    <option>4</option>
                                                                    <option>5</option>
                                                                </select>
                                                            </div>
                                                            <div class="col-md-6">
                                                                <label for="assignedUser">Assigned User</label>
                                                                <select multiple class="form-control" id="assignedUser">
                                                                    <option>1</option>
                                                                    <option>2</option>
                                                                    <option>3</option>
                                                                    <option>4</option>
                                                                    <option>5</option>
                                                                </select>
                                                            </div>
                                                        </div>


                                                    </div>

                                                </div>
                                            </div>


                                        </div>


                                        <div>
                                            <button type="submit" class="btn btn-primary float-end mt-3">Save</button>
                                        </div>

                                    </form>
                                </div>
                                <!-- end card body -->
                            </div>
                            <!-- end card -->
                        </div>
                        <!-- end col -->
                    </div>
                    <!--end Shift Setup form-->


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
        name: 'ShiftPage',
        components: {Breadcrumb},
        data() {
            return {
            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {
        },
        methods: {
        },
        computed:{
        }
    }
</script>

<style lang="scss">

</style>

