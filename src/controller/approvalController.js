const mongoose = require('mongoose');
const Employee= require('./../models/Employee')
const LeadHistory=require('./../models/LeadHistory')
const MyTimesheet=require('./../models/MyTimesheet')
const Task=require('./../models/Task')
const helpers = require('./../helper/helper');


    module.exports.updateStatusTimesheet=(req, resp, param, postData)=>{
        let timesheetId=param
        postData.updatedAt=new Date();
        try {
             MyTimesheet.get({timesheetId:timesheetId},{}).then(existing=>{
                if(existing){
                    const option={
                        new:true
                    }    
                let timesheetObject=new Object(existing);
                if(postData.status==="approved"){
                    Task.get({taskId:timesheetObject.taskId}).then(task=>{
                        let taskObject=new Object(task);
                        const approvedHours=taskObject.consumedHours+timesheetObject.totalHours;
                        //  console.log(approvedHours);
                        //  console.log(taskObject.estimatedHours);
                        if(approvedHours<=taskObject.estimatedHours){
                            // postData.updatedAt=new Date();
                            MyTimesheet.findAndUpdate({timesheetId:timesheetId},postData,option).then(timesheet=>{
                                if(timesheet){
                                    Task.findAndUpdate({taskId:timesheetObject.taskId},{consumedHours:approvedHours},option).then(result=>{
                                        if(result){
                                            return helpers.success(resp,timesheet)
                                        }
                                        else{
                                            return helpers.error(resp, 'Something went wrong');
                                        }
                                    })  
                                }
                                else{
                                    return helpers.error(resp, 'Something went wrong');
                                }
                                
                            }).catch(err=>{
                                return helpers.error(resp, 'Something went wrong');
                             });
                        }
                        else{
                            return helpers.error(resp, 'Consumed hours can not be greater than total hours');
                        }
                    })
                }
                else if(postData.status==="rejected"){
                   
                    MyTimesheet.findAndUpdate({timesheetId:timesheetId},postData,option).then(timesheet=>{
                        if(timesheet){
                            return helpers.success(resp,timesheet)
                        }
                        else{
                            return helpers.error(resp, 'Something went wrong');
                        }
                        
                    }).catch(err=>{
                        return helpers.error(resp, 'Something went wrong');
                     });
                }
                else{
                    return helpers.error(resp, 'Status must be either "approved" or "rejected"');
                }
               
             
                   
                }
                else{
                    return helpers.error(resp, 'Timesheet not found', 404);
                }
             }).catch(err=>{
                console.log(err);
             });
        }
        catch (e) {
            console.log(e);
            return helpers.error(resp, 'Server Error');
        }
    }
    module.exports.getAllApprovalTimesheetByLead = (req, resp,leadId) => {
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
                },
            },
            {
                $match:{
                    $and:[
                        { "employee_Info.leadId":leadId},
                    ]
                   
                }
            },
            {
                $lookup: {
                    from: 'tasks',
                    localField: "taskId",
                    foreignField: "taskId",
                    as: "task_Info"
                },
            },
           
            {
                $project: {
                   _id:0,
                }
            },
            {
                $unwind: "$employee_Info"
            },
            {
                $unwind: "$task_Info"
            },
        ]
        MyTimesheet.aggregation(pipeline).then(timesheet => {
            if (timesheet) {
                return helpers.success(resp, timesheet);
            }
            else {
                return helpers.error(resp, 'Something went wrong');
            }
        }).catch(err => {
            console.log(err);
        })
    
    }

    module.exports.deleteMyTimesheet=(req, resp, param)=>{
       let timesheetId=param
      
       try{
        //this.updateEmployee(req,resp,employeeId,{status:'inactive'})
        MyTimesheet.get({timesheetId:timesheetId},{}).then(timesheetId=>{
           MyTimesheet.remove({timesheetId:timesheetId}).then(result=>{
            return helpers.success(resp,{message:"Delete Successfully"})
           })
        })
        
       }
       catch(err){
        console.log(err);
       }
    }

    module.exports.getAllApprovalTimesheet = (req, resp) => {
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
                },
            },
            {
                $lookup: {
                    from: 'tasks',
                    localField: "taskId",
                    foreignField: "taskId",
                    as: "task_Info"
                },
            },
           
            {
                $project: {
                   _id:0,
                }
            },
            {
                $unwind: "$employee_Info"
            },
            {
                $unwind: "$task_Info"
            },
        ]
        MyTimesheet.aggregation(pipeline).then(timesheet => {
            if (timesheet) {
                return helpers.success(resp, timesheet);
            }
            else {
                return helpers.error(resp, 'Something went wrong');
            }
        }).catch(err => {
            console.log(err);
        })
    
    }

    