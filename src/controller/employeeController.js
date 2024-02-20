const mongoose = require('mongoose');
const Employee= require('./../models/Employee')
const LeadHistory=require('./../models/LeadHistory')

// const Project = require('./../models/Project');
const helpers = require('./../helper/helper');

module.exports.getOneEmployee= (req,resp,leadId)=>{
    const selectParams = {
        _id:0
    };
    const pipeline = [
        {
            $match:{leadId:leadId},
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
            $group: {
                _id: "$_id",
                employee: { $first: "$$ROOT" },
                lead_Info: { $first: "$lead_Info" },

            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: ["$employee", {
                        lead_Info: "$lead_Info",
                    }]
                }
            }
        },
        {
            $sort: { employeeId: 1 }
        },
    ];

  Employee.aggregation(pipeline).then(employee=>{
    if(employee){
        return helpers.success(resp, employee);
    }
    else{
        return helpers.error(resp,'Something went wrong');
    }
  })
  
}
    module.exports.getAllEmployee= (req,resp)=>{
        const selectParams = {
            _id:0
        };
        const pipeline = [
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
                $group: {
                    _id: "$_id",
                    employee: { $first: "$$ROOT" },
                    lead_Info: { $first: "$lead_Info" },
 
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$employee", {
                            lead_Info: "$lead_Info",
                        }]
                    }
                }
            },
            {
                $sort: { employeeId: 1 }
            },
        ]
      Employee.aggregation(pipeline).then(employee=>{
        if(employee){
            return helpers.success(resp, employee);
        }
        else{
            return helpers.error(resp,'Something went wrong')
        }
      })
      
    }
    module.exports.registerEmployee=(req,resp,postData)=>{
        let {fName, lName, email, gender,leadId, isLead}=postData
        // console.log("asdfgnm,");
        const employeeData={
            employeeId:1000,
            fName:fName,
            lName:lName,
            fullName:`${fName} ${lName}`,
            email:email,
            gender:gender,
            isLead:isLead,
            leadId:leadId
        }
        try { 
            const selectParams = {
               _id:0
            };
            // console.log("1");
            Employee.get({ $or: [{ email: email }]},selectParams).then(existing=>{
                if(!existing){
                    Employee.get({employeeId:leadId}).then(lead=>{
                        if(lead){
                            let leadObject= new Object(lead);
                            employeeData.leadName=leadObject.fullName
                            employeeModel.findOne({},{employeeId:1}).sort({employeeId:-1}).limit(1).then(result=>{
                                if(result){
                                    employeeData.employeeId=result.employeeId+1;
                                    if(!leadObject.isLead){
                                        const option = {
                                            new: true
                                        }
                                        const data={
                                            $set: { 
                                               isLead:true }
                                        }
                                        Employee.findAndUpdate({employeeId:leadId},data,option).then((Updated)=>{
                                            Employee.create(employeeData).then(employee=>{
                                                const leadHistoryData={
                                                    employeeId:employeeData.employeeId,
                                                    leadName:leadObject.fullName,
                                                    leadId:leadId,
                                                   effectiveDate:new Date()
                                                    // leadId:leadId
                                                }
                                                if(employee){
                                                    LeadHistory(leadHistoryData).save().then(lead=>{
                                                        return helpers.success(resp, employee);
                                                    })
                                                    // return helpers.success(resp, employee);
                                                }  
                                            })
                                        })
                                    }
                                    else{
                                        Employee.create(employeeData).then(employee=>{
                                            const leadHistoryData={
                                                employeeId:employeeData.employeeId,
                                                leadName:leadObject.fullName,
                                                leadId:leadId,
                                               effectiveDate:new Date()
                                                // leadId:leadId
                                            }
                                            if(employee){
                                                LeadHistory(leadHistoryData).save().then(lead=>{
                                                    return helpers.success(resp, employee);
                                                })
                                                // return helpers.success(resp, employee);
                                            } 
                                        })
                                    }
                                }
                                else{
                                    Employee.create(employeeData).then(employee=>{ 
                                        const leadHistoryData={
                                            employeeId:employeeData.employeeId,
                                            leadName:leadObject.fullName,
                                             leadId:leadId,
                                           effectiveDate:new Date()
                                            // leadId:leadId
                                        }
                                        if(employee){
                                            LeadHistory(leadHistoryData).save().then(lead=>{
                                                return helpers.success(resp, employee);
                                            })
                                            // return helpers.success(resp, employee);
                                        }
                                    })
                                }
                            })
                        }
                        else{
                            helpers.validationError(resp,'Lead not exist')
                        }
                    })  
                }
                else{
                   helpers.validationError(resp,'Employee already exist')
                }
            }).catch(err=>{
                console.log(err);
            })
        } catch (error) {
            helpers.error(resp)
        }
    }

    module.exports.updateEmployee=(req, resp, param, postData)=>{
        let employeeId=param
        try {
             Employee.get({employeeId:employeeId},{}).then(existing=>{
                if(existing){
                    const option={
                        new:true
                    }
                    Employee.get({employeeId:postData.leadId}).then(lead=>{
                       if (lead) {
                         let leadObject=new Object(lead)
                         postData.leadName=leadObject.fullName
                         if(leadObject.isLead==='true'){
                            Employee.findAndUpdate({employeeId:employeeId},postData,option).then(employee=>{
                                const leadHistoryData={
                                    employeeId:employeeId,
                                    leadName:leadObject.fullName,
                                     leadId:leadObject.employeeId,
                                   effectiveDate:new Date()
                                }
                                if(employee){
                                    LeadHistory(leadHistoryData).save().then(lead=>{
                                        return helpers.success(resp, employee);
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
                            Employee.findAndUpdate({employeeId:employeeId},postData,option).then(employee=>{
                                const leadHistoryData={
                                    employeeId:employeeId,
                                    leadName:leadObject.fullName,
                                     leadId:leadObject.employeeId,
                                   effectiveDate:new Date()
                                }
                                if(employee){
                                    Employee.findAndUpdate({employeeId:leadObject.employeeId},{isLead:true},option).then(leadUpdated=>{
                                        if(leadUpdated){
                                            LeadHistory(leadHistoryData).save().then(lead=>{
                                                if(lead){
                                                    return helpers.success(resp, employee);
                                                }
                                                else{
                                                    return helpers.error(resp, 'Something went wrong');
                                                }  
                                            })
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
                        
                       }
                       else{
                        helpers.validationError(resp,'Lead not exist')
                       }
                    })
                   
                }
                else{
                    return helpers.error(resp, 'Employee not found', 404);
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
   

    module.exports.deleteEmployee=(req, resp, param)=>{
       let employeeId=param
      
       try{
        //this.updateEmployee(req,resp,employeeId,{status:'inactive'})
        Employee.get({employeeId:employeeId},{}).then(employee=>{
            if(employee){
                let updateData={
                    fName:employee.fName,
                    lName:employee.lName,
                    email:employee.email,
                    gender:employee.gender,
                    status:'inactive',
                    leadId:0,
                    leadName:"",
                    isLead:false
                }
                // updateData=JSON.parse(updateData)
                const option={
                    new:true
                }
                 console.log(updateData);
                 if(employee.status==='active'){
                    Employee.findAndUpdate({employeeId:employeeId},updateData,option).then(result=>{
                        if(result){
                            //console.log(result);
                            return helpers.success(resp,result)
                        }else{
                            helpers.error(resp,'something went wrong',500)
                        }
                     })
                 }
                 else{
                    helpers.error(resp,'already unlisted from active employee')
                 }
            
            }
            else{
                helpers.validationError(resp,"Employee not found",404)
            }
        })
        
       }
       catch(err){
        console.log(err);
       }
    }
   


