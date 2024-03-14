const mongoose = require('mongoose');
const Client= require('./../models/Clients')
const Employee = require('../models/Employee');
const Project = require('./../models/Project');
const helpers = require('./../helper/helper');

    // module.exports.getOneClient= (req,resp,clientId)=>{
    //     const selectParams = {
    //         _id:0
    //     };
    //    Client.get({clientId:clientId},selectParams).then(client=>{
    //     // console.log(employee);
    //     return helpers.success(resp, client);
    //    }).catch(err=>{
    //     console.log(err)
    //    })
      
    // }

    module.exports.getClientByEmployee = (req, resp, employeeId) => {
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
                $group: {  
                    _id:null,
                    client_Info: { $first: "$client_Info" },
                }
            },
            {
                $project: {
                    _id: 0,
                    client_Info: 1,
                }
            }
            
        ];
     
        Employee.aggregation(pipeline).then(result => {
            if (result && result.length > 0) {
                return helpers.success(resp, result[0]);
            } else {
                return helpers.error(resp, 'No client found for the specified client ID');
            }
        }).catch(err => {
            console.log(err);
            return helpers.error(resp, 'An error occurred during the aggregation process');
        });
    };

    
    module.exports.getAllClient= (req,resp)=>{
        const selectParams = {
            _id:0
        };
       Client.getAll({},selectParams).then(client=>{
        // console.log(employee);
        return helpers.success(resp, client);
       }).catch(err=>{
        console.log(err)
       })
      
    }

module.exports.registerClient = (req, resp, postData) => {
    let { name } = postData
    // console.log("asdfgnm,");
    const clientData = {
        clientId: 2000,
        name: name
    }
    try {

        const selectParams = {
            _id:0
        };
        Client.get({name:name}).then(existing=>{
            if(!existing){
                clientModel.findOne({}, { clientId: 1 }).sort({ clientId: -1 }).limit(1).then(result => {
                    if (result) {
                        clientData.clientId = result.clientId + 1;
        
                        Client.create(clientData).then(client => {
        
                            return helpers.success(resp, client);
                        })
                    }
                    else {
                        Client.create(clientData).then(client => {
        
                            return helpers.success(resp, client);
                        })
                    }
                })
            }
            else{
                return helpers.error(resp, 'Client already exists');
            }
        })
    } catch (error) {
        helpers.error(resp)
    }
}

    module.exports.updateClient=(req, resp, param, postData)=>{
        let clientId=param
        try {
            const option = {
                new: true
            }
           // console.log(postData.name);
           var updateData={
            status:postData.status
           }
            Client.get({$and:[{clientId:clientId}]},{}).then(client=>{
               const clientObject=new Object(client)
               if(postData.name!==clientObject.name){
                updateData.name=postData.name
               }
               Client.get({name:updateData.name},{}).then(existing=>{
                if(!existing){
                    Client.findAndUpdate({clientId:clientId},updateData,option).then(client1=>{
                        if(client1){
                            return helpers.success(resp,client1)
                        }
                        else{
                            return helpers.error(resp, 'Something went wrong');
                        }
                        
                    }).catch(err=>{
                        return helpers.error(resp, 'Something went wrong');
                     });
                }
                else{
                    return helpers.error(resp, 'Client already exists',403);
                }
               })
             }).catch(err=>{
                console.log(err);
             });
          
             
        }
        catch (e) {
            console.log(e);
            return helpers.error(resp, 'Server Error');
        }
    }

    
    module.exports.deleteClient = (req, resp, param) => {
        Client.get({ clientId: param }).then(client => {
            if (client) {
                return Project.aggregation([
                    { $match: { clientId: param } },
                    { $group: { _id: null, count: { $sum: 1 } } },
                ]);
            } else {
                throw new Error('Client not found');
            }
        }).then(clientProjects => {
            if (clientProjects.length > 0 && clientProjects[0].count > 0) {
                throw new Error('This client is associated. Therefore, delete is not allowed.');
            }
            return Client.remove({ clientId: param });
        }).then(result => {
            helpers.success(resp, { message: 'Delete Successfully' });
        }).catch(error => {
            if (error.message === 'Client not found') {
                helpers.error(resp, error.message, 404);
            }
            else if (error.message === 'This client is associated. Therefore, delete is not allowed.') {
                helpers.error(resp, error.message, 400);
            } else {
                console.log(error);
                helpers.error(resp, 'Internal Server Error', 500);
            }
        });
     };
        