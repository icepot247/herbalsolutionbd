<template>
    <div :class="styleClass">
        <p class="h5">{{titleText}}</p>
        <Loader :loading="isLoading"></Loader>
        <BarChartGenerator
            v-if="!isLoading"
            :chart-options="chartOptions"
            :chart-data="chartData"
            :chart-id="chartId"
            :dataset-id-key="datasetIdKey"
            :plugins="plugins"
            :css-classes="cssClasses"
            :styles="styles"
            :width="width"
            :height="height"
        />
    </div>
</template>

<script>
    import {Bar as BarChartGenerator} from 'vue-chartjs/legacy'
    import Loader from "../common/Loader";

    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        BarElement,
        LinearScale,
        CategoryScale,
        PointElement
    } from 'chart.js'

    ChartJS.register(
        Title,
        Tooltip,
        Legend,
        BarElement,
        LinearScale,
        CategoryScale,
        PointElement
    )

    export default {
        name: "BarChart",
        components: {
            BarChartGenerator,
            Loader
        },
        props: {
            chartId: {
                type: String,
                default: 'bar-chart'
            },
            datasetIdKey: {
                type: String,
                default: 'label'
            },
            width: {
                type: Number,
                default: 300
            },
            height: {
                type: Number,
                default: 330
            },
            cssClasses: {
                default: '',
                type: String
            },
            styles: {
                type: Object,
                default: () => {
                }
            },
            plugins: {
                type: Object,
                default: () => {},
            },
            styleClass: {
                type: String,
                default: 'col-md-6'
            },
        },
        data() {
            return {
                chartData: {
                    labels: [],
                    datasets: []
                },
                chartOptions: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: {
                            title: {
                                display: true,
                                text: 'Vehicle Inspection Counts',
                                font: {
                                    size: 15
                                }
                            },
                            ticks: {
                                precision: 0
                            }
                        },
                        xAxes: {
                            title: {
                                display: true,
                                text: 'Months',
                                font: {
                                    size: 15
                                }
                            }
                        }
                    },
                },
                titleText : 'Total Chart',
                isLoading : false,
            }
        },
        mounted() {
            this.getBarData();
        },
        methods: {
            getBarData() {
                this.isLoading = true;
                this.axios
                    .get(process.env.MIX_API_URL + '/dashboard/total-line-chart',{})
                    .then(response =>{
                        this.isLoading = false;
                        if(response.status){
                            this.chartData.datasets = response.data.data;
                            this.titleText = response.data.details.title;
                            this.chartData.labels = response.data.details.months;
                        }
                    })
                    .catch(error =>{
                        this.isLoading = false;
                    })
                    .finally(res =>{
                        this.isLoading = false;
                    })
            }

        }

    }
</script>
