<template>
<div>
    <b-modal no-close-on-backdrop :id="itemInfo.id" :title="itemInfo.title" >
        <div class="row">
            <div class="col-6">
                <label for="">Center</label>
                <b-form-select class="form-select"></b-form-select>
            </div>
            <div class="col-6">
                <label for="">Inspector</label>
                <b-form-select class="form-select"></b-form-select>
            </div>
        </div>
        <template #modal-footer="{ ok }">
            <b-button size="sm" variant="success" @click="ok()">
                Save
            </b-button>

        </template>
    </b-modal>

</div>
</template>

<script>
export default {
    name: "InspectorModal",
    props:['itemInfo'],
    data(){
        return{

        }
    }
}
</script>

<style scoped>

</style>
