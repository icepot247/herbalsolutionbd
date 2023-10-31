<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb
                        v-if="($root.hasAccess('InventoryPage', 'add') || $root.hasAccess('InventoryPage', 'edit')) &&( userTypeId !=1)"
                        :title="pageTitle"/>
                    <div class="row">
                        <InventoryForm
                            v-if="$root.hasAccess('InventoryPage', 'add') || $root.hasAccess('InventoryPage', 'edit')"
                            @formUpdated="getModifiedData" @resetPageTitle="resetTitle" :formPage="sendToForm"/>
                        <InventoryTable :formUpdated="formModified" @sendToPage="getFromTable"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import DefaultLayout from "../layouts/DefaultLayout";
    import Breadcrumb from "../components/common/Breadcrumb";
    import InventoryForm from "../components/inventory/InventoryForm";
    import InventoryTable from "../components/inventory/InventoryTable";

    export default {
        name: 'InventoryPage',
        components: {Breadcrumb, InventoryForm, InventoryTable},
        data() {
            return {
                pageTitle: 'Add Inventory',
                sendToForm: [],
                formModified: [],
                userTypeId: this.$store.getters.getUser.data.user_type_id,
            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {

        },
        methods: {
            getFromTable(data) {
                this.pageTitle = 'Edit Inventory';
                this.sendToForm = data;
            },
            getModifiedData(data) {
                this.pageTitle = 'Add Inventory';
                this.formModified = data;
            },
            resetTitle(data) {
                this.pageTitle = 'Add Inventory';
                this.sendToForm = null;
            }
        },
        computed: {}
    }
</script>
