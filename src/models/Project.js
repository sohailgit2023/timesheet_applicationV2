const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectId:{
        unique:true,
        type:String,
        required:true
    },
    name: {
        type:String,
        required: true,
    },
    clientId:{
        type:Number,
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

module.exports = mongoose.model("projects", projectSchema);

