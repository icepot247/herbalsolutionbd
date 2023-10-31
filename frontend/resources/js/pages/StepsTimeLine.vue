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
                                    <div class="row">
                                        <div class="offset-xl-4 col-xl-5 offset-md-4 col-md-6 col-sm-12">
                                            <div class="row mb-3">
                                                <div class="col-xl-6 col-md-6 col-sm-12">
                                                    <div class="d-flex flew-row "></div>
                                                    <label>Lane Queue Number</label>
                                                    <input type="number" min="0" class="form-control"
                                                           :class="[(v$.que_id.$error)?'is-invalid':'']"
                                                           v-model="que_id" name="QUE_ID" @change="getTimeLine">
                                                    <ul v-if="v$.que_id.$error" class="parsley-errors-list filled">
                                                        <li class="parsley-required">The field is required.</li>
                                                    </ul>
                                                </div>
                                                <div class="col-xl-6 col-md-6 col-sm-12 mt-4 p-2">
                                                    <b-button v-if="!isLoading" variant="primary" @click.prevent="getTimeLine">
                                                        Search
                                                    </b-button>
                                                    <button class="btn btn-danger " @click="resetForm">Clear</button>
                                                </div>

                                                <div v-if="isLoading" class="col-md-3 col-xm-12">
                                                    <Loader class="col-12 mt-5" :loading="isLoading"></Loader>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                        <div v-if="stepItems.inspection_steps " class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="text-center">
                                        <p class="step-start-finish-point rounded bg-success mb-0 text-white font-weight-500">
                                            <span class="border-bottom font-weight-bold"> {{stepItems.registration_no}} </span><span>Lane No. : {{stepItems.lane_no}}</span>,<span>Queue No. : {{stepItems.queue_no}}</span>
                                        </p>
                                    </div>
                                    <div v-for="(value ,key) in stepItems.inspection_steps" :key="key" class="main-timeline-4 text-white"
                                         :class="(key==0)?'mt-2':''">
                                        <div
                                            :class="((((key+1)%2 ==0)?'right-4 ' : 'left-4 ')+((value.perform_yn=='Y')?' timeline-success-4':' timeline-failed-4'))">
                                            <div
                                                :class="((key+1)%2 ==0)?'card gradient-custom-4 border-0 ': 'card gradient-custom border-0'">
                                                <div class="card-body p-3">
                                                    <!--                                                    <i :class="(value.perform_yn=='Y')?'fas fa-check-circle fa-2x mb-3' : 'fas fa-times-circle fa-2x mb-3' "></i>-->
                                                    <p class=" text-white mb-0">
                                                        <span class="text-white "> <strong >Step No. {{value.steps_sequence}}</strong> : {{value.test_step.test_steps_name}}</span>
                                                        <span class="small float-right text-center"> {{(value.perform_time)?mixinFormatDate(value.perform_time) : ''}}  
                                                            {{(value.perform_time)?mixinFormatTime(value.perform_time,'') : ''}}
                                                            <!-- {{(value.perform_time)}} -->
                                                        </span>
                                                    </p>
<!--                                                    <p class="mb-0">-->
<!--                                                        <span>Lane No. : {{stepItems.lane_no}}</span>-->
<!--                                                        <span class="small float-right text-center"> {{(value.perform_time)?mixinFormatDate(value.perform_time) : ''}}  {{(value.perform_time)?mixinFormatTime(value.perform_time) : ''}}</span>-->
<!--                                                    </p>-->

                                                    <!--                                                    <p class="h4 text-white">{{value.test_step.test_steps_name}}</p>-->
                                                    <!--                                                    <p class="h6 text-white">{{value.registration_no}} {{(value.perform_time)?mixinFormatDate(value.perform_time) : ''}}  {{(value.perform_time)?mixinFormatTime(value.perform_time) : ''}} </p>-->
                                                    <!--                                                    <p class="h6 text-white">{{(value.perform_time)?mixinFormatDate(value.perform_time) : ''}}  {{(value.perform_time)?mixinFormatTime(value.perform_time) : ''}} </p>-->
                                                    <!--                                                    <p class="small text-white mb-2">{{(value.perform_time)?mixinFormatTime(value.perform_time) : ''}}</p>-->
                                                    <!--                                                    <p class="small text-white-80 mb-2">{{(value.perform_time)?mixinFormatDate(value.perform_time) : ''}}</p>-->
                                                    <!--                                                    <h6 :class="(value.perform_yn=='Y')? 'badge bg-success text-white mb-0 p-2' : 'badge bg-danger text-white mb-0 p-2' ">{{(value.perform_yn=='Y')?'Completed':'Incomplete'}}</h6>-->
                                                </div>
                                            </div>
                                        </div>
                                    </div>
<!--                                    <div class="text-center">-->
<!--                                        <p class="finish-point rounded-circle bg-light border mx-auto font-weight-500 border-dark">-->
<!--                                            Finish</p>-->
<!--                                    </div>-->

                                </div>
                            </div>
                        </div>
                        <div v-if="isEmpty">
                            <div class="card">
                                <div class="card-body">
                                    <div class="col-md-12">
                                        <p class="h3 text-danger text-center">No Data Found</p>
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
    import useVuelidate from "@vuelidate/core";
    import {required} from "@vuelidate/validators";
    import Breadcrumb from "../components/common/Breadcrumb";
    import DefaultLayout from "../layouts/DefaultLayout";
    import Loader from "../components/common/Loader";
    import {dateTimeFormatterMixin} from "../mixins/dateTimeFormatterMixin";

    export default {
        name: "StepsTimeLine",
        components: {Breadcrumb, Loader},
        mixins: [dateTimeFormatterMixin],
        data() {
            return {
                pageTitle: 'Inspection Timeline',
                isLoading: false,
                que_id: null,
                stepItems: [],
                isEmpty: false,
            }
        },
        created() {
            this.$emit(`update:layout`, DefaultLayout);
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                que_id: {required},
            }
        },
        methods: {
            getTimeLine() {
                this.v$.$validate()
                if (!this.v$.que_id.$error) {
                    this.isLoading = true;
                    this.axios.get(process.env.MIX_API_URL + '/steps-timeline/' + this.que_id)
                        .then(response => {
                            this.stepItems = (response.status) ? response.data.data : [];
                            this.isEmpty = (this.stepItems.length <= 0);
                            this.isLoading = false;
                        })
                        .catch(error => {
                            // this.$toastr.error(error.message);
                            this.stepItems = [];
                            this.isEmpty = true;
                            this.isLoading = false;
                        })
                        .finally(() => {
                            this.isLoading = false;
                        });
                }
            },
            resetForm() {
                this.stepItems = [];
                this.que_id = null;
                this.v$.$reset()
            }
        }
    }
</script>

<style>
    /*
*
*   Timeline style
*/

    /* The actual timeline (the vertical ruler) */
    .main-timeline-4 {
        position: relative;
    }

    /* The actual timeline (the vertical ruler) */
    .main-timeline-4::after {
        content: "";
        position: absolute;
        width: 3px;
        background-color: #bbb;
        top: -8px;
        bottom: 0;
        left: 50%;
        margin-left: -3px;
    }

    /* Container around content */
    .timeline-4 {
        position: relative;
        background-color: inherit;
        width: 50%;
    }

    /* Container around content */
    .timeline-success-4 {
        position: relative;
        background-color: inherit;
        width: 50%;
    }

    /* Container around content */
    .timeline-failed-4 {
        position: relative;
        background-color: inherit;
        width: 50%;
    }

    /* The circles on the timeline */
    .timeline-4::after {
        content: "";
        position: absolute;
        width: 25px;
        height: 25px;
        right: -11px;
        background-color: #bbb;
        top: 15px;
        border-radius: 50%;
        z-index: 1;
    }

    /* The circles on the timeline (Success) */
    .timeline-success-4::after {
        content: "";
        position: absolute;
        width: 30px;
        height: 30px;
        right: -14px;
        background-color: #41df1d;
        top: 13px;
        border-radius: 50%;
        z-index: 1;
    }

    /* The circles on the timeline (Success) */
    .timeline-failed-4::after {
        content: "";
        position: absolute;
        width: 30px;
        height: 30px;
        right: -14px;
        background-color: #d20d0d;
        top: 13px;
        border-radius: 50%;
        z-index: 1;
    }

    /* Place the container to the left */
    .left-4 {
        padding: 0px 40px 20px 0px;
        left: 0;
    }

    /* Place the container to the right */
    .right-4 {
        padding: 0px 0px 20px 40px;
        left: 50%;
    }

    /* Add arrows to the left container (pointing right) */
    .left-4::before {
        content: " ";
        position: absolute;
        top: 18px;
        z-index: 1;
        right: 30px;
        border: medium solid rgba(37, 117, 252, 1);
        border-width: 10px 0 10px 10px;
        border-color: transparent transparent transparent rgba(37, 117, 252, 1);
    }

    /* Add arrows to the right container (pointing left) */
    .right-4::before {
        content: " ";
        position: absolute;
        top: 18px;
        z-index: 1;
        left: 30px;
        border: medium solid rgba(245, 87, 108, 1);
        border-width: 10px 10px 10px 0;
        border-color: transparent rgba(245, 87, 108, 1) transparent transparent;
    }

    /* Fix the circle for containers on the right side */
    .right-4::after {
        left: -16.5px;
    }

    .gradient-custom {
        /* fallback for old browsers */
        background: #6a11cb;

        /* Chrome 10-25, Safari 5.1-6 */
        background: -webkit-linear-gradient(
            to right,
            rgba(106, 17, 203, 1),
            rgba(37, 117, 252, 1)
        );

        /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        background: linear-gradient(
            to right,
            rgba(106, 17, 203, 1),
            rgba(37, 117, 252, 1)
        );
    }

    .gradient-custom-4 {
        /* fallback for old browsers */
        background: #f093fb;

        /* Chrome 10-25, Safari 5.1-6 */
        background: -webkit-linear-gradient(
            to left,
            rgba(240, 147, 251, 1),
            rgba(245, 87, 108, 1)
        );

        /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        background: linear-gradient(
            to left,
            rgba(240, 147, 251, 1),
            rgba(245, 87, 108, 1)
        );
    }

    .step-start-finish-point {
        width: 240px;
        padding: 5px;
        margin:auto;

    }
    .finish-point {
        width: 77px;
        height: 77px;
        padding: 5px;
        padding-top: 1.5rem !important;

    }

    /* Media queries - Responsive timeline on screens less than 600px wide */
    @media screen and (max-width: 600px) {
        /* Place the timelime to the left */
        .main-timeline-4::after {
            left: 31px;
        }

        /* Full-width containers */
        .timeline-4 {
            width: 100%;
            padding-left: 70px;
            padding-right: 25px;
        }

        /* Full-width containers */
        .timeline-success-4 {
            width: 100%;
            padding-left: 70px;
            padding-right: 25px;
        }

        /* Full-width containers */
        .timeline-failed-4 {
            width: 100%;
            padding-left: 70px;
            padding-right: 25px;
        }

        /* Make sure that all arrows are pointing leftwards */
        .timeline-4::before {
            left: 60px;
            border: medium solid white;
            border-width: 10px 10px 10px 0;
            border-color: transparent white transparent transparent;
        }

        /* Make sure that all arrows are pointing leftwards */
        .timeline-success-4::before {
            left: 60px;
            border: medium solid white;
            border-width: 10px 10px 10px 0;
            border-color: transparent white transparent transparent;
        }

        /* Make sure that all arrows are pointing leftwards */
        .timeline-failed-4::before {
            left: 60px;
            border: medium solid white;
            border-width: 10px 10px 10px 0;
            border-color: transparent white transparent transparent;
        }

        /* Make sure all circles are at the same spot */
        .left-4::after,
        .right-4::after {
            left: 15px;
        }

        .left-4::before {
            right: auto;
        }

        /* Make all right containers behave like the left ones */
        .right-4 {
            left: 0%;
        }

        .step-start-finish-point {
            margin-left: 0px !important;
        }
        .finish-point {
            width: 62px !important;
            height: 62px !important;
            padding: 5px !important;
            padding-top: 15px !important;
            float: left;

        }
    }

</style>
