<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb  :title="pageTitle"/>
                    <div class="row">
                        <div class="col-xl-12">
<!--                            <WorkflowDashboardFrom :tableData="sendToForm" @formUpdated="getFormData" @resetPageTitle="resetTitle" />-->
                            <WorkflowDashboardTable :formData="sendToTable" @sendToPage="getFromTable" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Breadcrumb from "../components/common/Breadcrumb";
    import DefaultLayout from "../layouts/DefaultLayout";
    import WorkflowDashboardFrom from "../components/workflowDashboard/WorkflowDashboardFrom";
    import WorkflowDashboardTable from "../components/workflowDashboard/WorkflowDashboardTable";


    export default {
        name: "WorkflowDashboard",
        components: {Breadcrumb,WorkflowDashboardFrom,WorkflowDashboardTable},
        data() {
            return {
                sendToForm:null,
                sendToTable:null,
                pageTitle:'Workflow Dashboard',
            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {},
        methods: {
            getFromTable(data){
                // this.pageTitle = 'Edit Workflow Dashboard';
                this.pageTitle = 'Workflow Dashboard';
                this.sendToForm = data;
            },
            getFormData(data){
                // this.pageTitle = 'Add Workflow Dashboard';
                this.pageTitle = 'Workflow Dashboard';
                this.sendToTable = data;
            },
            resetTitle(data){
                // this.pageTitle = 'Add Workflow Dashboard';
                this.pageTitle = 'Workflow Dashboard';
                this.sendToForm = null;
            }
        },
        computed: {}
    }
</script>
