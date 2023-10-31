<template>
    <div>
        <div class="main-content">

            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb :title="pageTitle"/>
                    <div class="row">
                        <div class="col-xl-12">
                            <resultSearch @sendToPage="getFromTable"/>
                            <fitnesscheckData :statuss="showResult" :resData="searchdata"/>
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
    import resultSearch from "../components/resultPublishing/resultSearch";
    import fitnesscheckData from "../components/resultPublishing/fitnesscheckData";

    export default {
        name: 'ResultPage',
        components: {resultSearch, Breadcrumb,fitnesscheckData},
        data() {
            return {
                pageTitle: 'Result Publishiing',
                searchdata: [],
                showResult:false
            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {
        },
        methods: {
            getFromTable(status,data){
                this.showResult = status;
                this.searchdata = data;
            }


        },
        computed: {}
    }
</script>

<style lang="scss">

</style>

