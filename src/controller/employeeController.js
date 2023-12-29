const mongoose = require('mongoose');
const Employee= require('./../models/Employee')

// const Project = require('./../models/Project');
const helpers = require('./../helper/helper');

    module.exports.getAllEmployee= (req,resp)=>{
        const selectParams = {
            _id: 1,
            name: 1,
            email: 1
        };
       Employee.getAll({},selectParams).then(employee=>{
        // console.log(employee);
        return helpers.success(resp, employee);
       }).catch(err=>{
        console.log(err)
       })
      
    }
    module.exports.registerEmployee=(req,resp,postData)=>{
        let {fName, lName, email, gender, leadId}=postData
        // console.log("asdfgnm,");
        const employeeData={
            employeeId:1000,
            fName:fName,
            lName:lName,
            email:email,
            gender:gender,
            leadId:leadId
        }
        try {
            
            const selectParams = {
                _id: 1,
                name: 1,
                email: 1
            };
            // console.log("1");
            Employee.get({ $or: [{ email: email }]},selectParams).then(existing=>{
               
                if(!existing){
                    
                    employeeModel.findOne({},{employeeId:1}).sort({employeeId:-1}).limit(1).then(result=>{
                        if(result){
                            employeeData.employeeId=result.employeeId+1;
                           
                            Employee.create(employeeData).then(employee=>{
                                
                                return helpers.success(resp, employee);
                            })
                        }
                        else{
                            Employee.create(employeeData).then(employee=>{
                               
                                return helpers.success(resp, employee);
                            })
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
                    Employee.findAndUpdate({employeeId:employeeId},postData,option).then(employee=>{
                        if(employee){
                            console.log(employee);
                            return helpers.success(resp,employee)
                        }
                        else{
                            return helpers.error(resp, 'Something went wrong');
                        }
                        
                    }).catch(err=>{
                        return helpers.error(resp, 'Something went wrong');
                     });
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
                    leadId:1001
                }
                // updateData=JSON.parse(updateData)
                const option={
                    new:true
                }
                 console.log(updateData);
                 if(employee.status==='active'){
                    Employee.findAndUpdate({employeeId:employeeId},updateData,option).then(result=>{
                        if(result){
                            console.log(result);
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
   


