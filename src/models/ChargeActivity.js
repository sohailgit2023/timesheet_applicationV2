const mongoose = require('mongoose');

const activityTypeSchema = new mongoose.Schema({
    chargeActivityId:{
        unique:true,
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

},{versionKey:false});

 activityModel = mongoose.model("chargeactivitytype", activityTypeSchema);
 module.exports=activityModel

class ChargeActivity {
    static create (data) {
        const newChargeActivity = activityModel(data);

        return new Promise((resolve, reject) => {
            const error = newChargeActivity.validateSync();
            if (error) {
                reject(error);
            }
            newChargeActivity.save().then(docs=>{
                if(docs){
                    resolve(docs)
                }
                else{
                    resolve()
                }
            })
        });
    }

   
    static get (conditions, selectParams) {
        return new Promise((resolve, reject) => {
            const query = activityModel.findOne(conditions);

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

   

    static aggregation (pipeline) {
        return new Promise((resolve, reject) => {
            activityModel.aggregate(pipeline).then((docs) => {
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
                activityModel.findOneAndUpdate(conditions, updateData, options).then((docs,err)=>{
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
            activityModel.deleteOne(conditions).then((docs) => {
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


module.exports = ChargeActivity;