<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb v-if="$root.hasAccess('LanePage', 'add') || $root.hasAccess('LanePage', 'edit')"  :title="pageTitle"/>
                    <div class="row">
                        <div class="col-xl-12">
                            <LaneForm v-if="$root.hasAccess('LanePage', 'add') || $root.hasAccess('LanePage', 'edit')" :formPage="sendToForm"  @formData="getFormData"  @resetPageTitle="resetTitle"  />
                            <LaneTable :formUpdated="formData" @sendToPage="getFromTable"/>
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
import LaneForm from "../components/lane/LaneForm";
import LaneTable from "../components/lane/LaneTable";
export default {
    name: 'LanePage',
    components: {LaneTable, Breadcrumb, LaneForm},
    data() {
        return {
            pageTitle:'Add Lane',
            sendToForm:[],
            formData :[],
        }
    },
    created() {
        this.$emit(`update:layout`, DefaultLayout);
    },
    mounted() {},
    methods: {
        getFromTable(data){
            this.pageTitle = 'Edit Lane';
            this.sendToForm = data;
        },
        getFormData(data){
            this.pageTitle = 'Add Lane';
            this.formData  = data;
        },
        resetTitle(data){
            this.pageTitle = 'Add Lane';
            this.sendToForm = null;
        }
    },
    computed: {}
}
</script>
