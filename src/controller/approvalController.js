const mongoose = require('mongoose');
const Employee= require('./../models/Employee')
const LeadHistory=require('./../models/LeadHistory')
const MyTimesheet=require('./../models/MyTimesheet')
const Task=require('./../models/Task')
const helpers = require('./../helper/helper');

module.exports.updateStatusTimesheet= async (req, resp, timesheetId, postData)=>{
    try{
        MyTimesheet.get({timesheetId:timesheetId},{}).then(async existing=>{
            if(existing){
                const option={
                    new:true
                }   
                let timesheetObject=new Object(existing);
                if (postData.status==='approved') {
                   let arrayOfTasks=[]
                    for(let task of timesheetObject.tasks){
                        var taskData={
                            taskId:0,
                            consumedHours:0
                           }
                        var taskExist=await Task.get({taskId:task.taskId});
                        if(taskExist){
                            //console.log(task.taskId);
                            let taskObject=new Object(taskExist);
                            var sum=0
                            for (let days in task.weeklyHours) {
                                
                                if(typeof(task.weeklyHours[days])==='number')
                                {
                                    sum += task.weeklyHours[days]
                                }
                            }
                            let approvedHours=taskObject.consumedHours+sum;
                            if(approvedHours<=taskObject.estimatedHours){
                                taskData.taskId=task.taskId;
                                taskData.consumedHours=approvedHours;
                                arrayOfTasks.push(taskData);
                            }
                        }
                        else{
                            return helpers.error(resp, 'task not found', 404);
                        }
                    }
                    //console.log(arrayOfTasks);
                    let data=await taskModel.updateMany(
                        {taskId:{$in:arrayOfTasks.map(id=>id.taskId)}},
                        [{
                            $set:{
                                consumedHours:{
                                    $let:{
                                        vars:{obj:{$arrayElemAt:[{$filter:{input:arrayOfTasks,as:"kvp",cond:{$eq:["$$kvp.taskId","$taskId"]}}},0]}},
                                        in:"$$obj.consumedHours"
                                    }
                                }
                            }
                        }],
                        {runValidators:true,multi:true}
                        );
                     console.log(data);
                     if(data.acknowledged){
                        postData.statusUpdatedAt=postData.status+" "+new Date().toLocaleString('en-IN','Asia/Kolkata');
                        var timesheet=await  MyTimesheet.findAndUpdate({timesheetId:timesheetId},postData,option)
                        if(timesheet){
                        return helpers.success(resp,{message:"Successfully updated"}) 
                    }
                    else{
                        return helpers.error(resp, 'Something went wrong');
                    }
                     }
                }
                else if(postData.status==='rejected'){
                    postData.statusUpdatedAt=postData.status+" "+new Date().toLocaleString('en-IN','Asia/Kolkata');
                    var timesheet=await  MyTimesheet.findAndUpdate({timesheetId:timesheetId},postData,option)
                    if(timesheet){
                        return helpers.success(resp,{message:"Successfully updated"})  
                  }
                  else{
                      return helpers.error(resp, 'Something went wrong');
                  }
                }
            }
            else{
                return helpers.error(resp, 'Timesheet not found', 404);
            }
        })
    }
    catch(err){
        console.log(err);
    }
}


    // module.exports.updateStatus=(req, resp, param, postData)=>{
    //     let timesheetId=param
    //     // postData.updatedAt=new Date();
    //     try {
    //          MyTimesheet.get({timesheetId:timesheetId},{}).then(existing=>{
    //             if(existing){
    //                 const option={
    //                     new:true
    //                 }    
    //             let timesheetObject=new Object(existing);
    //             if(postData.status==="approved"){

    //                 Task.get({taskId:timesheetObject.taskId}).then(task=>{
    //                     let taskObject=new Object(task);
    //                     const approvedHours=taskObject.consumedHours+timesheetObject.totalHours;
    //                     //  console.log(approvedHours);
    //                     //  console.log(taskObject.estimatedHours);
    //                     if(approvedHours<=taskObject.estimatedHours){
    //                         postData.statusUpdatedAt=postData.status+" "+new Date().toLocaleString('en-IN','Asia/Kolkata');
    //                         // postData.updatedAt=new Date();
    //                         MyTimesheet.findAndUpdate({timesheetId:timesheetId},postData,option).then(timesheet=>{
    //                             if(timesheet){
    //                                 Task.findAndUpdate({taskId:timesheetObject.taskId},{consumedHours:approvedHours},option).then(result=>{
    //                                     if(result){
    //                                         return helpers.success(resp,timesheet)
    //                                     }
    //                                     else{
    //                                         return helpers.error(resp, 'Something went wrong');
    //                                     }
    //                                 })  
    //                             }
    //                             else{
    //                                 return helpers.error(resp, 'Something went wrong');
    //                             }
                                
    //                         }).catch(err=>{
    //                             return helpers.error(resp, 'Something went wrong');
    //                          });
    //                     }
    //                     else{
    //                         return helpers.error(resp, 'Consumed hours can not be greater than total hours');
    //                     }
    //                 })
    //             }
    //             else if(postData.status==="rejected"){
    //                 postData.statusUpdatedAt=postData.status+" "+new Date().toLocaleString('en-IN','Asia/Kolkata');
    //                 const status = "draft";
    //                 const TimesheetData = {
    //                     timesheetId: 5000,
    //                     employeeId: timesheetObject.employeeId,
    //                     leadId:timesheetObject.leadId,
    //                     status: status,
    //                     weekRange: timesheetObject.weekRange,
    //                     tasks: timesheetObject.tasks,
    //                     totalHours: timesheetObject.totalHours,
    //                     statusUpdatedAt: status + " " + new Date().toLocaleString('en-IN', 'Asia/Kolkata'),
    //                 }
    //                 // console.log(TimesheetData);
    //                 // console.log();
    //                 MyTimesheet.findAndUpdate({timesheetId:timesheetId},postData,option).then(timesheet=>{
    //                     if(timesheet){
    //                         // return helpers.success(resp,timesheet)
    //                         MyTimesheet.get({ $and: [{ employeeId: timesheetObject.employeeId }, { "weekRange.start": timesheetObject.weekRange.start },{status:"draft"}] }).then(existing => {
    //                             if (!existing) {
    //                                 mytimesheetModel.findOne({}, { timesheetId: 1 }).sort({ timesheetId: -1 }).limit(1).then(result => {
    //                                     if (result) {
    //                                         console.log("1");
    //                                         TimesheetData.timesheetId = result.timesheetId + 1;
    //                                         MyTimesheet.create(TimesheetData).then(timesheet => {
    //                                             console.log("2");
    //                                             if (timesheet) {
    //                                                 return helpers.success(resp, timesheet);
    //                                             }
    //                                             else {
    //                                                 helpers.error(resp)
    //                                             }
    //                                         })
    //                                     }
    //                                     else {
    //                                         console.log("3");
    //                                         MyTimesheet.create(TimesheetData).then(timesheet => {
    //                                             console.log("4");
    //                                             if (timesheet) {
    //                                                 return helpers.success(resp, timesheet);
    //                                             }
    //                                             else {
    //                                                 helpers.error(resp)
    //                                             }
    //                                         })
    //                                     }
    //                                 });
    //                             }
    //                             else {
    //                                 return helpers.error(resp, 'Record already exist');
    //                             }
    //                         })
    //                     }
    //                     else{
    //                         return helpers.error(resp, 'Something went wrong');
    //                     }
                        
    //                 })
    //                 .catch(err=>{
    //                     return helpers.error(resp, 'Something went wrong');
    //                  });
    //             }
    //             else{
    //                 return helpers.error(resp, 'Status must be either "approved" or "rejected"');
    //             }
               
             
                   
    //             }
    //             else{
    //                 return helpers.error(resp, 'Timesheet not found', 404);
    //             }
    //          }).catch(err=>{
    //             console.log(err);
    //          });
    //     }
    //     catch (e) {
    //         console.log(e);
    //         return helpers.error(resp, 'Server Error');
    //     }
    // }

   
    module.exports.getAllApprovalTimesheet = (req, resp,leadId,year,employeeId,status) => {
        const selectParams = {
            _id: 0
        };
        let query={}
        //console.log(employeeId);
        if(leadId){
            query={ "employee_Info.leadId":leadId}
        }
        if(year){
            var prev_year=parseInt(year)-1
            prev_year=String(prev_year)
            query["$or"]=[
                {"weekRange.start":new RegExp('.*' + prev_year + '.*', 'i')},{"weekRange.end":new RegExp('.*' + prev_year + '.*', 'i')},
                {"weekRange.start":new RegExp('.*' + year + '.*', 'i')},{"weekRange.end":new RegExp('.*' + year + '.*', 'i')}]
                 
        }
        if(employeeId){
            query["employee_Info.employeeId"]=employeeId
                 
        }
        console.log(query);
        if (status) {
            console.log(typeof (status), typeof ('all'));
            if (status != 'all') {
                query["status"] = status

            }
            console.log(query);
        }
        //console.log(query);  
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
                    $and:[query]
                }
            },
            {
                $project: {
                   _id:0,
                }
            },
            {
                $unwind: "$employee_Info"
            },
            // {
            //     $unwind: "$task_Info"
            // },
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

  