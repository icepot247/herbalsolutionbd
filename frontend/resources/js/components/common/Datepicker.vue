<template>
    <div>
        <div class="mb-3" :class="styleClasses">
            <label v-if="(label != null)" class="form-label"> {{(label != null)? label+':' : 'Date:'}} </label>
            <span v-if="(typeof (this.isLabelRequired) !='undefined' && (this.isLabelRequired == true))" class="text-danger">*</span>
            <date-picker
                v-model="tempValue"
                :format="(format !=null)?format:'MM/DD/YYYY'"
                :type="(datePickerType != null)? datePickerType : 'date'"
                :value-type="(valueTypeFormat !=null)? valueTypeFormat :'YYYY-MM-DD'"
                :disabled-date="disableDates"
                placeholder="Select date"
                class="form-control p-0"
                input-class="mx-input border-0"
                @change = "isChange"
            ></date-picker>
            <ul v-if="v$.modelValue.$error" class="parsley-errors-list filled">
                <li class="parsley-required">The field is required.</li>
            </ul>
        </div>
    </div>
</template>
<script>
    import useVuelidate from "@vuelidate/core";
    import {required,requiredIf } from "@vuelidate/validators";
    import DatePicker from 'vue2-datepicker';
    import 'vue2-datepicker/index.css';
    import moment from "moment";


    export default {
        name: "Datepicker",
        components: {DatePicker},
        props: ['modelValue', 'format', 'label','styleClasses','labelRequired', 'min', 'max', 'valueTypeFormat', 'selectedDate', 'disableDateArray', 'isDisable', 'datePickerType'],
        data() {
            return {
                tempValue: this.modelValue,
                isLabelRequired: (typeof (this.labelRequired) == "undefined")? false : this.labelRequired,
                localeDateStringOptions: {year: 'numeric', month: 'numeric', day: 'numeric'},
            }
        },
        setup() {
            return {v$: useVuelidate()}
        },
        validations() {
            return {
                modelValue: {
                    required:requiredIf(function () {
                        return this.isLabelRequired;

                    }),
                },
            }
        },
        watch:{
            modelValue(newData,oldData){
                this.tempValue = newData;
            }
        },
        methods: {
            disableDates(date) {
                let currentValue = moment(new Date(date) ).format("MM/DD/YYYY").replace("-","");
                let disableDateArray = this.dateArray();
                let isDisable = (typeof (this.isDisable) == 'undefined') ? true : this.isDisable;
                if (disableDateArray.includes(currentValue) && isDisable) {
                    return true;
                } else if (disableDateArray.includes(currentValue) && !isDisable) {
                    return ''
                } else if (!disableDateArray.includes(currentValue) && !isDisable) {
                    return true;
                }
                if (this.min != null || this.max != null || this.selectedDate != null) {
                    let selectedDate = new Date(this.selectedDate);
                    return (new Date(this.min) > date) || (new Date(this.max) < date) || (moment(new Date(date)).format("MM/DD/YYYY").replace("-","") == moment(new Date(selectedDate)).format("MM/DD/YYYY").replace("-",""));
                }
            },
            dateArray() {
                let dateArray = [];
                for (let i in this.disableDateArray) {
                    dateArray[i] = moment(new Date(this.disableDateArray[i]) ).format("MM/DD/YYYY").replace("-","");
                }
                return dateArray;
            },
            isChange(date){
                this.$emit('onDateChanged',date);
            },
        }
    }
</script>
