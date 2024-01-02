const mongoose = require('mongoose');
const Client = require('./../models/Clients')
const Project = require('./../models/Project')

// const Project = require('./../models/Project');
const helpers = require('./../helper/helper');

module.exports.getAllProject = (req, resp) => {
    const selectParams = {
        _id: 0
    };
    //    Project.getAll({},selectParams).then(project=>{
    //     // console.log(employee);
    //     return helpers.success(resp, project);
    //    }).catch(err=>{
    //     console.log(err)
    //    })
    const pipeline = [
        {
            $lookup: {
                from: 'clients',
                localField: "clientId",
                foreignField: "clientId",
                as: "client_Info"
            }
        },
        {
            $project: {
               _id:0,
               projectId:1,
                name:1,
                "client_Info.clientId": 1,
                "client_Info.name": 1,
            }
        },
        {
            $unwind: "$client_Info"
        },
       
    ]
    Project.aggregation(pipeline).then(project => {
        if (project) {
            return helpers.success(resp, project);
        }
        else {
            return helpers.error(resp, 'Something went wrong');
        }
    }).catch(err => {
        console.log(err);
    })

}
module.exports.registerProject = (req, resp, postData) => {
    let { name, clientId, notes, descriptions } = postData
    // console.log("asdfgnm,");
    const projectData = {
        projectId: 2000,
        name: name,
        clientId: clientId,
        notes: notes,
        descriptions: descriptions
    }
    try {

        const selectParams = {
            _id: 0
        };
        // console.log("1");
        Client.get({ clientId: clientId }, {}).then(client => {
            if (client) {
                projectModel.findOne({}, { projectId: 1 }).sort({ projectId: -1 }).limit(1).then(result => {
                    if (result) {
                        projectData.projectId = result.projectId + 1;

                        Project.create(projectData).then(project => {

                            return helpers.success(resp, project);
                        })
                    }
                    else {
                        Project.create(projectData).then(project => {

                            return helpers.success(resp, project);
                        })
                    }
                })
            }
            else {
                return helpers.error(resp, 'Client not found', 404);
            }
        })



    } catch (error) {
        helpers.error(resp)
    }
}

module.exports.updateProject = (req, resp, param, postData) => {
    let projectId = param
    try {
        Project.get({ projectId: projectId }, {}).then(existing => {
            if (existing) {
                const option = {
                    new: true
                }
                Project.findAndUpdate({ projectId: projectId }, postData, option).then(project => {
                    if (project) {
                        return helpers.success(resp, project)
                    }
                    else {
                        return helpers.error(resp, 'Something went wrong');
                    }

                }).catch(err => {
                    return helpers.error(resp, 'Something went wrong');
                });
            }
            else {
                return helpers.error(resp, 'Project not found', 404);
            }
        }).catch(err => {
            console.log(err);
        });
    }
    catch (e) {
        console.log(e);
        return helpers.error(resp, 'Server Error');
    }
}





