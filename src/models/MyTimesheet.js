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
    leadId:{
        type:Number,
        required:true
    },
    status: {
        type: String,
        required: true
    },
    weekRange: {
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        },
        range:{
            type:String,
            required:true
        }
    },
    totalHours:{
        type:Number,
        required:true
    },
    statusUpdatedAt: {
        type:String,
        required: true,
    },
    tasks:[{
        taskId:{
            type:Number,
            required:true
        },
        taskName:{
            type:String,
            required:true
        },
        weeklyHours:{
            sun:{
                type:Number,
                required:false
            },
            mon:{
                type:Number,
                required:false
            },
            tue:{
                type:Number,
                required:false
            },
            wed:{
                type:Number,
                required:false
            },
            thurs:{
                type:Number,
                required:false
            },
            fri:{
                type:Number,
                required:false
            },
            sat:{
                type:Number,
                required:false
            },
        },
        weeklyNotes:{
            sun:{
                type:String,
                required:false
            },
            mon:{
                type:String,
                required:false
            },
            tue:{
                type:String,
                required:false
            },
            wed:{
                type:String,
                required:false
            },
            thurs:{
                type:String,
                required:false
            },
            fri:{
                type:String,
                required:false
            },
            sat:{
                type:String,
                required:false
            },
        }

    }],
  
   

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
