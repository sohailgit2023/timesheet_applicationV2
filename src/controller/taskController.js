const mongoose = require('mongoose');
const Client = require('./../models/Clients')
const Project = require('./../models/Project')
const Employee=require('./../models/Employee')
const ChargeActivity=require('./../models/ChargeActivity')
const Task=require('./../models/Task')
// const Project = require('./../models/Project');
const helpers = require('./../helper/helper');

module.exports.getAllTask = (req, resp) => {
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
                from: 'employees',
                localField: "employeeId",
                foreignField: "employeeId",
                as: "employee_Info"
            }
        },
        {
            $lookup: {
                from: "clients",
                localField: "clientId",
                foreignField: "clientId",
                as: "client_Info"
            }
        },
        {
            $lookup: {
                from: "projects",
                localField: "projectId",
                foreignField: "projectId",
                as: "project_Info"
            }
        },
        {
            $project: {
                _id: 0,
                taskId: 1,
                "employee_Info.fName": 1,
                "employee_Info.lName": 1,
                "client_Info.name": 1,
                "project_Info.name": 1,
                chargeCode: 1,
                activityType: 1,
                task: 1,
                estimatedHours: 1,
                billable: 1,
                startDate: 1,
                endDate: 1,
                notes: 1,

            }
        },

        {
            $unwind: "$employee_Info",
        },
        {
            $unwind: "$client_Info"
        },
        {
            $unwind: "$project_Info",
        },
       
    ]
    Task.aggregation(pipeline).then(task => {
        if (task) {
            return helpers.success(resp, task);
        }
        else {
            return helpers.error(resp, 'Something went wrong');
        }
    }).catch(err => {
        console.log(err);
    })

}
module.exports.registerTask = (req, resp, postData) => {
    const { employeeId, clientId, projectId, chargeCode, activityType, task, estimatedHours, startDate, endDate, billable, notes } = postData;

    // console.log("asdfgnm,");
    const taskData = {
        taskId: 4000,
        employeeId: employeeId,
        clientId: clientId,
        projectId: projectId,
        chargeCode: chargeCode,
        activityType: activityType,
        task: task,
        estimatedHours: estimatedHours,
        startDate: startDate,
        endDate: endDate,
        billable: billable,
        notes: notes
    }
    try {

        const selectParams = {
            _id: 0
        };
        // console.log("1");
        Employee.get({ employeeId: employeeId }).then(employee => {
            if (!employee) {
                return helpers.error(resp,'Employee not found',404)
            }
            Client.get({ clientId: clientId }).then(client => {
                if (!client) {
                    return helpers.error(resp,'Client not found',404)
                }
                Project.get({ $and: [{ projectId: projectId }, { clientId: clientId }] }).then(project => {
                    if (!project) {
                        return helpers.error(resp,'Project not found',404)
                    }
                    ChargeActivity.get({
                        $and: [{ projectId: projectId }, { chargeCode: chargeCode }, { activityType: activityType }, { task: task }]
                    }).then(chargeActivity => {
                        if (!chargeActivity) {
                            return helpers.error(resp,'Activity not found',404)
                        }
                        taskModel.findOne({}, { taskId: 1 }).sort({ taskId: -1 }).limit(1).then(result => {
                            if (result) {
                                taskData.taskId = result.taskId + 1;
        
                                Task.create(taskData).then(task => {
        
                                    return helpers.success(resp, task);
                                })
                            }
                            else {
                                Task.create(taskData).then(task => {
        
                                    return helpers.success(resp, task);
                                })
                            }
                        })
                    })
    
                }).catch(err => {
                    resp.status(500).send({ error: "Server error" })
                })
            }).catch(err => {
                resp.status(500).send({ error: "Server error" })
            });
        }).catch(err => {
            resp.status(500).send({ error: "Server error" })
        });


    } catch (error) {
        helpers.error(resp)
    }
}

module.exports.updateTask = (req, resp, param, postData) => {
    let taskId = param
    try {
        Task.get({ taskId: taskId }, {}).then(existing => {
            if (existing) {
                const option = {
                    new: true
                }
                const data={
                    $set: { 
                        estimatedHours: postData.estimatedHours,
                        billable: postData.billable,
                        startDate:postData.startDate,
                        endDate:postData.endDate,
                        notes: postData.notes }
                }
                Task.findAndUpdate({ taskId: taskId }, data, option).then(task => {
                    if (task) {
                        return helpers.success(resp, task)
                    }
                    else {
                        return helpers.error(resp, 'Something went wrong');
                    }

                }).catch(err => {
                    return helpers.error(resp, 'Something went wrong');
                });
            }
            else {
                return helpers.error(resp, 'Task not found', 404);
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

module.exports.deleteTask=(req,resp,param)=>{
    Task.get({taskId:param}).then(task=>{
        if (task) {
            Task.remove({taskId:param}).then(result=>{
                return helpers.success(resp,{message:"Delete Successfully"})
            })
        }
        else{
            return helpers.error(resp, 'Project not found', 404);
        }
    })
}





