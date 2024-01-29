const mongoose = require('mongoose');
const Employee = require('./../models/Employee')
const LeadHistory = require('./../models/LeadHistory')
const MyTimesheet = require('./../models/MyTimesheet')
const Task = require('./../models/Task')

// const Project = require('./../models/Project');
const helpers = require('./../helper/helper');


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
module.exports.registerMyTimesheet = (req, resp, postData) => {
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
        // console.log("1");
        MyTimesheet.get({ $and: [{ employeeId: employeeId }, { "weekRange.start": weekRanges.startDate }] }).then(existing => {
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
                        TimesheetData.totalHours = sum
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
               TimesheetData.totalHours=sum
                if (timesheetObject.status === 'draft') {
                  
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

module.exports.deleteTaskOfMyTimesheet = (req, resp, param,taskIndex) => {
    let timesheetId = param
    try {
        //this.updateEmployee(req,resp,employeeId,{status:'inactive'})
        MyTimesheet.get({ timesheetId: timesheetId }, {}).then(timesheet => {
            let timesheetObject = new Object(timesheet);
           // timesheetObject.tasks[taskIndex].remove()
          if (timesheetObject.tasks.length!==1) {
            console.log(timesheetObject.tasks.length);
             timesheetObject.tasks.splice(taskIndex,1)
              //console.log(timesheetObject.tasks);
              const option = {
                  new: true
              }
              let sum = 0;
              for (var task of timesheetObject.tasks) {
                  //console.log(task.weeklyHours);
                  for (let days in task.weeklyHours) {
                      // console.log(days)
                      if(typeof(task.weeklyHours[days])==='number'){
                         // console.log(task.weeklyHours[days]);
                          sum += task.weeklyHours[days]
                      }
                      //  console.log(task.weeklyHours[days]);
                  }
                 
              }
               //console.log(sum);
             timesheetObject.totalHours=sum
              MyTimesheet.findAndUpdate({ timesheetId: timesheetId }, timesheetObject, option).then(timesheet => {
                  if (timesheet) {
                     
                      return helpers.success(resp, timesheet)
                  }
                  else {
                      return helpers.error(resp, 'Something went wrong');
                  }
  
              }).catch(err => {
                  return helpers.error(resp, 'Something went wrong');
              });
          }
          else{
            MyTimesheet.remove({ timesheetId: timesheetId }).then(result => {
                return helpers.success(resp, { message: "Delete Successfully" })
            })
          }
        })

    }
    catch (err) {
        console.log(err);
    }
}

