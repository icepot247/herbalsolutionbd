<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb  :title="pageTitle"/>
                    <div class="row">
                        <div class="col-xl-12">
                            <WorkflowFrom :tableData="sendToForm" @formUpdated="getFormData" @resetPageTitle="resetTitle" />
                            <WorkflowTable :formData="sendToTable" @sendToPage="getFromTable" />
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
    import WorkflowFrom from "../components/workflow/WorkflowFrom";
    import WorkflowTable from "../components/workflow/WorkflowTable";


    export default {
        name: "WorkflowPage",
        components: {Breadcrumb,WorkflowFrom,WorkflowTable},
        data() {
            return {
                sendToForm:null,
                sendToTable:null,
                pageTitle:'Add Workflow',
            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {},
        methods: {
            getFromTable(data){
                this.pageTitle = 'Edit Workflow';
                this.sendToForm = data;
            },
            getFormData(data){
                this.pageTitle = 'Add Workflow';
                this.sendToTable = data;
            },
            resetTitle(data){
                this.pageTitle = 'Add Workflow';
                this.sendToForm = null;
            }
        },
        computed: {}
    }
</script>
