<template>
    <div>
        <b-table ref="table"
                 class="mt-2"
                 :items="items"
                 :fields="fields"
                 responsive
                 borderless
                 :busy="isBusy"
         >
            <template #table-busy>
                <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                </div>
            </template>
            <template #cell(item_item_type)="row">
                <b-form-select v-model="row.item.item_item_type" :options="itemtypeList"
                               class="form-select">
                </b-form-select>
            </template>
            <template #cell(item_type_status)="row">
                <b-form-select v-model="row.item.item_type_status" :options="typeList"
                               class="form-select">
                </b-form-select>
            </template>
            <template #cell(required_yn)="row">

                <b-form-checkbox
                    :checked="Y"
                    unchecked-value="N"
                    v-model="row.item.required_yn"

                > Yes
                </b-form-checkbox>
            </template>


            <template #cell(passing_criteria_yn)="row">
                <b-form-checkbox
                    :checked="Y"
                    unchecked-value="N"
                    v-model="row.item.passing_criteria_yn"

                >
                   Yes
                </b-form-checkbox>
            </template>
            <template #cell(status)="row">
                <b-form-select v-model="row.item.status" :options="statusOption"
                               class="form-select">
                </b-form-select>
            </template>
            <template class="align-right p-1" #cell(actions)="row">
                <button v-b-tooltip.hover title="Edit" type="button" class="btn btn-primary btn-sm mb-1"
                        @click="addMore(row.index)">
                    <i class="fas fa-plus-circle fa-xs"></i>
                </button>
                <button @click="remove(row)" v-b-tooltip.hover title="Delete" type="button"
                        class="btn btn-danger btn-sm mb-1">
                    <i class="fas fa-trash-alt fa-xs"></i>
                </button>
            </template>

        </b-table>
    </div>

</template>
<script>
    export default {
        name: 'ItemTypeForm',
        props: ['classhInfo'],
        data() {
            return {
                counterNo: null,
                isBusy: true,
                boothDetails: [],
                typeList:[],
                itemtypeList:[],
                items: [],
                item_item_type:[],
                item_type_status:[],
                required_yn:[],
                passing_criteria_yn:[],
                status:[],
                statusOption:[
                    {value: null, text: 'Please Select Option'},
                    {value: 'Y', text: 'Active'},
                    {value: 'N', text: 'Inactive'},
                ],
                itemsOptions: [...Array(20).keys()].map(i => i + 1),
                fieldValues: [],

                fields: [
                    {key: "item_item_type", label: "Test Item Name", tdClass: "p-1"},
                    {key: "item_type_status", label: "Test Type Name", tdClass: "p-1"},
                    {key: "required_yn", label: "Required ", tdClass: "p-1"},
                    {key: "passing_criteria_yn", label: "Passing Criteria", tdClass: "p-1"},
                    {key: "status", label: "status", tdClass: "p-1"},
                    {key: "actions", label: "Action", tdClass: "p-1"},

                ],
                allFields: [],

            }
        },
        created() {


        },
        mounted() {
            this.getClass();
            this.getItemTypeList();
            this.getTypeList();
        },
        methods: {
            addMore(index) {
                this.items.push({})
            },

            remove(data) {
                if (this.items.length === 1) {
                    this.$toastr.error("Sorry! You can't delete the last one");
                } else {

                    this.items.splice(data.index, 1);
                    this.initIndex(data)
                    // this.fieldValues[data.index].push({active_yn: 'N'});
                    // this.fieldValues[data.index].push({counter: data.item.counter_no});
                    // this.fieldValues[data.index].push({passing_criteria_yn: data.item.terminal_ip});
                    // this.fieldValues[data.index].push({passing_criteria_yn: data.item.passing_criteria_yn});
                    this.submitForm()
                }
            },
            getItemTypeList() {
                this.axios
                    .get(process.env.MIX_API_URL + '/common/test-item-type', {})
                    .then(response => {

                        const res = response.data;

                        if (res.status) {
                            this.itemtypeList = res.data
                        }
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },
            getTypeList() {
                this.axios
                    .get(process.env.MIX_API_URL + '/common/test-type', {})
                    .then(response => {

                        const res = response.data;

                        if (res.status) {
                            this.typeList = res.data
                        }
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                    })
                    .finally(() => {
                    });
            },

            submitForm() {
                for (var i in this.fieldValues) {
                    var itemtype = 0;
                    this.allFields[i] = []

                    while (this.fieldValues[i].length > itemtype) {
                        if (this.fieldValues[i][itemtype].item_item_type) {
                            this.allFields[i]['item_item_type'] = this.fieldValues[i][itemtype].item_item_type;
                        }
                        if (this.fieldValues[i][itemtype].item_type_status) {
                            this.allFields[i]['item_type_status'] = this.fieldValues[i][itemtype].item_type_status;
                        }
                            if (this.fieldValues[i][itemtype].required_yn) {
                                this.allFields[i]['required_yn'] = this.fieldValues[i][itemtype].required_yn;
                            }
                            if (this.fieldValues[i][itemtype].passing_criteria_yn) {
                                this.allFields[i]['passing_criteria_yn'] = this.fieldValues[i][itemtype].passing_criteria_yn;
                            }
                        this.allFields[i]['vehicle_class_id'] = this.classhInfo.vehicle_class_id;

                        itemtype++
                    }
                }
                log
                this.$emit('itemtypesInfo', this.allFields);
            },


            async getClass() {

                this.axios
                    .get(process.env.MIX_API_URL + '/class/' + this.classhInfo.vehicle_class_id, {})
                    .then(response => {
                        var res = response.data;
                        if (res.status) {

                                this.addMore();
                        }
                        this.isBusy = false;
                    })
                    .catch(error => {
                        this.$toastr.error(error.response.data.message);
                        this.isBusy = false;
                    })
                    .finally(() => {
                        this.isBusy = false;

                    });
            },
            initIndex(data){

                if (!this.fieldValues[data.index]) {

                    this.fieldValues[data.index] = []
                }
                if (data.item.counter_id) {

                    this.fieldValues[data.index].push({counter_id: data.item.counter_id});

                }
            }
        }
    }
</script>
