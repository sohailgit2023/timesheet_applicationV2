const mongoose = require('mongoose');
const { error } = require('../helper/helper');

const timesheetSchema = new mongoose.Schema({
    employeeId:{
        type:Number,
        required:true
    },
    taskId:{
        type:Number,
        required:true
    },
    week: {
        type:String,
        required: true,
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
myTimesheetModel = mongoose.model("my_timesheets", timesheetSchema);
module.exports=myTimesheetModel;
class Timesheet{

    static create (data) {
        const newTimesheet = myTimesheetModel(data);
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
            const query = myTimesheetModel.find(conditions);
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
            const query = myTimesheetModel.findOne(conditions).select(selectParams);
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
            myTimesheetModel.aggregate(pipeline).then((docs) => {
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
                myTimesheetModel.findOneAndUpdate(conditions, updateData, options).then((docs,err)=>{
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
}

module.exports=Timesheet
