import moment from "moment";

export const dateTimeFormatterMixin = {
    methods:{
        mixinFormatDate(date,format = 'DD-MMM-YYYY' ){
            return moment(date).format(format);
        },
        mixinFormatTime(time,convertTo24 = 'HH:mm',format = "hh:mm A"){
            return moment(time,convertTo24).format(format);
        }
    }
}
