<template>
    <div :class="styleClass">
        <p class="h3">{{titleText}}</p>
        <Loader :loading="isLoading"></Loader>
        <LineChartGenerator
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
    import {Line as LineChartGenerator} from 'vue-chartjs/legacy'
    import Loader from "../common/Loader";

    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        LineElement,
        LinearScale,
        CategoryScale,
        PointElement
    } from 'chart.js'

    ChartJS.register(
        Title,
        Tooltip,
        Legend,
        LineElement,
        LinearScale,
        CategoryScale,
        PointElement
    )

    export default {
        name: "LineChart",
        components: {
            LineChartGenerator,
            Loader
        },
        props: {
            chartId: {
                type: String,
                default: 'line-chart'
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
                default: 300
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
                    maintainAspectRatio: false
                },
                titleText : 'Total Chart',
                isLoading : false,
            }
        },
        mounted() {
            this.getLineData();
        },
        methods: {
            getLineData() {
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
