<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb :title="pageTitle"/>
                    <div class="row">
                        <div class="col-xl-12">
                            <ClassTable />
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
import ClassTable from "../components/classMapping/ClassTable";

export default {
    name: 'ClassMappingPage',
    components: {Breadcrumb,  ClassTable},
    data() {
        return {
            pageTitle: 'Vehicle Class Mapping',
            sendToForm: [],
            formData :[]
        }
    },
    created() {
        this.$emit(`update:layout`, DefaultLayout);
    },
    mounted() {
    },
    methods: {
        getFromTable(data) {
            this.pageTitle = 'Edit Booth';
            this.sendToForm = data;
        },
        getFormData(data){
            this.formData  = data;
        }
    },
    computed: {}
}
</script>

<style lang="scss">

</style>

