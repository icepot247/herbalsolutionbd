<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb v-if="$root.hasAccess('BoothPage', 'add') || $root.hasAccess('BoothPage', 'edit')" :title="pageTitle"/>
                    <div class="row">
                        <div class="col-xl-12">
                            <BoothForm v-if="$root.hasAccess('BoothPage', 'add') || $root.hasAccess('BoothPage', 'edit')" :formPage="sendToForm"  @formData="getFormData" @resetPageTitle="resetTitle"/>
                            <BoothTable :formUpdated="formData" @sendToPage="getFromTable"/>
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
import BoothForm from "../components/booth/BoothForm";
import BoothTable from "../components/booth/BoothTable";
export default {
    name: 'BoothPage',
    components: {Breadcrumb, BoothForm, BoothTable},
    data() {
        return {
            pageTitle: 'Add Booth',
            sendToForm: [],
            formData :[]
        }
    },
    created() {
        this.$emit(`update:layout`, DefaultLayout);
    },
    mounted() {},
    methods: {
        getFromTable(data) {
            this.pageTitle = 'Edit Booth';
            this.sendToForm = data;
        },
        getFormData(data){
            this.pageTitle = 'Add Booth';
            this.formData  = data;
        },
        resetTitle(data){
            this.pageTitle = 'Add Booth';
            this.sendToForm = null;
        }
    },
    computed: {}
}
</script>


