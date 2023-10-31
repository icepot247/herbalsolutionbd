<template>
    <div>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <Breadcrumb :title="pageTitle"/>
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card">
                                <div class="card-body">
                                    <Loader v-show="isLoading" :loading="isLoading" class="mt-4"></Loader>
                                    <div class="accordion" id="accordionMain" v-if="!isLoading && hasCoverageBranch">
                                        <div class="accordion-item" v-for="(branch,index) in centerInfo.coverages"
                                             :key="index">
                                            <h2 class="accordion-header" id="headingOne">
                                                <button class="accordion-button fw-medium collapsed" type="button"
                                                        data-bs-toggle="collapse"
                                                        :data-bs-target="'#collapseOne'+index" aria-expanded="false"
                                                        aria-controls="collapseOne"
                                                >
                                                    <h6> Branch: {{branch.branch_name}}</h6>
                                                </button>
                                            </h2>
                                            <div :id="'collapseOne'+index" class="accordion-collapse collapse"
                                                 aria-labelledby="headingOne"
                                                 data-bs-parent="#accordionMain" style="">
                                                <div class="accordion-body">
                                                    <h6>Inspectors</h6>
                                                    <b-list-group>
                                                        <b-list-group-item :key="index"
                                                                           v-for="(item, index) in inspectorList[branch.branch_id]">
                                                            <b-form-checkbox
                                                                :checked="inspectors"
                                                                :value="item.value"
                                                                unchecked-value="not_accepted"
                                                                v-model="inspectors"
                                                                @change="updateInspector(item.value, branch.branch_id)"
                                                            >
                                                                {{item.text}}
                                                            </b-form-checkbox>
                                                        </b-list-group-item>
                                                    </b-list-group>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div v-if="!isLoading && !hasCoverageBranch">
                                        <h6 class="text-danger text-center">There is no coverage branch found.</h6>
                                    </div>
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
    import Breadcrumb from "../components/common/Breadcrumb";
    import DefaultLayout from "../layouts/DefaultLayout";
    import Loader from "../components/common/Loader";

    export default {
        name: "Inspectors",
        components: {Loader, Breadcrumb},
        data() {
            return {
                pageTitle: 'Center Inspectors',
                isLoading: false,
                centerInfo: [],
                inspectorList: [],
                inspectorListData: [],
                inspectors: [],
                hasCoverageBranch: true
            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        mounted() {
            this.showInspectors();
        },
        methods: {
            showInspectors() {
                this.isLoading = true
                // this.axios.get(process.env.MIX_API_URL + '/center/18' , {})
                this.axios.get(process.env.MIX_API_URL + '/center/' + this.$store.getters.getUser.data.center_id, {})
                    .then(response => {
                            this.centerInfo = (response.status) ? response.data.data : [];
                            if (this.centerInfo.coverages.length > 0) {
                                for (let i in this.centerInfo.coverages) {
                                    this.getInspectors(this.centerInfo.coverages[i].branch_id);
                                }
                                this.hasCoverageBranch = true
                            } else {
                                this.hasCoverageBranch = false
                            }
                    })
                    .catch(error => {
                        this.isLoading = false;
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            },
            getInspectors(branchId) {
                this.isLoading = true;
                this.axios
                    .get(process.env.MIX_API_URL + '/common/brta-branch-inspectors/' + branchId, {})
                    .then(response => {
                        this.isLoading = false;
                        const res = response.data;
                        if (res.status) {
                            this.inspectorList[branchId] = [];
                            this.inspectorListData[branchId] = [];
                            for (let i in res.data) {
                                this.inspectorListData[branchId].push(res.data[i]);
                                this.inspectorList[branchId].push({
                                    text: res.data[i].employeeName,
                                    value: res.data[i].employeeId
                                },);
                            }
                            if (this.centerInfo.coverages) {
                                for (let b in this.centerInfo.coverages) {
                                    if (this.centerInfo.coverages[b].inspectors) {
                                        for (let i in this.centerInfo.coverages[b].inspectors) {
                                            this.inspectors.push(this.centerInfo.coverages[b].inspectors[i].brta_employee_id);
                                        }
                                    }
                                }
                            }
                        }
                    })
                    .catch(error => {
                        this.isLoading = false;
                        // this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                        this.isLoading = false;
                        this.$forceUpdate();

                    });
            },
            updateInspector(brtaEmpId, branchId) {
                if (brtaEmpId.length > 0 && this.inspectorListData[branchId]) {
                    let selectedBrtaInspector = this.inspectorListData[branchId].filter(i => i.employeeId === brtaEmpId);
                    if (selectedBrtaInspector) {
                        let params = {
                            'branch_id': branchId,
                            'designation_id': selectedBrtaInspector[0].designationId,
                            'name': selectedBrtaInspector[0].employeeName,
                            'login_id': selectedBrtaInspector[0].loginName,
                            'brta_employee_id': selectedBrtaInspector[0].employeeId,
                        }
                        this.axios
                            .post(process.env.MIX_API_URL + '/center/inspector/' + this.centerInfo.center_id, params)
                            .then(response => {
                                var res = response.data;
                                if (res.status) {
                                    this.$toastr.success(res.message);
                                    // this.showInspectors();
                                }
                                this.isLoading = false;
                            })
                            .catch(error => {
                                this.$toastr.error(error.response.data.message);
                                this.isLoading = false;
                            })
                            .finally(() => {
                                this.isLoading = false;
                            });
                    }
                } else {
                    this.$toastr.error('Invalid BRTA Inspector');
                }
            },
        },
    }
</script>

