<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb  v-if="$root.hasAccess('ShiftManagementPage', 'add') || $root.hasAccess('ShiftManagementPage', 'edit')"  title="Shift Management"/>
                    <div class="row">
                        <div class="col-xl-12">
                            <ShiftManagementForm  v-if="$root.hasAccess('ShiftManagementPage', 'add') || $root.hasAccess('ShiftManagementPage', 'edit')"   :tableData="sendToForm" @formData="getFormData" />
                            <ShiftManagementTable :formData="sendToTable" @sendToPage="getFromTable" />
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
    import ShiftManagementForm from "../components/shiftManagement/ShiftManagementForm";
    import ShiftManagementTable from "../components/shiftManagement/ShiftManagementTable";
    export default {
        name: "ShiftSetupPAge",
        components: {Breadcrumb, ShiftManagementForm, ShiftManagementTable},
        data() {
            return {
                sendToForm:null,
                sendToTable:null,
            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {},
        methods: {
            getFromTable(data){
                this.sendToForm = data;
            },
            getFormData(data){
                this.sendToTable = data;
            }
        },
        computed: {}
    }
</script>
