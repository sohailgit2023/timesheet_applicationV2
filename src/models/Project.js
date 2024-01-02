const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectId:{
        unique:true,
        type:String,
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
        default:null,
        
    },
    descriptions: {
        type:String,
        default:null,
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

            newProject.save((obj) => {
                if (obj) {
                    resolve(obj);
                }
                else {
                    resolve();
                }
            });
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
            projectModel.findOneAndUpdate(conditions, updateData, options, (err, docs) => {
                if (docs) {
                    resolve(docs);
                }
                else {
                    resolve();
                }
            });
        });
    }

    static aggregation (pipeline) {
        return new Promise((resolve, reject) => {
            projectModel.aggregate(pipeline, (err, docs) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(docs);
                }
            });
        });
    }

    static update (conditions, updateData, options) {
        return new Promise((resolve, reject) => {
            projectModel.update(conditions, updateData, options, (err, docs) => {
                if (docs) {
                    resolve(docs);
                }
                else {
                    reject(err);
                }
            });
        });
    }
}


module.exports = Project;