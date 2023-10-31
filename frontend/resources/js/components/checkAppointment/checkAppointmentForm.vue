<template>
    <div class="card">
        <div class="card-body">
            <div class="row">
                <div class="offset-xl-4 col-xl-5 offset-md-4 col-md-6 col-sm-12">
                    <div class="row mb-3">
                        <div class="col-xl-6 col-md-6 col-sm-12">
                            <div class="d-flex flew-row "></div>
                            <label for="appointment_id">Appointment Number</label>
                            <input type="number" class="form-control"
                                   :class="[(v$.appointment_id.$error)?'is-invalid':'']"
                                   id="appointment_id" v-model="appointment_id" name="appointment_id">
                            <ul v-if="v$.appointment_id.$error" class="parsley-errors-list filled">
                                <li class="parsley-required">The field is required.</li>
                            </ul>
                        </div>
                        <div class="col-xl-6 col-md-6 col-sm-12 mt-4 p-2" v-if="!isLoading">
                            <b-button variant="primary" @click.prevent="searchForm()">
                                Search
                            </b-button>
                            <button class="btn btn-danger " @click="resetForm()">Clear</button>
                        </div>

                        <div class="col-md-3 col-xm-12" v-if="isLoading">
                            <Loader class="col-12 mt-5" :loading="isLoading"></Loader>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    </div>
</template>
<script>
    import useVuelidate from '@vuelidate/core'
    import {required} from '@vuelidate/validators'
    import Loader from "../common/Loader";

    export default {
        components: {Loader},
        data() {
            return {
                appointment_id: '',
                pageTitle: 'Check Appointment',
                status: true,
                isLoading: false,
                paymentStatus: false
            }
        },

        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                appointment_id: {required},
            }
        },

        methods: {

            async searchForm() {
                var that = this;
                // that.sendToPage(false, '')
                if (await this.v$.$validate()) {
                    this.isLoading = true;
                    await this.axios.get(process.env.MIX_API_URL + '/appointment/check', {params: {  appointment_id: this.appointment_id }})
                        .then(response => {
                            that.sendToPage(true, response)
                            this.isLoading = false;
                        })
                        .catch(error => {
                            // this.$toastr.error(error.response.data.message)
                            this.sendToPage(false, error.response.data.message);
                            this.isLoading = false;
                        })
                        .finally(() => {
                            this.isLoading = false;
                        });
                }
            },
            resetForm() {
                this.v$.$reset()
                this.appointment_id = null;
                this.sendToPage(false,null)
            },

            sendToPage(status, data) {
                this.$emit('sendToPage', status, data);
            },
        },
        computed: {}
    }
</script>

<style lang="scss">

</style>
