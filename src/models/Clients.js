const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    clientId:{
        unique:true,
        type:Number,
        required:true
    },
    name: {
        type:String,
        required: true,
    },
    status: {
        type:String,
        default:"active",
        required: true,
    },

},{versionKey:false});

clientModel = mongoose.model("clients", clientSchema);
module.exports=clientSchema;
class Client{

    static create (data) {
        const newClient = clientModel(data);
        return new Promise((resolve, reject) => {
            const error = newClient.validateSync();
            if (error) {
                reject(error);
            }
            newClient.save().then((client)=>{
                if(client){
                    resolve(client)
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
            const query = clientModel.find(conditions);

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
            const query = clientModel.findOne(conditions).select(selectParams);
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
   
    static findAndUpdate (conditions, updateData, options) {
        return new Promise((resolve, reject) => {
            try {
                clientModel.findOneAndUpdate(conditions, updateData, options).then((docs,err)=>{
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

module.exports=Client
