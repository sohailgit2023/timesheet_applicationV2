const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectId:{
        unique:true,
        type:Number,
        required:true
    },
    name: {
        type:String,
        required: true,
    },
    clientId:{
        type:Number,
        required:true
    },
    notes: {
        type:String,
        default:"",
        
    },
    descriptions: {
        type:String,
        default:"",
    },

});

 projectModel= mongoose.model("projects", projectSchema);

class Project {
    static create (data) {
        const newProject = projectModel(data);

        return new Promise((resolve, reject) => {
            const error = newProject.validateSync();
            if (error) {
                reject(error);
            }

            // newProject.save((obj) => {
            //     if (obj) {
            //         resolve(obj);
            //     }
            //     else {
            //         resolve();
            //     }
            // });
            newProject.save().then(docs=>{
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
            const query = projectModel.find(conditions);

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
            const query = projectModel.findOne(conditions);

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
                projectModel.findOneAndUpdate(conditions, updateData, options).then((docs,err)=>{
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
            projectModel.aggregate(pipeline).then((docs) => {
                if (!docs) {
                    resolve()
                }
                else {
                    resolve(docs);
                }
            });
        });
    }

}


module.exports = Project;