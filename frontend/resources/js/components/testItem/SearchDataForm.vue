<template>
    <div>
        <b-table  :items="items" :fields="fields">

            <template #cell(item_type)="row" >
                <b-input v-model="item_types" class="form-control">
                </b-input>
            </template>

            <template #cell(vh_class)="row">
                <b-form-select v-model="row.item.vh_class" :options="vh_class"
                               class="form-select">
                </b-form-select>
            </template>
            <template class="align-right p-1" #cell(actions)="row">
                <button v-b-tooltip.hover title="ADD" type="button" class="btn btn-primary btn-sm mb-1"
                        @click="addMore">
                    <i class="fas fa-plus-circle fa-xs"></i>
                </button>
                <button @click="remove(row)" v-b-tooltip.hover title="Delete" type="button"
                        class="btn btn-danger btn-sm mb-1">
                    <i class="fas fa-trash-alt fa-xs"></i>
                </button>
            </template>

        </b-table>

        <input type="button" class="btn btn-primary float-end" value="Submit">
    </div>


</template>

<script>
    export default {
        data() {
            return {
                itemsOptions: [...Array(20).keys()].map(i => i + 1),
                // Note 'isActive' is left out and will not appear in the rendered table
                fields: [
                    {key: 'item_type', label: 'Item Type'},
                    {key: 'vh_class', label: 'Class'},
                    {key: 'actions', label: 'Actions'}
                ],

                item_type: [],
                vh_class: '',
                actions: '',
                items: [
                    {item_type: 'Larsen', vh_class: 'Shaw', actions: 'actions'},

                ]
            }
        },
        methods: {
            addMore() {
                this.items.push({})
            },
            remove(item) {
                console.log(item)
                if (this.items.length === 1) {
                    this.$toastr.error("Sorry! You can't delete the last one");
                } else {
                    this.items.splice(item.index, 1);
                }
            },
        }

    }
</script>
