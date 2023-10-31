<template>
    <div>
        <div class="main-content">

            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb v-if="$root.hasAccess('DeviceSetupPage', 'add') || $root.hasAccess('DeviceSetupPage', 'edit')"   :title="title"/>

                    <div class="row">
                        <div class="col-xl-12">
                            <DeviceSetupForm  v-if="$root.hasAccess('DeviceSetupPage', 'add') || $root.hasAccess('DeviceSetupPage', 'edit')"  :tableData="sendToForm" @formData="getFormData"  @resetPageTitle="resetTitle" />
                            <DeviceSetupTable :formData="sendToTable" @sendToPage="getFromTable" />
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
    import DeviceSetupForm from "../components/deviceSetup/DeviceSetupForm";
    import DeviceSetupTable from "../components/deviceSetup/DeviceSetupTable";
    export default {
        name: "DeviceSetupPAge",
        components: {Breadcrumb,DeviceSetupForm,DeviceSetupTable},
        data() {
            return {
                sendToForm:null,
                sendToTable:null,
                title:'Add Device',
            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {
        },
        methods: {
            getFromTable(data){
                this.title = "Update Device"
                this.sendToForm = data;
            },
            getFormData(data){
                this.title = "Add Device"
                this.sendToTable = data;
            },
            resetTitle(data) {
                this.title = "Add Device"
                this.sendToForm = null;
            }
        },
    }
</script>
