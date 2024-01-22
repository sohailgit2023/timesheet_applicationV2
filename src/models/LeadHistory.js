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