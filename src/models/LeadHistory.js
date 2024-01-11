const mongoose = require('mongoose');
const { error } = require('../helper/helper');

const leadHistorySchema = new mongoose.Schema({
    employeeId:{
        type:Number,
        required:true
    },
    leadName: {
        type:String,
        required: true,
    },
    leadId:{
        type:Number,
        required:true
    },
    effectiveDate:{
        type:Date,
        required:true
    }
},{versionKey:false});
leadHistoryModel = mongoose.model("leads", leadHistorySchema);
module.exports=leadHistoryModel;

// class Lead{

//     static create (data) {
//         const newLead = leadHistoryModel(data);
//         return new Promise((resolve, reject) => {
//             const error = newLead.validateSync();
//             if (error) {
//                 reject(error);
//             }
//             newLead.save().then((employee)=>{
//                 if(employee){
//                     resolve(employee)
//                 }
//                 else{
//                     resolve()
//                 }
//             }).catch(err=>{
//                 console.log(err);
//             })
//         });
//     }

//     static getAll (conditions, selectParams) {
//         return new Promise((resolve, reject) => {
//             const query = employeeModel.find(conditions);

//             if (selectParams) {
//                 query.select(selectParams);
//             }
//             //console.log(query);
//             query.then((docs) => {
//                // console.log(docs)
//                      if (docs) {
//                     resolve(docs);
//                 }
//                 else {
//                     resolve();
//                 }
//             }).catch((err) => {
//                 console.log(err);
//             });
//         });
//     }
//     static get (conditions, selectParams) {
//         return new Promise((resolve, reject) => {
//             const query = employeeModel.findOne(conditions).select(selectParams);
//             query.then((docs) => {
//                // console.log(docs)
//                      if (docs) {
//                     resolve(docs);
//                 }
//                 else{
//                     resolve()
//                 }
//             }).catch((err) => {
//                 console.log(err);
//             });
//         });
//     }
   
//     static findAndUpdate (conditions, updateData, options) {
//         return new Promise((resolve, reject) => {
//             try {
//                 employeeModel.findOneAndUpdate(conditions, updateData, options).then((docs,err)=>{
//                     if(docs){
//                         resolve(docs)
//                     } else{
//                         reject(err)
//                     }
//                 })
//             } catch (error) {
//                console.log(error);
//             }
//         });
//     }
// }

// module.exports=Employee