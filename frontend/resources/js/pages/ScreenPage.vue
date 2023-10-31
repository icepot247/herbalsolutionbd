<template>
    <div>
        <div class="container-fluid p-0" style="min-height: 500px">
            <table class="table">
                <thead>
                <tr class="bg-dark">
                    <th scope="col">
                        <p class="display-2 text-white text-center font-weight-bold">Que No.</p>
                    </th>
                    <th scope="col">
                        <p class="display-2 text-white text-center font-weight-bold">Lane No.</p>
                    </th>
                    <th scope="col">
                        <p class="display-2 text-white text-center font-weight-bold">Reg./Chassis No.</p>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(que,key) in nexts " :class="tableColorList[key]">
                    <td>
                        <p class="display-3 text-white text-center">{{que.queue_no}}</p>
                    </td>
                    <td>
                        <p class="display-3 text-white text-center ">{{que.lane_no}}</p>
                    </td>
                    <td>
                        <p v-if="que.registration_no" class="display-3 text-white text-center">{{que.registration_no}}</p>
                        <p v-else class="display-3 text-white text-center">{{que.chassis_no}}</p>
                    </td>
                </tr>
                </tbody>
            </table>

            <div class="row fixed-bottom ">
                <div class="col-md-12">
                    <div class="alert alert-warning mb-0 p-4">
<!--                        <marquee  scrollamount="30" class="text-dark display-1 font-weight-bold" behavior="" direction="">-->
<!--                            <span style="width: max-content;" v-for="(next, key) in queList" :key="key" >Serving : Que-{{next.queue_no}} Lane-{{next.lane_no}} Reg-{{next.registration_no}} {{(key!==0)?'|':''}}  </span>-->
<!--                        </marquee>-->
                        <!-- Using CSS to create it -->
<!--                        <p style="width: 2560px;" class="moving-text text-dark display-1 font-weight-bold" v-for="(next, key) in queList" :key="key" >Serving : Que-{{next.queue_no}} Lane-{{next.lane_no}} Reg-{{next.registration_no}} {{(key!==0)?'|':''}}</p>-->
                            <p v-for="(next, key) in queList" :key="key" style="width: max-content" class="moving-text text-dark display-1 font-weight-bold" >Serving : Que-{{next.queue_no}} Lane-{{next.lane_no}} Reg-{{next.registration_no}} {{(key!==0)?'|':''}} </p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: 'ScreenPage',
        components: {},
        data() {
            return {
                tableColorList: [
                    'bg-success',
                    'bg-primary',
                    'bg-info',
                    'bg-warning',
                    'bg-danger',
                    'bg-info',
                ],
                queList: [],
                timeInterval: null,
                nexts: [],
            }
        },
        created() {
            this.getQueList()
        },
        mounted() {
            this.timeInterval = setInterval(() => {
                this.getQueList()
            }, 30000)
        },
        beforeDestroy() {
            clearInterval(this.timeInterval);
        },
        methods: {
            getQueList() {
                this.axios
                    .get(process.env.MIX_API_URL + '/screen/que/' + this.$route.query.center_id, {})
                    .then(response => {
                        this.queList = (response.status) ? response.data.data.current : [];
                        this.nexts = (response.status) ? response.data.data.next : [];
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally()
            },
        },
        computed: {}
    }
</script>
<!-- The styles -->
<style>

    /* Makes the animation pause on hover */
    .moving-text:hover{
        animation-play-state: paused;
    }

    /* The animation */
    @keyframes slide{
        0%{transform: translateX(100%);}
        100%{transform: translateX(-100%);}
    }

    /* media query to enable animation for only those who want it */
    @media (prefers-reduced-motion: no-preference) {
        .moving-text{
            animation: slide 25s linear infinite;
        }
    }
</style>



