<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb title="Role"/>

                    <!-- Start content -->
                    <div class="row">
                        <RoleWiseMenuForm @formUpdated="getModifiedData" :formPage="sendToForm"/>
                        <RoleWiseMenuTable :formUpdated="formModified"  @sendToPage="getFromTable"/>
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
    import RoleWiseMenuForm from "../components/role/RoleWiseMenuForm";
    import RoleWiseMenuTable from "../components/role/RoleWiseMenuTable";

    export default {
        name: 'RolePage',
        components: {Breadcrumb,RoleWiseMenuForm, RoleWiseMenuTable},
        data() {
            return {
                pageTitle:'Add Role',
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
                this.pageTitle = 'Edit Role';
                this.sendToForm = data;
            },
            getModifiedData(data){
            this.formModified = data ;
            }
        },
        computed:{
        }
    }
</script>

<style lang="scss">

</style>

