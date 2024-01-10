const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskId:{
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
    projectId:{
        type:Number,
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

},{versionKey:false});

taskModel = mongoose.model("tasks", taskSchema);

module.exports=taskModel
class Task {
    static create (data) {
        const newTask = taskModel(data);

        return new Promise((resolve, reject) => {
            const error = newTask.validateSync();
            if (error) {
                reject(error);
            }
            newTask.save().then(docs=>{
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
            const query = taskModel.find(conditions);

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
            const query = taskModel.findOne(conditions);

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
                taskModel.findOneAndUpdate(conditions, updateData, options).then((docs,err)=>{
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
            taskModel.aggregate(pipeline).then((docs) => {
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
            taskModel.deleteOne(conditions).then((docs) => {
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


module.exports = Task;