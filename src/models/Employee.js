const mongoose = require('mongoose');
const { error } = require('../helper/helper');

const employeeSchema = new mongoose.Schema({
    employeeId:{
        unique:true,
        type:Number,
        required:true
    },
    fName: {
        type:String,
        required: true,
    },
    lName: {
        type:String,
        required: true,
    },
    fullName: {
        type:String,
        required: true,
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    gender: {
        type:String,
        required:true,
    },
    isLead:{
        type:Boolean,
        required:true
    },
    status: {
        type:String,
        default:"active",
        required: true,
    },
    leadId:{
        type:Number,
        required:true
    },
    leadName:{
        type:String,
        required: true,
    }
},{versionKey:false});
employeeModel = mongoose.model("employees", employeeSchema);
module.exports=employeeSchema;
class Employee{

    static create (data) {
        const newEmployee = employeeModel(data);
        return new Promise((resolve, reject) => {
            const error = newEmployee.validateSync();
            if (error) {
                reject(error);
            }
            newEmployee.save().then((employee)=>{
                if(employee){
                    resolve(employee)
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
            const query = employeeModel.find(conditions);

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
            const query = employeeModel.findOne(conditions).select(selectParams);
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
            employeeModel.aggregate(pipeline).then((docs) => {
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
                employeeModel.findOneAndUpdate(conditions, updateData, options).then((docs,err)=>{
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

module.exports=Employee