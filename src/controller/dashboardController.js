const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const LeadHistory = require('../models/LeadHistory');
const TimesheetSetting=require('../models/Timesheetsetting')
const MyTimesheet = require('../models/MyTimesheet');
const Task = require('../models/Task');
 
// const Project = require('./../models/Project');
const helpers = require('../helper/helper');
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
                from: 'leads',
                localField: "employeeId",
                foreignField: "employeeId",
                as: "lead_Info",
            }
        },
        {
            $unwind: {
                path: "$lead_Info",
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $sort: { "lead_Info.effectiveDate": -1 }
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
                lead_Info: { $first: "$lead_Info" },
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
                // lead_Info:1,
                client_Info: 1,
                //project_Info: 1,
               // my_timesheets: 1,
                // employee_Info: { $arrayElemAt: ['$employee_Info', 0] },
                employee_Info: { $mergeObjects: [ { $arrayElemAt: ['$employee_Info', 0] },
                 {lead_Info:'$lead_Info'} ]},
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
            $unwind: {
                path: "$project_Info",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: null,
                reportees: { $addToSet: { employeeName: '$fullName', employeeId: '$employeeId' } },
                employees:{$first:"$employee_Info"},
               
                tasks: { $addToSet:
                    {
                        task_Info:"$task_Info",
                        employeeName:"$fullName",                 
                    }
                 },
                project:{$addToSet: "$project_Info"},
                timesheets: { $addToSet: { $ifNull: ["$timesheet_Info", null] } },
                clients: { $addToSet: { $cond: { if: "$client_Info", then: "$client_Info", else: null } } },
                myTimesheets: {
                    $addToSet: {
                        $mergeObjects: [
                            { employeeName: '$fullName',email:'$email' },
                            '$my_timesheets_Info',
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                directReportees: '$reportees',
                statusCounts: {
                    draft: {
                        $size: {
                            $filter: {
                                input: '$myTimesheets',
                                as: 'timesheet',
                                cond: { $eq: ['$$timesheet.status', 'draft'] }
                            }
                        }
                    },
                    approved: {
                        $size: {
                            $filter: {
                                input: '$myTimesheets',
                                as: 'timesheet',
                                cond: { $eq: ['$$timesheet.status', 'approved'] }
                            }
                        }
                    },
                    rejected: {
                        $size: {
                            $filter: {
                                input: '$myTimesheets',
                                as: 'timesheet',
                                cond: { $eq: ['$$timesheet.status', 'rejected'] }
                            }
                        }
                    },
                    submit: {
                        $size: {
                            $filter: {
                                input: '$myTimesheets',
                                as: 'timesheet',
                                cond: { $eq: ['$$timesheet.status', 'submit'] }
                            }
                        }
                    }
                },
                clients: {
                    $reduce: { input: '$clients', initialValue: [], in: { $setUnion: ['$$value', '$$this'] } }
                },

                weeklyTimesheets: {
                    $filter: {
                        input: '$myTimesheets',
                        as: 'timesheet',
                        cond: { $eq: ['$$timesheet.status', 'submit'] }
                    }
                },
                allTasks: {
                    $map: {
                        input: '$tasks',
                        as: 'task',
                        in: {
                            employeeName: '$$task.employeeName',
                           
                            project: {
                                $map: {
                                    input: '$$task.task_Info',
                                    as: 'taskItem',
                                    in: {
                                        taskName: '$$taskItem.task',
                                        billable: '$$taskItem.billable',
                                        consumedHours: '$$taskItem.consumedHours',
                                        projectName: {
                                            $reduce: {
                                                input: "$project",
                                                initialValue: "",
                                                in: {
                                                    $cond: [
                                                        { $eq: ["$$this.projectId", "$$taskItem.projectId"] },
                                                        "$$this.name",
                                                        "$$value"
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            $project:{
                _id:0,
                statusCounts:"$statusCounts",
                directReportees:{
                    $sortArray:{
                        input:'$directReportees',
                        sortBy:{employeeName:1}
                    }
                },
                clients: {
                    $filter: {
                        input: '$clients',
                        as: 'client',
                        cond: { $eq: ['$$client.status', 'active'] }
                    }
                },
                allTasks:"$allTasks",
                weeklyTimesheets:"$weeklyTimesheets"
               
            }
        }    
    ];
    Employee.aggregation(pipeline).then(result => {
        if (result && result.length > 0) {
            return helpers.success(resp, result);
        } else {
            return helpers.error(resp, 'No records found for the specified employee ID');
        }
    }).catch(err => {
        console.log(err);
        return helpers.error(resp, 'An error occurred during the aggregation process');
    });
};



module.exports.AdminDashboard = (req, resp) => {
 
    const pipeline = [
 
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
            $unwind: {
                path: "$project_Info",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: null,
                reportees: { $addToSet: { employeeName: '$fullName', employeeId: '$employeeId' } },
                employees:{$first:"$employee_Info"},
               
                tasks: { $addToSet:
                    {
                        task_Info:"$task_Info",
                        employeeName:"$fullName",                
                    }
                 },
                project:{$addToSet: "$project_Info"},
                timesheets: { $addToSet: { $ifNull: ["$timesheet_Info", null] } },
                clients: { $addToSet: "$client_Info" },
                myTimesheets: {
                    $addToSet: {
                        $mergeObjects: [
                            { employeeName: '$fullName',email:'$email' },
                            '$my_timesheets_Info',
                        ]
                    }
                }
            }
        },
       
        {
            $project: {
                _id: 0,
                directReportees: '$reportees',
                statusCounts: {
                    draft: {
                        $size: {
                            $filter: {
                                input: '$myTimesheets',
                                as: 'timesheet',
                                cond: { $eq: ['$$timesheet.status', 'draft'] }
                            }
                        }
                    },
                    approved: {
                        $size: {
                            $filter: {
                                input: '$myTimesheets',
                                as: 'timesheet',
                                cond: { $eq: ['$$timesheet.status', 'approved'] }
                            }
                        }
                    },
                    rejected: {
                        $size: {
                            $filter: {
                                input: '$myTimesheets',
                                as: 'timesheet',
                                cond: { $eq: ['$$timesheet.status', 'rejected'] }
                            }
                        }
                    },
                    submit: {
                        $size: {
                            $filter: {
                                input: '$myTimesheets',
                                as: 'timesheet',
                                cond: { $eq: ['$$timesheet.status', 'submit'] }
                            }
                        }
                    }
                },
                clients: {
                    $reduce: { input: '$clients', initialValue: [], in: { $setUnion: ['$$value', '$$this'] } }
                },
                //clients:"$clients",
                weeklyTimesheets: {
                    $filter: {
                        input: '$myTimesheets',
                        as: 'timesheet',
                        cond: { $eq: ['$$timesheet.status', 'submit'] }
                    }
                },
                allTasks: {
                    $map: {
                        input: '$tasks',
                        as: 'task',
                        in: {
                            employeeName: '$$task.employeeName',
                           
                            project: {
                                $map: {
                                    input: '$$task.task_Info',
                                    as: 'taskItem',
                                    in: {
                                        taskName: '$$taskItem.task',
                                        billable: '$$taskItem.billable',
                                        consumedHours: '$$taskItem.consumedHours',
                                        projectName: {
                                            $reduce: {
                                                input: "$project",
                                                initialValue: "",
                                                in: {
                                                    $cond: [
                                                        { $eq: ["$$this.projectId", "$$taskItem.projectId"] },
                                                        "$$this.name",
                                                        "$$value"
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        
        {
            $project:{
                _id:0,
                statusCounts:"$statusCounts",
                directReportees:{
                    $sortArray:{
                        input:'$directReportees',
                        sortBy:{employeeName:1}
                    }
                },
                clients: {
                    $filter: {
                        input: '$clients',
                        as: 'client',
                        cond: { $eq: ['$$client.status', 'active'] }
                    }
                },
                allTasks:"$allTasks",
                weeklyTimesheets:"$weeklyTimesheets"
               
            }
        } , 
       
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