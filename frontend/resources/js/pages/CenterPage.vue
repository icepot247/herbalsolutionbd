<template>
    <div>
        <div class="main-content">

            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb :title="pageTitle"  v-if="$root.hasAccess( 'CenterPage', 'add') || $root.hasAccess( 'CenterPage', 'edit')"/>
                    <div class="row">
                        <div class="col-xl-12">
                            <CenterForm @formUpdated="getModifiedData"  @resetPageTitle="resetTitle" :formPage="sendToForm"  v-if="$root.hasAccess( 'CenterPage', 'add') || $root.hasAccess( 'CenterPage', 'edit')" />
                            <CenterTable :formUpdated="formModified" @sendToPage="getFromTable"/>
                        </div>
                    </div>
                    <div id="coverage-modal" class="modal" tabindex="-1" aria-labelledby="coverageLabel"
                         aria-modal="true"
                         role="dialog">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="coverageLabel">Default Modal Heading</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <h5>Coverage</h5>

                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary waves-effect"
                                            data-bs-dismiss="modal">
                                        Close
                                    </button>
                                    <button type="button" class="btn btn-primary waves-effect waves-light">Save changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="inspector-modal" class="modal" tabindex="-1" aria-labelledby="myModalLabel"
                         aria-modal="true"
                         role="dialog">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="inspectorLabel">Default Modal Heading</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <h5>Inspector</h5>

                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary waves-effect"
                                            data-bs-dismiss="modal">
                                        Close
                                    </button>
                                    <button type="button" class="btn btn-primary waves-effect waves-light">Save changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="type-modal" class="modal" tabindex="-1" aria-labelledby="typeLabel" aria-modal="true"
                         role="dialog">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="typeLabel">Default Modal Heading</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <h5>Test Type</h5>

                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary waves-effect"
                                            data-bs-dismiss="modal">
                                        Close
                                    </button>
                                    <button type="button" class="btn btn-primary waves-effect waves-light">Save changes
                                    </button>
                                </div>
                            </div>
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
    import CenterForm from "../components/center/CenterForm";
    import CenterTable from "../components/center/CenterTable";

    export default {
        name: 'CenterPage',
        components: {CenterTable, Breadcrumb, CenterForm},
        data() {
            return {
                pageTitle: 'Add Center',
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
                this.pageTitle = 'Edit Center';
                this.sendToForm = data;
            },
            getModifiedData(data) {
                this.pageTitle = 'Add Center';
                this.formModified = data;
            },
            resetTitle(data){
                this.pageTitle = 'Add Center';
                this.sendToForm = null;
            }
        },
        computed: {}
    }
</script>

<style lang="scss">

</style>

