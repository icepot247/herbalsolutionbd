<template>
<div>
    <b-modal size="lg" no-close-on-backdrop :id="itemInfo.id "title="Certificate Details" >
        <div class="row">
            <div class="col-md-6">
                <div class="row">
                    <div class="col-md-5">Registration no</div>
                    <div class="col-md-1">:</div>
                    <div class="col-md-6">{{itemInfo.data.issue_date}}</div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="row">
                    <div class="col-md-5">Registration no</div>
                    <div class="col-md-1">:</div>
                    <div class="col-md-6">{{itemInfo.data.issue_date}}</div>
                </div>
            </div>

        </div>
<!--        <div class="row">-->
<!--            <div class="col-6">-->
<!--                <label for="">Center</label>-->
<!--                <b-form-select class="form-select"></b-form-select>-->
<!--            </div>-->
<!--            <div class="col-6">-->
<!--                <label for="">Inspector</label>-->
<!--                <b-form-select class="form-select"></b-form-select>-->
<!--            </div>-->
<!--        </div>-->
<!--        <template #modal-footer="{ ok }">-->
<!--            <b-button size="sm" variant="success" @click="ok()">-->
<!--                Save-->
<!--            </b-button>-->

<!--        </template>-->
        Hello From Modal!
        {{itemInfo.data.issue_date}}
        {{itemInfo.data.expiry_date}}
        {{itemInfo.data.last_expiry_date}}
    </b-modal>

</div>
</template>

<script>
// import moment from 'moment'
export default {
    name: "CertificateDetails",
    props:['itemInfo'],
    data(){
        return{

        }
    },
    // watch:{
    //     itemInfo(data)
    //     {
    //         data.data.issue_date = moment(data.data.issue_date).format("DD-MMM-YYYY")
    //     }
    // }
}
</script>

<style scoped>

</style>
