const mongoose = require('mongoose');
const { error } = require('../helper/helper');

const leadHistorySchema = new mongoose.Schema({
    employeeId:{
        type:Number,
        required:true
    },
    leadName: {
        type:String,
        required: true,
    },
    leadId:{
        type:Number,
        required:true
    },
    effectiveDate:{
        type:Date,
        required:true
    }
},{versionKey:false});
leadHistoryModel = mongoose.model("leads", leadHistorySchema);
module.exports=leadHistoryModel;

// let currentDate=new Date();
// let currentDate1=new Date().toDateString().split(" ").splice(1,3).join(" ");
// let currentDate2=new Date().toUTCString();
// const current={Timezone:'Asia/Kolkata',TimezoneName:'short'};
// const currentDay=currentDate.getDate();
// const currentIST=currentDate.toLocaleString('en-IN',current).toString();
// const currentMonth=currentDate.toDateString();
// const currentTime=currentDate.getTime().toString();
// // console.log(currentDate,currentDay,currentMonth[1],currentTime);
// console.log(currentIST);
// console.log(currentDate1,"-------",currentDate2);