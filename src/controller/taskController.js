const mongoose = require('mongoose');
const Client = require('./../models/Clients')
const Project = require('./../models/Project')
const Employee=require('./../models/Employee')
const ChargeActivity=require('./../models/ChargeActivity')
const Task=require('./../models/Task')
const TimesheetSetting=require('./../models/Timesheetsetting')
// const Project = require('./../models/Project');
const helpers = require('./../helper/helper');

module.exports.getOneTask = (req, resp,employeeId) => {
    const selectParams = {
        _id: 0
    };
    const pipeline = [
        {
            $match:{employeeId:employeeId}
        },
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
                taskName:1,
                startDate: {$dateToString:{format:"%d-%m-%Y",date:"$startDate"}},
                endDate: {$dateToString:{format:"%d-%m-%Y",date:"$endDate"}},
                "employee_Info.fName": 1,
                "employee_Info.lName": 1,
                "employee_Info.fullName": 1,
                "client_Info.name": 1,
                "client_Info.status": 1,
                "project_Info.name": 1,
                chargeCode: 1,
                activityType: 1,
                task: 1,
                estimatedHours: 1,
                billable: 1,
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

module.exports.getAllTask = (req, resp) => {
    const selectParams = {
        _id: 0
    };
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
                taskName:1,
                startDate: {$dateToString:{format:"%d-%m-%Y",date:"$startDate"}},
                endDate: {$dateToString:{format:"%d-%m-%Y",date:"$endDate"}},
                "employee_Info.fName": 1,
                "employee_Info.lName": 1,
                "employee_Info.fullName": 1,
                "client_Info.name": 1,
                "client_Info.status": 1,
                "project_Info.name": 1,
                chargeCode: 1,
                activityType: 1,
                task: 1,
                estimatedHours: 1,
                billable: 1,
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
        taskName:"",
        employeeId: employeeId,
        clientId: clientId,
        projectId: projectId,
        chargeCode: chargeCode,
        activityType: activityType,
        task: task,
        estimatedHours: estimatedHours,
        consumedHours: 0,
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
        Task.get({$and:[{employeeId:employeeId},{ projectId: projectId }, { chargeCode: chargeCode }, { activityType: activityType }, { task: task }]}).then(existing=>{
            if(!existing){
                Employee.get({ employeeId: employeeId }).then(employee => {
                    if (!employee) {
                        return helpers.error(resp,'Employee not found',404)
                    }
                    TimesheetSetting.get({$and:[{employeeId:employeeId},{ clientId: clientId }]}).then(client => {
                        if (!client) {
                            return helpers.error(resp,'Client not found',404)
                        }
                    
                        Project.get({ $and: [{ projectId: projectId }, { clientId: clientId }] }).then(project => {
                            if (!project) {
                                return helpers.error(resp,'Project not found',404)
                            }
                            const projectObject=new Object(project)
                            ChargeActivity.get({
                                $and: [{ projectId: projectId }, { chargeCode: chargeCode }, { activityType: activityType }, { task: task }]
                            }).then(chargeActivity => {
                                if (!chargeActivity) {
                                    return helpers.error(resp,'Charge Activity not found',404)
                                }

                                taskModel.findOne({}, { taskId: 1 }).sort({ taskId: -1 }).limit(1).then(result => {
                                    if (result) {
                                        taskData.taskId = result.taskId + 1;
                                        taskData.taskName=`${projectObject.name}-${chargeCode}-${activityType}-${task}`
                                        Task.create(taskData).then(task => {
                                            return helpers.success(resp, task);
                                        })
                                    }
                                    else {
                                        taskData.taskName=`${projectObject.name}-${chargeCode}-${activityType}-${task}`
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
            }
            else{
                return helpers.error(resp,'Record already exist',403)
            }
        })
        


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





