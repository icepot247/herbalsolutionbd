<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb v-if="$root.hasAccess('RolePage', 'add') || $root.hasAccess('RolePage', 'edit')"
                                :title="pageTitle"/>

                    <!-- Start content -->
                    <div class="row">
                        <RoleForm v-if="$root.hasAccess('RolePage', 'add') || $root.hasAccess('RolePage', 'edit')"
                                  @formUpdated="getModifiedData" :formPage="sendToForm" @resetPageTitle="resetTitle"/>
                        <RoleTable :formUpdated="formModified" @sendToPage="getFromTable"/>
                    </div>
                    <!-- end content -->

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import DefaultLayout from "../layouts/DefaultLayout";
    import Breadcrumb from "../components/common/Breadcrumb";
    import RoleForm from "../components/role/RoleForm";
    import RoleTable from "../components/role/RoleTable";

    export default {
        name: 'RolePage',
        components: {Breadcrumb, RoleForm, RoleTable},
        data() {
            return {
                pageTitle: 'Add Role',
                sendToForm: [],
                formModified: [],
            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {

        },
        methods: {
            getFromTable(data) {
                this.pageTitle = 'Edit Role';
                this.sendToForm = data;
            },
            getModifiedData(data) {
                this.pageTitle = 'Add Role';
                this.formModified = data;
            },
            resetTitle(data) {
                this.pageTitle = 'Add Role';
                this.sendToForm = null;
            }
        },
        computed: {}
    }
</script>

<style lang="scss">

</style>

