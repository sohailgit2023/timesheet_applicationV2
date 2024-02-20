const mongoose = require('mongoose');
const Employee = require('./../models/Employee');
const LeadHistory = require('./../models/LeadHistory');
const TimesheetSetting=require('./../models/Timesheetsetting')
const MyTimesheet = require('./../models/MyTimesheet');
const Task = require('./../models/Task');
 
// const Project = require('./../models/Project');
const helpers = require('./../helper/helper');
// const { tasks } = require('../helper/common');
// const TimesheetSetting = require('./../models/Timesheetsetting');
// const Timesheet = require('./../models/MyTimesheet');
 
module.exports.MyDashboard = (req, resp, employeeId) => {
    const pipeline = [
        {
            $match: {
                employeeId: employeeId
            }
        },
        {
            $lookup: {
                from: 'timesheets',
                localField: "employeeId",
                foreignField: "employeeId",
                as: "timesheet_Info"
            },
        },
        {
            $lookup: {
                from: 'clients',
                localField: "timesheet_Info.clientId",
                foreignField: "clientId",
                as: "client_Info"
            },
        },
        {
            $lookup: {
                from: 'tasks',
                localField: "employeeId",
                foreignField: "employeeId",
                as: "task_Info"
            },
        },
        {
            $lookup: {
                from: 'projects',
                localField: "task_Info.projectId",
                foreignField: "projectId",
                as: "project_Info"
            },
        },
        {
            $lookup: {
                from: 'my_timesheets',
                localField: "employeeId",
                foreignField: "employeeId",
                as: "my_timesheets_Info"
            },
        },
        {
            $unwind: {
                path: "$my_timesheets_Info",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'employees',
                localField: "employeeId",
                foreignField: "employeeId",
                as: "employee_Info"
            },
        },
        {
            $group: {
                _id: null,
                count_draft: { $sum: { $cond: [{ $eq: ["$my_timesheets_Info.status", "draft"] }, 1, 0] } },
                count_approved: { $sum: { $cond: [{ $eq: ["$my_timesheets_Info.status", "approved"] }, 1, 0] } },
                count_rejected: { $sum: { $cond: [{ $eq: ["$my_timesheets_Info.status", "rejected"] }, 1, 0] } },
                count_submit: { $sum: { $cond: [{ $eq: ["$my_timesheets_Info.status", "submit"] }, 1, 0] } },
                employee_Info: { $first: "$employee_Info" },
                project_Info:{$first: "$project_Info"},
                client_Info: { $first: "$client_Info" },
                task_Info: { $first: "$task_Info" },
                my_timesheets: { $push: "$my_timesheets_Info" },
                // timesheet_Info: { $first: "$timesheet_Info" },
            }
        },
        {
            $project: {
                _id: 0,
                statusCounts: {
                    draft: "$count_draft",
                    approved: "$count_approved",
                    rejected: "$count_rejected",
                    submit: "$count_submit"
                },
                client_Info: 1,
                //project_Info: 1,
               // my_timesheets: 1,
                employee_Info: { $arrayElemAt: ['$employee_Info', 0] },
                WeeklyTimesheet: {
                    $map: {
                        input: "$my_timesheets",
                        as: "timesheet",
                        in: {
                            Duration: "$$timesheet.weekRange.range",
                            totalHours: "$$timesheet.totalHours",
                            Status: "$$timesheet.status",
                        }
                    }
                },
                allTasks: {
                    $map: {
                        input: "$task_Info",
                        as: "task",
                        in: {
                            taskName: "$$task.taskName",
                            chargeCode: "$$task.chargeCode",
                            activityType: "$$task.activityType",
                            estimatedHours:"$$task.estimatedHours",
                            consumedHours:"$$task.consumedHours",
                            projectName: {
                                $arrayElemAt: ["$project_Info.name", {
                                    $indexOfArray: ["$task_Info._id", "$$task._id"]
                                }]
                            }
                        }
                    }
                }
            }
        }
        
    ];
 
    Employee.aggregation(pipeline).then(result => {
        if (result && result.length > 0) {
            return helpers.success(resp, result[0]);
        } else {
            return helpers.error(resp, 'No timesheets found for the specified employee ID');
        }
    }).catch(err => {
        console.log(err);
        return helpers.error(resp, 'An error occurred during the aggregation process');
    });
};


module.exports.TeamDashboard = (req, resp, employeeId) => {
 
    const pipeline = [
        {
            $match: {
                leadId: employeeId
            }
        },
        {
            $lookup: {
                from: 'timesheets',
                localField: "employeeId",
                foreignField: "employeeId",
                as: "timesheet_Info"
            }
        },
        {
            $lookup: {
                from: 'clients',
                localField: "timesheet_Info.clientId",
                foreignField: "clientId",
                as: "client_Info"
            }
        },
        {
            $lookup: {
                from: 'tasks',
                localField: "employeeId",
                foreignField: "employeeId",
                as: "task_Info"
            }
        },
        {
            $lookup: {
                from: 'projects',
                localField: "task_Info.projectId",
                foreignField: "projectId",
                as: "project_Info"
            },
        },
        {
            $lookup: {
                from: 'my_timesheets',
                localField: "employeeId",
                foreignField: "employeeId",
                as: "my_timesheets_Info"
            }
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
            $unwind: {
                path: "$my_timesheets_Info",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: null,
                draftCount: {
                    $sum: { $cond: [{ $eq: ["$my_timesheets_Info.status", "draft"] }, 1, 0] }
                },
                approvedCount: {
                    $sum: { $cond: [{ $eq: ["$my_timesheets_Info.status", "approved"] }, 1, 0] }
                },
                rejectedCount: {
                    $sum: { $cond: [{ $eq: ["$my_timesheets_Info.status", "rejected"] }, 1, 0] }
                },
                submitCount: {
                    $sum: { $cond: [{ $eq: ["$my_timesheets_Info.status", "submit"] }, 1, 0] }
                },
                fullNames: { $addToSet: "$fullName" },
                employees:{$first:"$employee_Info"},
                project:{$first: "$project_Info"},
                tasks: { $first:"$task_Info" },
                timesheets: { $addToSet: { $ifNull: ["$timesheet_Info", null] } },
                clients: { $addToSet: { $cond: { if: "$client_Info", then: "$client_Info", else: null } } },
                myTimesheets: { $addToSet: "$my_timesheets_Info" }
            }
        },
        {
            $project: {
                _id: 0,
                DirectReportees: '$fullNames',
                draftCount: 1,
                submitCount: 1,
                approvedCount: 1,
                rejectedCount: 1,
                clients: {
                     $reduce: { input: '$clients', initialValue: [], in: { $setUnion: ['$$value', '$$this'] } } },
               
                weeklyTimesheets: {
                    $map: {
                        input: '$myTimesheets',
                        as: 'timesheet',
                        in: {
                            duration: '$$timesheet.weekRange.range',
                            totalHours: '$$timesheet.totalHours',
                            status: '$$timesheet.status',
                            employeeName: { $arrayElemAt: ['$employees.fullName', 0] },
                        }
                    }
                },
                allTasks: {
                    $map: {
                        input: '$tasks',
                        as: 'task',
                        in: {
                            taskName: '$$task.taskName',
                            billable: '$$task.billable',
                            consumedHours: '$$task.consumedHours',
                            employeeName: { $arrayElemAt: ['$employees.fullName', 0] },
                            projectName: {
                                $arrayElemAt: ["$project.name", {
                                    $indexOfArray: ["$tasks._id", "$$task._id"]
                                }]
                            }
                        }
                    }
                }
            }
        }
        
    ];
 
    Employee.aggregation(pipeline).then(result => {
        if (result && result.length > 0) {
            return helpers.success(resp, result);
        } else {
            return helpers.error(resp, 'No timesheets found for the specified employee ID');
        }
    }).catch(err => {
        console.log(err);
        return helpers.error(resp, 'An error occurred during the aggregation process');
    });
};



// module.exports.AdminDashboard = (req, resp) => {
 
//     const pipeline = [
//         {
//             $lookup: {
//                 from: 'timesheets',
//                 localField: "employeeId",
//                 foreignField: "employeeId",
//                 as: "timesheet_Info"
//             }
//         },
//         {
//             $lookup: {
//                 from: 'clients',
//                 localField: "timesheet_Info.clientId",
//                 foreignField: "clientId",
//                 as: "client_Info"
//             }
//         },
//         {
//             $lookup: {
//                 from: 'tasks',
//                 localField: "employeeId",
//                 foreignField: "employeeId",
//                 as: "task_Info"
//             }
//         },
//         {
//             $lookup: {
//                 from: 'projects',
//                 localField: "task_Info.projectId",
//                 foreignField: "projectId",
//                 as: "project_Info"
//             },
//         },
//         {
//             $lookup: {
//                 from: 'my_timesheets',
//                 localField: "employeeId",
//                 foreignField: "employeeId",
//                 as: "my_timesheets_Info"
//             }
//         },
//         {
//             $lookup: {
//                 from: 'employees',
//                 localField: "employeeId",
//                 foreignField: "employeeId",
//                 as: "employee_Info"
//             }
//         },
//         {
//             $unwind: {
//                 path: "$my_timesheets_Info",
//                 preserveNullAndEmptyArrays: true
//             }
//         },
//         {
//             $group: {
//                 _id: null,
//                 draftCount: {
//                     $sum: { $cond: [{ $eq: ["$my_timesheets_Info.status", "draft"] }, 1, 0] }
//                 },
//                 approvedCount: {
//                     $sum: { $cond: [{ $eq: ["$my_timesheets_Info.status", "approved"] }, 1, 0] }
//                 },
//                 rejectedCount: {
//                     $sum: { $cond: [{ $eq: ["$my_timesheets_Info.status", "rejected"] }, 1, 0] }
//                 },
//                 submitCount: {
//                     $sum: { $cond: [{ $eq: ["$my_timesheets_Info.status", "submit"] }, 1, 0] }
//                 },
                
//                 employees:{$first:"$employee_Info"},
//                 project:{$first: "$project_Info"},
//                 tasks: { $first:"$task_Info" },
//                 timesheets: { $addToSet: { $ifNull: ["$timesheet_Info", null] } },
//                 clients: { $addToSet: { $cond: { if: "$client_Info", then: "$client_Info", else: null } } },
//                 myTimesheets: { $addToSet: "$my_timesheets_Info" }
//             }
//         },
//         {
//             $project: {
//                 _id: 0,
//                 DirectReportees: {
//                     $map: {
//                         input: '$employees',
//                         as: 'employee',
//                         in: {
//                             employeeId:'$$employee.employeeId',
//                             employeeName: '$$employee.fullName',
//                         }
//                     }
//                 },
//                 draftCount: 1,
//                 submitCount: 1,
//                 approvedCount: 1,
//                 rejectedCount: 1,
//                 clients: {
//                      $reduce: { input: '$clients', initialValue: [], in: { $setUnion: ['$$value', '$$this'] } } },
               
//                 weeklyTimesheets: {
//                     $map: {
//                         input: '$myTimesheets',
//                         as: 'timesheet',
//                         in: {
//                             duration: '$$timesheet.weekRange.range',
//                             totalHours: '$$timesheet.totalHours',
//                             status: '$$timesheet.status',
//                             employeeName: { $arrayElemAt: ['$employees.fullName', 0] },
//                         }
//                     }
//                 },
//                 allTasks: {
//                     $map: {
//                         input: '$tasks',
//                         as: 'task',
//                         in: {
//                             taskName: '$$task.taskName',
//                             billable: '$$task.billable',
//                             consumedHours: '$$task.consumedHours',
//                             employeeName: { $arrayElemAt: ['$employees.fullName', 0] },
//                             projectName: {
//                                 $arrayElemAt: ["$project.name", {
//                                     $indexOfArray: ["$tasks._id", "$$task._id"]
//                                 }]
//                             }
//                         }
//                     }
//                 }
//             }
//         }
        
//     ];
 
//     Employee.aggregation(pipeline).then(result => {
//         if (result && result.length > 0) {
//             return helpers.success(resp, result);
//         } else {
//             return helpers.error(resp, 'No timesheets found for the specified employee ID');
//         }
//     }).catch(err => {
//         console.log(err);
//         return helpers.error(resp, 'An error occurred during the aggregation process');
//     });
// };