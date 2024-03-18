// models/holiday.js
const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    year:{
        type:Number,
        required:true
    },
    date: {
        type:Date,
        required: true,
    },
    type:{
        type:String,
        required:true
    }
},{versionKey:false});

const Holiday = mongoose.model('Holiday', holidaySchema);

module.exports = Holiday;
