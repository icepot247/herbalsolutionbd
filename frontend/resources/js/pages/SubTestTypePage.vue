<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
<!--                    <Breadcrumb v-if="$root.hasAccess('SubTestTypePage', 'add') || $root.hasAccess('SubTestTypePage', 'edit')"  :title="pageTitle"/>-->
                    <div class="row">
                        <div class="col-xl-12">
<!--                            <SubTestForm  v-if="$root.hasAccess('SubTestTypePage', 'add') || $root.hasAccess('SubTestTypePage', 'edit')"  @formUpdated="getModifiedData" :formPage="sendToForm"  :sendForm="sendDataPage"  @resetPageTitle="resetTitle" />-->
                            <SearchDataForm :formUpdated="formModified" @sendToPage="getFromTable" @sendDataPage="getEditData"/>
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
import SubTestForm from "../components/subTestType/SubTestForm";
import SearchDataForm from "../components/subTestType/SearchDataForm";
export default {
    name: 'SubTestPage',
    components: {Breadcrumb, SubTestForm, SearchDataForm},
    data() {
        return {
            pageTitle: '',
            sendToForm: [],
            formModified:[],
            sendDataPage:[],
            status:true,
        }
    },
    created() {
        this.$emit(`update:layout`, DefaultLayout);
    },
    mounted() {
    },
    methods: {
        getFromTable(data){
            this.sendToForm = data;
        },
        getEditData(status,res){
            // this.pageTitle = 'Edit Sub Type';
            this.status = status;
            this.sendDataPage = res;
        },
        getModifiedData(data){
            this.formModified = data ;
        },
        resetTitle(data){
            // this.pageTitle = "Add Sub Type";
            this.sendToForm = null;
        }
    },
    computed: {}
}
</script>

<style lang="scss">

</style>

