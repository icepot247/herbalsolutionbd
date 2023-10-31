<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb v-if="$root.hasAccess('ShiftSetupPage', 'add') || $root.hasAccess('ShiftSetupPage', 'edit')"  :title="pageTitle"/>
                    <div class="row">
                        <div class="col-xl-12">
                            <ShiftSetupForm v-if="$root.hasAccess('ShiftSetupPage', 'add') || $root.hasAccess('ShiftSetupPage', 'edit')" :tableData="sendToForm" @formData="getFormData" @resetPageTitle="resetTitle"/>
                            <ShiftSetupTable :formData="sendToTable" @sendToPage="getFromTable"/>
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
    import ShiftSetupForm from "../components/shiftSetup/ShiftSetupForm";
    import ShiftSetupTable from "../components/shiftSetup/ShiftSetupTable";
    export default {
        name: "ShiftSetupPAge",
        components: {Breadcrumb, ShiftSetupForm, ShiftSetupTable},
        data() {
            return {
                sendToForm:null,
                sendToTable:null,
                pageTitle: 'Add Shift',
            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {
        },
        methods: {
            getFromTable(data){
                this.pageTitle = "Update Shift";
                this.sendToForm = data;
            },
            getFormData(data){
                this.pageTitle = "Add Shift";
                this.sendToTable = data;
            },
            resetTitle(data){
                this.pageTitle = "Add Shift";
                this.sendToForm = null;
            }
        }
    }
</script>
