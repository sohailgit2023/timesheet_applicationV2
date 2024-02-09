const mongoose = require('mongoose');
const Employee = require('./../models/Employee')
const LeadHistory = require('./../models/LeadHistory')
const MyTimesheet = require('./../models/MyTimesheet')
const Task = require('./../models/Task')

// const Project = require('./../models/Project');
const helpers = require('./../helper/helper');
const { tasks } = require('../helper/common');


module.exports.getAllMyTimesheet = (req, resp, employeeId) => {
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
            $match: {
                $and: [
                    { "employee_Info.employeeId": employeeId },
                ]

            }
        },
        {
            $project: {
                _id: 0,

            }
        },
        {
            $unwind: "$employee_Info"
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

module.exports.getAllWeeklyMyTimesheet = (req, resp, employeeId, week) => {
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
            $match: {
                $and: [
                    { "employee_Info.employeeId": employeeId },
                    { "weekRange.start": week }
                ]

            }
        },
        {
            $project: {
                _id: 0,

            }
        },
        {
            $unwind: "$employee_Info"
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
module.exports.registerMyTimesheet = async (req, resp, postData) => {
    let { employeeId, weekRange } = postData
    // console.log("asdfgnm,");
    const status = "draft";
    const TimesheetData = {
        timesheetId: 5000,
        employeeId: employeeId,
        status: status,
        weekRange: {
            start: '',
            end: '',
            range: ''
        },
        tasks: postData.tasks,
        totalHours: 0,
        statusUpdatedAt: status + " " + new Date().toLocaleString('en-IN', 'Asia/Kolkata'),
    }
    function getWeekDates(date) {
        currentDate = new Date(date);
        const dayOfWeek = currentDate.getDay();
        const diff = currentDate.getDate() - dayOfWeek;
        const startOfWeek = new Date(currentDate.setDate(diff));
        const endOfWeek = new Date(currentDate.setDate(diff + 6));
        startDateFormat = startOfWeek.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        endDateFormat = endOfWeek.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        return {
            startDate: startOfWeek.toLocaleString('en-IN', 'Asia/Kolkata').split(",").splice(0, 1).join(" "),
            endDate: endOfWeek.toLocaleString('en-IN', 'Asia/Kolkata').split(",").splice(0, 1).join(" "),
            start: startDateFormat,
            end: endDateFormat
            // start:startOfWeek.toDateString().split(" ").splice(1,3).join(" "),
            // end:endOfWeek.toDateString().split(" ").splice(1,3).join(" ")
        };
    }
    try {

        const selectParams = {
            _id: 0
        };
        const weekRanges = getWeekDates(weekRange);
        TimesheetData.weekRange.start = weekRanges.startDate;
        TimesheetData.weekRange.end = weekRanges.endDate
        TimesheetData.weekRange.range = weekRanges.start.toString() + " to " + weekRanges.end.toString()
        var taskId=[];
        for (let task of postData.tasks) {
            const existing=await Task.get({$and:[{employeeId:employeeId},{taskId:task.taskId}]})
                   if(!existing){
                     //  throw helpers.error(resp,`taskId: ${task.taskId} not found`,404)  
                     taskId.push(task.taskId)
                 }
           
        }
        if(taskId.length>0){
            return helpers.error(resp,`this taskId: ${taskId.join(", ")} is not assigned to you`,404)  
        }
       // console.log(taskId);
        MyTimesheet.get({ $and: [{ employeeId: employeeId }, { "weekRange.start": weekRanges.startDate },{status:"draft"}] }).then(existing => {
            if (!existing) {
                Employee.get({ $or: [{ employeeId: employeeId }] }, selectParams).then(existing => {
                    if (existing) {
                        const employee = new Object(existing);
                        TimesheetData.leadId = employee.leadId;
                        let sum = 0;
                        for (let task of postData.tasks) {
                            for (let days in task.weeklyHours) {
                                sum += task.weeklyHours[days]
                            }
                        }
                       if (sum>=0 && sum<=168) {
                         TimesheetData.totalHours = sum
                       }
                       else{
                        return helpers.error(resp,"total hours must be between  0-168 hrs",403)
                       }
                        mytimesheetModel.findOne({}, { timesheetId: 1 }).sort({ timesheetId: -1 }).limit(1).then(result => {
                            if (result) {
                                TimesheetData.timesheetId = result.timesheetId + 1;
                                MyTimesheet.create(TimesheetData).then(timesheet => {
                                    if (timesheet) {
                                        return helpers.success(resp, timesheet);
                                    }
                                    else {
                                        helpers.error(resp)
                                    }
                                })
                            }
                            else {
                                MyTimesheet.create(TimesheetData).then(timesheet => {
                                    if (timesheet) {
                                        return helpers.success(resp, timesheet);
                                    }
                                    else {
                                        helpers.error(resp)
                                    }
                                })
                            }
                        });
                    }
                    else {
                        helpers.validationError(resp, 'Employee not exist')
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
            else {
                return helpers.error(resp, 'Record already exist');
            }
        })

    } catch (error) {
        helpers.error(resp)
    }
}

module.exports.updateMyTimesheet = (req, resp, param, postData) => {
    let timesheetId = param
    
    try {
        const TimesheetData = {
            status:postData.status,
            tasks: postData.tasks,
            statusUpdatedAt: postData.status + " " + new Date().toLocaleString('en-IN', 'Asia/Kolkata'),
        }
        MyTimesheet.get({ timesheetId: timesheetId }, {}).then(existing => {
            if (existing) {
                const option = {
                    new: true
                }
                let timesheetObject = new Object(existing);
                let sum = 0;
                for (let task of postData.tasks) {
                    for (let days in task.weeklyHours) {
                        sum += task.weeklyHours[days]
                    }
                }
                console.log(sum);
                if (sum>=0 && sum<=168) {
                    TimesheetData.totalHours = sum
                  }
                  else{
                   return helpers.error(resp,"total hours must be between  0-168 hrs",403)
                  }
                if (timesheetObject.status === 'draft' || timesheetObject.status === 'rejected') {
                  
                    MyTimesheet.findAndUpdate({ timesheetId: timesheetId }, TimesheetData, option).then(timesheet => {
                        if (timesheet) {
                            //console.log(timesheet);
                            return helpers.success(resp, timesheet)
                        }
                        else {
                            return helpers.error(resp, 'Something went wrong');
                        }

                    }).catch(err => {
                        return helpers.error(resp, 'Something went wrong');
                    });
                }
                else {
                    return helpers.error(resp, 'Timesheet status must be draft')
                }

            }
            else {
                return helpers.error(resp, 'Timesheet not found', 404);
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

module.exports.deleteMyTimesheet = (req, resp, param) => {
    let timesheetId = param
    try {
        //this.updateEmployee(req,resp,employeeId,{status:'inactive'})
        MyTimesheet.get({ timesheetId: timesheetId }, {}).then(timesheetId => {
            MyTimesheet.remove({ timesheetId: timesheetId }).then(result => {
                return helpers.success(resp, { message: "Delete Successfully" })
            })
        })
    }
    catch (err) {
        console.log(err);
    }
}