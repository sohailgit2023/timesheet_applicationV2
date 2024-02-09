const mongoose = require('mongoose');
const Employee = require('./../models/Employee');
const LeadHistory = require('./../models/LeadHistory');
const MyTimesheet = require('./../models/MyTimesheet');
const Task = require('./../models/Task');
 
// const Project = require('./../models/Project');
const helpers = require('./../helper/helper');
const { tasks } = require('../helper/common');
 
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
                task_Info: 1,
                client_Info: 1,
                // timesheet_Info: 1,
                my_timesheets: 1,
                employee_Info: 1
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