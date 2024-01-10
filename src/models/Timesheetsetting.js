const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
    timesheetId:{
        unique:true,
        type:Number,
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

},{versionKey:false});

timesheetModel = mongoose.model("timesheets", timesheetSchema);

module.exports=timesheetModel
class TimesheetSetting {
    static create (data) {
        const newTimesheet = timesheetModel(data);

        return new Promise((resolve, reject) => {
            const error = newTimesheet.validateSync();
            if (error) {
                reject(error);
            }
            newTimesheet.save().then(docs=>{
                if(docs){
                    resolve(docs)
                }
                else{
                    resolve()
                }
            })
        });
    }

    static getAll (conditions, selectParams) {
        return new Promise((resolve, reject) => {
            const query = timesheetModel.find(conditions);

            if (selectParams) {
                query.select(selectParams);
            }

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
            const query = timesheetModel.findOne(conditions);

            if (selectParams) {
                query.select(selectParams);
            }

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

    static findAndUpdate (conditions, updateData, options) {
        return new Promise((resolve, reject) => {
            try {
                timesheetModel.findOneAndUpdate(conditions, updateData, options).then((docs,err)=>{
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

    static aggregation (pipeline) {
        return new Promise((resolve, reject) => {
            timesheetModel.aggregate(pipeline).then((docs) => {
                if (!docs) {
                    resolve()
                }
                else {
                    resolve(docs);
                }
            });
        });
    }

    static remove (conditions) {
        return new Promise((resolve, reject) => {
            timesheetModel.deleteOne(conditions).then((docs) => {
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


module.exports = TimesheetSetting;