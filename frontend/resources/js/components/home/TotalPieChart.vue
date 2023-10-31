<template>
    <div :class="styleClass">
        <p class="h5">{{titleText}}</p>
        <Loader :loading="isLoading"></Loader>
        <Pie
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
      <div class="text-center" v-if="weeklyTotalResult != 0 "><p style="font-size: 12px">Total Result: {{weeklyTotalResult}}</p></div>
    </div>
</template>
<script>
    import {Pie} from 'vue-chartjs/legacy';
    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        ArcElement,
        CategoryScale
    } from 'chart.js';
    import Loader from "../common/Loader";

    ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)
    export default {
        name: "TotalPieChart",
        components: {
            Loader,
            Pie
        },
        props: {
            chartId: {
                type: String,
                default: 'pie-chart'
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
                default: () => {}
            },
            styleClass: {
                type: String,
                default: 'col-md-12'
            }
        },
        data() {
            return {
                chartData: {
                    labels: [],
                    datasets: [
                        {
                            backgroundColor: ['#556ee6', '#34c38f', '#ffc107'],
                            data: [],
                            tooltip: {
                                enabled: false,
                                callbacks: {
                                    label: function(context) {
                                        let label = context.label;
                                        let value = context.formattedValue;
                                        if (!label)
                                            label = 'Unknown'
                                        let sum = 0;
                                        let dataArr = context.chart.data.datasets[0].data;
                                        dataArr.map(data => {
                                            sum += Number(data);
                                        });
                                        label = label.split('(');
                                        let percentage = (value * 100 / sum).toFixed(0) + '%';
                                        return  label[0]+': '+value+' ('+ percentage+')';
                                    }
                                }
                            }

                        }
                    ]
                },
                chartOptions: {
                    responsive: true,
                    maintainAspectRatio: false,

                },
                titleText : 'Total Chart',
                isLoading : false,
                weeklyTotalResult : null,
                pass:null,
              fail:null,
              pending:null,
            }
        },
        mounted() {
            this.getTotal();
        },
        methods: {

            getTotal() {
                this.isLoading = true;
                this.axios
                    .get(process.env.MIX_API_URL + '/dashboard/total-pie-chart',{})
                    .then(response =>{
                        if(response.status){
                            this.isLoading = false;

                            this.chartData.labels = Object.keys(response.data.data.total).map((item,key)=>{
                               // return item.charAt(0).toUpperCase() + item.slice(1)+'('+Object.values(response.data.data.total)[key]+')';
                               // return item.charAt(0).toUpperCase() + item.slice(1);
                                if(response.data.details.weeklyResult >0){

                                    return item.charAt(0).toUpperCase() + item.slice(1)+'('+((Object.values(response.data.data.total)[key] * 100 / response.data.details.weeklyResult).toFixed(0)) + '% )';

                                }else{
                                    return item.charAt(0).toUpperCase() + item.slice(1)+'('+response.data.details.weeklyResult+ ')';
                                }
                            });
                            this.chartData.datasets[0].data = Object.values(response.data.data.total);
                            this.pass=response.data.data.total.Pass;
                            this.fail=response.data.data.total.Fail;
                            this.pending=response.data.data.total.Pending;
                            this.titleText = response.data.details.title;
                            this.weeklyTotalResult = response.data.details.weeklyResult;
                            /*console.log("gvsajH",response.data.details)
                            console.log(response.data.details.weeklyResult)*/
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

