const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
    timesheetId:{
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
    location: {
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
    }

});

module.exports = mongoose.model("timesheets", timesheetSchema);

