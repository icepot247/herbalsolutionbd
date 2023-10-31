<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb :title="pageTitle"/>

                    <!-- Start content -->
                    <div class="row">
                        <AppointmentForm @formUpdated="getModifiedData" :formPage="sendToForm"/>
                        <AppointmentTable :formUpdated="formModified"  @sendToPage="getFromTable"/>
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
    import AppointmentForm from "../components/appointment/AppointmentForm";
    import AppointmentTable from "../components/appointment/AppointmentTable";

    export default {
        name: 'AppointmentPage',
        components: {Breadcrumb,AppointmentForm, AppointmentTable},
        data() {
            return {
                pageTitle:'Create a new appointment',
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
                this.pageTitle = 'Edit Appointment';
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

