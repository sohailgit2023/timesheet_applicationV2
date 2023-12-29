const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskId:{
        unique:true,
        type:String,
        required:true
    },
    employeeId:{
        type:Number,
        required:true,
    },
    clientId:{
        type:Number,
        required:true
    },
    projectId:{
        type:String,
        required:true
    },
    chargeCode:{
        type:String,
        required:true
    },
    activityType:{
        type:String,
        required:true
    },
    estimatedHours:{
        type:Number,
        required:true
    },
    billable:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    notes: {
        type:String,
        default:null,
        
    },
    task: {
        type:String,
        default:null,
    },

});

module.exports = mongoose.model("tasks", taskSchema);

