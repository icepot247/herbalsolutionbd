<template>
    <div>
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-12 col-sm-12">
                        <div class="row">

                            <div class="col-md-3 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label">Center</label> <span
                                    class="text-danger">*</span>
                                    <b-form-select v-model="center_id" class="form-select"
                                                   :options="centerOptions" :class="[(v$.center_id.$error)?'is-invalid':'']">
                                    </b-form-select>
                                    <ul v-if="v$.center_id.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="col-md-3 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label">Test Type</label> <span
                                    class="text-danger">*</span>
                                    <b-form-select v-model="testType" class="form-select"
                                                   :options="selectOptions"
                                                   :class="[(v$.testType.$error)?'is-invalid':'']">
                                    </b-form-select>
                                    <ul v-if="v$.testType.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-3 col-xm-12">
                                <div class="mb-3">
                                    <label class="form-label">Sub Test Type </label> <span
                                    class="text-danger">*</span>
                                    <b-form-select v-model="subTestType" class="form-select"
                                                   :options="selectOptions"
                                                   :class="[(v$.subTestType.$error)?'is-invalid':'']">
                                    </b-form-select>
                                    <ul v-if="v$.subTestType.$error" class="parsley-errors-list filled">
                                        <li class="parsley-required">The field is required.</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-xl-1 col-md-1 col-sm-12 mt-4 p-2">
                                <div class="mb-3">
                                    <button v-if="!isLoading" class="btn btn-primary float-end"
                                            type="button" @click.prevent="submitForm()">Search
                                    </button>


                                </div>
                            </div>

                        </div>
                    </div>


                </div>


                <div>


                    <button v-if="isLoading" class="btn btn-primary float-end" type="button">
                        <div class="spinner-border" style="height: 1rem !important; width: 1rem !important;">
                            <span class="visually-hidden">Processing...</span>
                        </div>
                    </button>
                </div>
            </div>
            <!-- end card body -->
        </div>
    </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import {required} from "@vuelidate/validators";

export default {
    name: 'ItemForm',
    props: ['formPage'],
    data() {
        return {
            center_id: null,
            testType: null,
            subTestType: null,
            isLoading: false,
            centerOptions: [
                {value: null, text: 'Select one'},
                {value: 'Y', text: '1'},
                {value: 'N', text: '2'},
            ],

            selectOptions: [
                {text: "Select one", value: null},
                {text: "Yes", value: "Y"},
                {text: "No", value: "N"},
            ],
        }
    },
    setup() {
        return {v$: useVuelidate()}
    },
    mounted() {

    },

    validations() {
        return {
            center_id: {required},
            testType: {required},
            subTestType: {required},
        }
    },
    methods: {


        resetForm() {

            this.type = null;
            this.testType = null;
            this.subTestType = null;
        },
    }
}
</script>
