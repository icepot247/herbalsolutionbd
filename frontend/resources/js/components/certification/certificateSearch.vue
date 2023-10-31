<template>
    <div class="card">
        <div class="card-body">
            <div class="row">
                <div class="offset-xl-4 col-xl-5 offset-md-4 col-md-6 col-sm-12">
                    <div class="row mb-3" >
                        <div class="col-xl-6 col-md-6 col-sm-12">
                            <div class="d-flex flew-row "></div>
                            <label for="queue_no">Lane Queue Number </label>
                            <input type="text" class="form-control" :class="[(v$.queue_no.$error)?'is-invalid':'']"
                                   id="queue_no" v-model="queue_no" name="queue_no"@change="searchForm()">
                            <ul v-if="v$.queue_no.$error" class="parsley-errors-list filled">
                                <li class="parsley-required">The field is required.</li>
                            </ul>

                        </div>
                        <div class="col-xl-6 col-md-6 col-sm-12 mt-4 p-2" v-if="!isLoading">
                            <b-button  variant="primary" @click.prevent="searchForm()">
                                Search
                            </b-button>
                            <a href="/certificates">
                       <button class="btn btn-danger  " @click="resetForm()">Clear</button>
                            </a>
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
                queue_no :'',
                pageTitle:'Check Appointment',
                search_data: [],
                isLoading:false,
            }
        },

        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                queue_no: {required},
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {

            async searchForm() {

                var that =this;
                if (await this.v$.$validate()) {
                    this.isLoading = true;
                    const params = {
                        queue_no: this.queue_no,
                    };
                    this.isLoading=true;
                    var axiosObj = this.axios.get(process.env.MIX_API_URL + '/certificate/view/certificate', {params:params})
                        .then(response => {
                            this.status = true;
                            this.res = response.data.data
                            that.sendToPage(this.status,this.res);
                            this.isLoading=false;


                        })
                        .catch(error => {
                            // that.sendToPage(error);
                            this.status = false;
                            this.$toastr.error(error.response.data.message);
                            this.sendToPage(this.status, error.response.data.message);
                            this.isLoading=false;

                        })
                        .finally(() => {
                            this.isLoading=false;

                        });

                }

            },
            resetForm() {
                this.v$.$reset()
                this.queue_no = null;

            },
            sendToPage(status,data){
                this.$emit('sendToPage',status,data);
            },
        },
        computed:{
        }
    }
</script>

<style lang="scss">

</style>
