const mongoose = require('mongoose');

const activityTypeSchema = new mongoose.Schema({
    chargeActivityId:{
        unique:true,
        type:String,
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
    task:{
        type:String,
        required:true
    },
    notes: {
        type:String,
        default:null,
        
    },
    descriptions: {
        type:String,
        default:null,
    },

});

module.exports = mongoose.model("chargeactivitytype", activityTypeSchema);

