const mongoose = require('mongoose');
const Project = require('./../models/Project')
const ChargeActivity=require('./../models/ChargeActivity')
const Common=require('./../helper/common')
const Task=require('./../models/Task')

// const Project = require('./../models/Project');
const helpers = require('./../helper/helper');

module.exports.getAllChargeActivity = (req, resp) => {
    const selectParams = {
        _id: 0
    };
   
    const pipeline = [
        {
            $lookup: {
                from: 'projects',
                localField: "projectId",
                foreignField: "projectId",
                as: "project_Info"
            }
        },
        {
            $lookup: {
                from: 'clients',
                localField: "project_Info.clientId",
                foreignField: "clientId",
                as: "client_Info"
            }
        },
        {
            $project: {
               _id:0,
               chargeActivityId:1,
               chargeCode: 1,
               activityType: 1,
               task: 1,
                "project_Info.projectId": 1,
                "project_Info.name": 1,
                "client_Info.clientId": 1,
                "client_Info.name": 1,
            }
        },
        {
            $unwind: "$project_Info"
        },
        {
            $unwind: "$client_Info"
        },
       
    ]
    ChargeActivity.aggregation(pipeline).then(activity => {
        if (activity) {
            return helpers.success(resp, activity);
        }
        else {
            return helpers.error(resp, 'Something went wrong');
        }
    }).catch(err => {
        console.log(err);
    })

}
module.exports.registerActivity = (req, resp, postData) => {
    let { projectId, chargeCode, activityType, task, notes, descriptions } = postData
    // console.log("asdfgnm,");

    if (Common.chargeCode.includes(chargeCode)) {
        if (Common.activityType.includes(activityType)) {
            if (Common.tasks.includes(task)) {
                const chargeActivityData = {
                    chargeActivityId: 3000,
                    projectId: projectId,
                    chargeCode: chargeCode,
                    activityType: activityType,
                    task: task,
                    notes: notes,
                    descriptions: descriptions
                }
                try {
                    const selectParams = {
                        _id: 0
                    };
                    // console.log("1");
                    Project.get({ projectId: projectId }, {}).then(project => {
                        if (project) {
                            ChargeActivity.get({$and:[{projectId:projectId},{chargeCode:chargeCode},{activityType:activityType},{task:task}]}).then(activity=>{
                                if(!activity){
                                    activityModel.findOne({}, { chargeActivityId: 1 }).sort({ chargeActivityId: -1 }).limit(1).then(result => {
                                        if (result) {
                                            chargeActivityData.chargeActivityId = result.chargeActivityId + 1;
        
                                            ChargeActivity.create(chargeActivityData).then(activity => {
        
                                                return helpers.success(resp, activity);
                                            })
                                        }
                                        else {
                                            ChargeActivity.create(chargeActivityData).then(activity => {
        
                                                return helpers.success(resp, activity);
                                            })
                                        }
                                    })
                                }
                                else{
                                    return helpers.error(resp, 'Charge activity already exist', 403);
                                }
                            })
                           
                        }
                        else {
                            return helpers.error(resp, 'Project not found', 404);
                        }
                    })
                } catch (error) {
                    helpers.error(resp)
                }
            }
            else {
                return helpers.error(resp, 'task not found', 404);
            }
        }
        else {
            return helpers.error(resp, 'activityType not found', 404);
        }
    }
    else {
        return helpers.error(resp, 'Charge code not found', 404);
    }

}

module.exports.updateChargeActivity = (req, resp, param, postData) => {
        let chargeActivityId = param
        try {
            
            ChargeActivity.get({ chargeActivityId: chargeActivityId }, {}).then(existing => {
                if (existing) {
                    const option = {
                        new: true
                    }
                    const data={
                        $set: { 
                            activityType: postData.activityType,
                            task: postData.task,
                            descriptions: postData.descriptions, 
                            notes: postData.notes }
                    }
                 
                    ChargeActivity.findAndUpdate({ chargeActivityId: chargeActivityId }, data, option).then(activity => {
                        if (activity) {
                            return helpers.success(resp, activity)
                        }
                        else {
                            return helpers.error(resp, 'Something went wrong');
                        }
    
                    }).catch(err => {
                        return helpers.error(resp, 'Something went wrong');
                    });
                }
                else {
                    return helpers.error(resp, 'Activity not found', 404);
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
    
module.exports.deleteChargeActivity=(req,resp,param)=>{
    ChargeActivity.get({chargeActivityId:param}).then(activity=>{
        if (activity) {
            const activityObject=new Object(activity);
            const query={$and:[
                {projectId:activityObject.projectId},
                {chargeCode:activityObject.chargeCode},
                {activityType:activityObject.activityType},
                {task:activityObject.task}
            ]
            }
            Task.get(query).then(task=>{
                if(!task){
                    ChargeActivity.remove({chargeActivityId:param}).then(result=>{
                        return helpers.success(resp,{message:"Delete Successfully"})
                    })
                }
                else{
                    return helpers.error(resp, 'This activity is associated with task. Therefore, delete is not allowed.', 403);
                }
            })
            
        }
        else{
            return helpers.error(resp, 'Activity not found', 404);
        }
    })
}
    
    
    
    
    
    
    



