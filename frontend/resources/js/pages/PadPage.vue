<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb :title="pageTitle"/>
                    <div class="row">
                        <div class="col-xl-12">
<!--                            <PadSearch :formPage="sendToForm"  @formData="getFormData"/>-->
                            <PadTable :formUpdated="formData" @sendToPage="getFromTable" />
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
    import PadSearch from "../components/pad/padSearch";
    import PadTable from "../components/pad/padTable";


    export default {
        name: "PadPage",
        components: {Breadcrumb, PadSearch, PadTable},
        data() {
            return {
                pageTitle: 'Certificate Page Cancel',
                formData : [],
                sendToForm : [],
            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {},
        methods: {
            getFromTable(data) {
                this.sendToForm = data;
            },
            getFormData(data){
                this.formData  = data;
            }

        },
        computed: {}
    }
</script>

