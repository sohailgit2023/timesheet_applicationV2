const mongoose = require('mongoose');
const { error } = require('../helper/helper');

const timesheetSchema = new mongoose.Schema({
    timesheetId:{
        type:Number,
        required:true,
        unique:true
    },
    employeeId:{
        type:Number,
        required:true
    },
    taskId:{
        type:Number,
        required:true
    },
    leadId:{
        type:Number,
        required:true
    },
    updatedAt: {
        type: Date,
        required: true
    },
    weekRange: {
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        }
    },
    weeklyHours:{
        type:Array,
        required:true
    },
    totalHours:{
        type:Number,
        required:true
    },
    status: {
        type:String,
        required: true,
    },
    notes:{
        type:Array,
        required:false
    }

},{versionKey:false});
mytimesheetModel = mongoose.model("my_timesheets", timesheetSchema);
module.exports=mytimesheetModel;
class Timesheet{

    static create (data) {
        const newTimesheet = mytimesheetModel(data);
        return new Promise((resolve, reject) => {
            const error = newTimesheet.validateSync();
            if (error) {
                reject(error);
            }
            newTimesheet.save().then((timesheet)=>{
                if(timesheet){
                    resolve(timesheet)
                }
                else{
                    resolve()
                }
            }).catch(err=>{
                console.log(err);
            })
        });
    }

    static getAll (conditions, selectParams) {
        return new Promise((resolve, reject) => {
            const query = mytimesheetModel.find(conditions);
            if (selectParams) {
                query.select(selectParams);
            }
            //console.log(query);
            query.then((docs) => {
               // console.log(docs)
                     if (docs) {
                    resolve(docs);
                }
                else {
                    resolve();
                }
            }).catch((err) => {
                console.log(err);
            });
        });
    }
    static get (conditions, selectParams) {
        return new Promise((resolve, reject) => {
            const query = mytimesheetModel.findOne(conditions).select(selectParams);
            query.then((docs) => {
               // console.log(docs)
                     if (docs) {
                    resolve(docs);
                }
                else{
                    resolve()
                }
            }).catch((err) => {
                console.log(err);
            });
        });
    }
    static aggregation (pipeline) {
        return new Promise((resolve, reject) => {
            mytimesheetModel.aggregate(pipeline).then((docs) => {
                if (!docs) {
                    resolve()
                }
                else {
                    resolve(docs);
                }
            });
        });
    }
   
    static findAndUpdate (conditions, updateData, options) {
        return new Promise((resolve, reject) => {
            try {
                mytimesheetModel.findOneAndUpdate(conditions, updateData, options).then((docs,err)=>{
                    if(docs){
                        resolve(docs)
                    } else{
                        reject(err)
                    }
                })
            } catch (error) {
               console.log(error);
            }
        });
    }

    static remove (conditions) {
        return new Promise((resolve, reject) => {
            mytimesheetModel.deleteOne(conditions).then((docs) => {
                    if (!docs) {
                        resolve()
                    }
                    else {
                        resolve(docs);
                    }
                }
            )
        });
    }
}

module.exports=Timesheet
