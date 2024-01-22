const mongoose = require('mongoose');
const Employee= require('./../models/Employee')
const LeadHistory=require('./../models/LeadHistory')
const MyTimesheet=require('./../models/MyTimesheet')
const Task=require('./../models/Task')

// const Project = require('./../models/Project');
const helpers = require('./../helper/helper');

    // module.exports.getAllEmployee= (req,resp)=>{
    //     const selectParams = {
    //         _id:0
    //     };
    //    MyTimesheet.getAll({},selectParams).then(mytimesheet=>{
    //     // console.log(employee);
    //     return helpers.success(resp, mytimesheet);
    //    }).catch(err=>{
    //     console.log(err)
    //    })
      
    // }
    module.exports.registerMyTimesheet=(req,resp,postData)=>{
        let {employeeId,taskId,weekRange,weeklyHours,status,notes}=postData
        // console.log("asdfgnm,");
        const TimesheetData={
           timesheetId:5000,
           employeeId:employeeId,
           taskId:taskId,
           date:new Date(),
           weekRange:{
            start:'',
            end:''
           },
           weeklyHours:weeklyHours,
           totalHours:0,
           status:status,
           notes:notes

        }
        function getWeekDates(date){
            currentDate = new Date(date);
            console.log(currentDate);
            const dayOfWeek = currentDate.getDay();
           
            console.log(dayOfWeek);
            console.log(currentDate.getDate());
            const diff = currentDate.getDate()-dayOfWeek+(dayOfWeek===0?-6:0);
            console.log(diff);
            const startOfWeek = new Date(currentDate.setDate(diff));
            const endOfWeek = new Date(currentDate.setDate(diff+6));
            return{
                start:startOfWeek.toISOString().split('T')[0],
                end:endOfWeek.toISOString().split('T')[0]
            };
        }
        try { 
            const selectParams = {
               _id:0
            };
            const weekRanges = getWeekDates(weekRange);
            TimesheetData.weekRange.start=weekRanges.start;
            TimesheetData.weekRange.end=weekRanges.end
            // console.log("1");
            MyTimesheet.get({$and:[{employeeId:employeeId},{taskId:taskId},{"weekRange.start":weekRanges.start}]}).then(existing=>{
                if(!existing){
                    Employee.get({ $or: [{ employeeId: employeeId }]},selectParams).then(existing=>{
                        if(existing){
                            const employee=new Object(existing);
                            TimesheetData.leadId=employee.leadId;
                            Task.get({taskId:taskId}).then(task=>{
                                if(task){
                                    let sum=0;
                                    for (let i = 0; i < weeklyHours.length; i++ ) {
                                        sum += weeklyHours[i];
                                      }
                                    TimesheetData.totalHours=sum
                                    mytimesheetModel.findOne({}, { timesheetId: 1 }).sort({ timesheetId: -1 }).limit(1).then(result => {
                                        if (result) {
                                            TimesheetData.timesheetId = result.timesheetId + 1;
                                            MyTimesheet.create(TimesheetData).then(timesheet => {  
                                               if (timesheet) {
                                                 return helpers.success(resp, timesheet);
                                               }
                                               else{
                                                helpers.error(resp)
                                               }
                                            })
                                        }
                                        else {
                                            MyTimesheet.create(TimesheetData).then(timesheet => {
                                                if (timesheet) {
                                                 return helpers.success(resp, timesheet);
                                               }
                                               else{
                                                helpers.error(resp)
                                               }
                                            })
                                        }
                                    })
                                }
                                else{
                                    helpers.validationError(resp,'Task not exist')
                                }
                            })  
                        }
                        else{
                           helpers.validationError(resp,'Employee not exist')
                        }
                    }).catch(err=>{
                        console.log(err);
                    })
                }
                else{
                    return helpers.error(resp, 'Record already exist');
                }
            })
           
        } catch (error) {
            helpers.error(resp)
        }
    }

    module.exports.updateMyTimesheet=(req, resp, param, postData)=>{
        let timesheetId=param
        try {
             MyTimesheet.get({timesheetId:timesheetId},{}).then(existing=>{
                if(existing){
                    const option={
                        new:true
                    }
                let timesheetObject=new Object(existing);
                   if (timesheetObject.status==='draft') {
                     MyTimesheet.findAndUpdate({timesheetId:timesheetId},postData,option).then(timesheet=>{
                         if(timesheet){
                             console.log(timesheet);
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
                    return helpers.error(resp,'Timesheet status must be draft')
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
    module.exports.getAllMyTimesheet = (req, resp,employeeId) => {
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
                },
            },
            {
                $match:{
                    $and:[
                        { "employee_Info.employeeId":employeeId},
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
   


