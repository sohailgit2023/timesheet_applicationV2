const mongoose = require('mongoose');
const Client = require('./../models/Clients')
const Project = require('./../models/Project')
const Employee=require('./../models/Employee')
const ChargeActivity=require('./../models/ChargeActivity')
const Task=require('./../models/Task')
const TimesheetSetting=require('./../models/Timesheetsetting')
// const Project = require('./../models/Project');
const helpers = require('./../helper/helper');
const Common=require('./../helper/common')


module.exports.getDirectReporteeAndEmpTimesheet = (req, resp,employeeId) => {
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
            $unwind: "$employee_Info"
        },
        {
            $match: {
                $or: [
                    { employeeId: employeeId },
                    { "employee_Info.leadId": employeeId }
                ]
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
            $unwind: "$client_Info"
        },
        {
            $project: {
                _id: 0,
                timesheetId: 1,
                location:1,
                startDate: {$dateToString:{format:"%Y-%m-%d",date:"$startDate"}},
                endDate: {$dateToString:{format:"%Y-%m-%d",date:"$endDate"}},
                notes: 1,
                employee_Info: 1,
                client_Info: 1,
 
            }
        },
    ];
    TimesheetSetting.aggregation(pipeline).then(timesheet => {
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
module.exports.getOneTimesheetSetting = (req, resp,employeeId) => {
    const selectParams = {
        _id: 0
    };
    const pipeline = [
        {
            $match: {
                $or: [
                    { employeeId: employeeId } // Include timesheets for the lead as well
                ]
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
            $lookup: {
                from: "clients",
                localField: "clientId",
                foreignField: "clientId",
                as: "client_Info"
            }
        },
        {
            $project: {
                _id: 0,
                timesheetId: 1,
                location:1,
                startDate: {$dateToString:{format:"%Y-%m-%d",date:"$startDate"}},
                endDate: {$dateToString:{format:"%Y-%m-%d",date:"$endDate"}},
                notes: 1,
                employee_Info: 1,
                client_Info: 1,

            }
        },

        {
            $unwind: "$employee_Info",
        },
        {
            $unwind: "$client_Info"
        },
       
    ]
    TimesheetSetting.aggregation(pipeline).then(timesheet => {
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
module.exports.getAllTimesheetSetting = (req, resp) => {
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
            $project: {
                _id: 0,
                timesheetId: 1,
                location:1,
                startDate: {$dateToString:{format:"%Y-%m-%d",date:"$startDate"}},
                endDate: {$dateToString:{format:"%Y-%m-%d",date:"$endDate"}},
                notes: 1,
                employee_Info: 1,
                client_Info: 1,

            }
        },

        {
            $unwind: "$employee_Info",
        },
        {
            $unwind: "$client_Info"
        },
       
    ]
    TimesheetSetting.aggregation(pipeline).then(timesheet => {
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

// module.exports.TeamTimesheets = async (req, resp, leadId) => {
//     try {
//         // Build the aggregation pipeline
//         const pipeline = [
//             {
//                 $match: {
//                     $or: [
//                         { leadId: leadId },
//                         { employeeId: leadId }
//                     ]
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'timesheets',
//                     localField: 'employeeId',
//                     foreignField: 'employeeId',
//                     as: 'timesheets'
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$timesheets',
//                     preserveNullAndEmptyArrays: true 
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "clients",
//                     localField: "timesheets.clientId",
//                     foreignField: "clientId",
//                     as: "clients"
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$clients',
//                     preserveNullAndEmptyArrays: true 
//                 }
//             },
//             {
//                 $group:{
//                     _id:null,
//                     timesheets: {
//                         $addToSet: {
//                             $mergeObjects: [
//                                 {employeeId:'$employeeId', fullName:'$fullName'},
//                                 {
//                                     timesheet: {
//                                         $mergeObjects: [
//                                             "$timesheets",
//                                             {
//                                                 startDate: {
//                                                     $dateToString: {
//                                                         format: "%d-%m-%Y",
//                                                         date: "$timesheets.startDate"
//                                                     }
//                                                 },
//                                                 endDate: {
//                                                     $dateToString: {
//                                                         format: "%d-%m-%Y",
//                                                         date: "$timesheets.endDate"
//                                                     }
//                                                 }
//                                             }
//                                         ]
//                                     }
//                                 },
//                                 {client:"$clients"}
//                             ]
//                         }
//                     },
//                 }
//             },
//             {
//                 $project:{
//                     _id:0,
//                     timesheets:1,
//                 }
//             },
//         ];
        
//         // Execute the aggregation pipeline
//         Employee.aggregation(pipeline).then(timesheet => {
//             if (timesheet) {
//                 return helpers.success(resp, timesheet);
//             }
//             else {
//                 return helpers.error(resp, 'Something went wrong');
//             }
//         }).catch(err => {
//             console.log(err);
//         })
//     } catch (err) {
//         console.error(err); // Log the error for debugging purposes
//         return helpers.error(resp, 'An error occurred while fetching timesheets');
//     }
// };


module.exports.registerTimesheetsetting = (req, resp, postData) => {
    const { employeeId, clientId,location, startDate, endDate,notes } = postData;
    const locations= Common.locations;
    // console.log("asdfgnm,");
    if( Common.locations.includes(location)){
        const timesheetData = {
            timesheetId: 5000,
            employeeId: employeeId,
            clientId: clientId,
            location: location,
            startDate: startDate,
            endDate: endDate,
            notes: notes
        }

        try {

            const selectParams = {
                _id: 0
            };

            TimesheetSetting.get({$and:[{employeeId:employeeId},{clientId:clientId}]}).then(existing=>{
                if(existing){
                    return helpers.error(resp,'Record already exist',403)
                }
                else{
                    Employee.get({ employeeId: employeeId }).then(employee => {
                        if (!employee) {
                            return helpers.error(resp,'Employee not found',404)
                        }
                        Client.get({ clientId: clientId }).then(client => {
                            if (!client) {
                                return helpers.error(resp,'Client not found',404)
                            }
                           
                            timesheetModel.findOne({}, { timesheetId: 1 }).sort({ timesheetId: -1 }).limit(1).then(result => {
                                if (result) {
                                    timesheetData.timesheetId = result.timesheetId + 1;
            
                                    TimesheetSetting.create(timesheetData).then(timesheet => {
            
                                        return helpers.success(resp,{message:"Added Successfully"})
                                    })
                                }
                                else {
                                    TimesheetSetting.create(timesheetData).then(timesheet => {
            
                                        return helpers.success(resp,{message:"Added Successfully"})
                                    })
                                }
                            })
                        }).catch(err => {
                            resp.status(500).send({ error: "Server error" })
                        });
                    }).catch(err => {
                        resp.status(500).send({ error: "Server error" })
                    });
                }
            })
        } catch (error) {
            helpers.error(resp)
        }
    }
    else{
        return helpers.error(resp, 'Location not found', 404);
    }    
}

module.exports.updateTimesheetSetting = (req, resp, param, postData) => {
    let timesheetId = param
    try {
        TimesheetSetting.get({ timesheetId: timesheetId }, {}).then(existing => {
            if (existing) {
                const option = {
                    new: true
                }
                const data={
                    $set: { 
                        clientId: postData.clientId,
                        location: postData.location,
                        startDate: postData.startDate,
                        endDate: postData.endDate,
                        notes: postData.notes }
                }
                TimesheetSetting.findAndUpdate({ timesheetId: timesheetId }, data, option).then(timesheet => {
                    if (timesheet) {
                        return helpers.success(resp,{message:"Updated Successfully"})
                    }
                    else {
                        return helpers.error(resp, 'Something went wrong');
                    }

                }).catch(err => {
                    return helpers.error(resp, 'Something went wrong');
                });
            }
            else {
                return helpers.error(resp, 'Timesheet Not found', 404);
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

module.exports.deleteTimesheetSetting=(req,resp,param)=>{
    TimesheetSetting.get({timesheetId:param}).then(timesheet=>{
        if (timesheet) {
            TimesheetSetting.remove({timesheetId:param}).then(result=>{
                return helpers.success(resp,{message:"Delete Successfully"})
            })
        }
        else{
            return helpers.error(resp, 'Timesheet not found', 404);
        }
    })
}





