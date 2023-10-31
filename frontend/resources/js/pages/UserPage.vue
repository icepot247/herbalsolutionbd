<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb v-if="$root.hasAccess('UserPage', 'add') || $root.hasAccess('UserPage', 'edit')"  :title="pageTitle"/>
                    <div class="row">
                        <div class="col-xl-12">
                            <UserForm  v-if="$root.hasAccess('UserPage', 'add') || $root.hasAccess('UserPage', 'edit')"  @formUpdated="getModifiedData" :formPage="sendToForm"  @resetPageTitle="resetTitle" />
                            <UserTable :formUpdated="formModified"   @sendToPage="getFromTable"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import DefaultLayout from "../layouts/DefaultLayout";
    import Breadcrumb from "../components/common/Breadcrumb";
    import UserForm from "../components/users/UserForm";
    import UserTable from "../components/users/UserTable";
    export default {
        name: 'UserPage',
        components: {Breadcrumb, UserForm, UserTable},
        data() {
            return {
                pageTitle: 'Add User',
                sendToForm:[],
                formModified : [],
            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {
        },
        methods: {
            getFromTable(data){
                this.pageTitle = 'Update User';
                this.sendToForm = data;
            },
            getModifiedData(data){
                this.formModified = data ;
            },
            resetTitle(data){
                this.pageTitle = "Add User";
                this.sendToForm = null;
            }
        },
        computed:{
        }
    }
</script>
