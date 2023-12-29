const mongoose = require('mongoose');
const Client= require('./../models/Clients')

// const Project = require('./../models/Project');
const helpers = require('./../helper/helper');

    module.exports.getAllClient= (req,resp)=>{
        const selectParams = {
            _id: 1,
            name: 1,
            email: 1
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
            _id: 1,
            name: 1,
        };
        // console.log("1");
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


    } catch (error) {
        helpers.error(resp)
    }
}

    module.exports.updateClient=(req, resp, param, postData)=>{
        let clientId=param
        try {
             Client.get({clientId:clientId},{}).then(existing=>{
                if(existing){
                    const option={
                        new:true
                    }
                    Client.findAndUpdate({clientId:clientId},postData,option).then(client=>{
                        if(client){
                            
                            return helpers.success(resp,client)
                        }
                        else{
                            return helpers.error(resp, 'Something went wrong');
                        }
                        
                    }).catch(err=>{
                        return helpers.error(resp, 'Something went wrong');
                     });
                }
                else{
                    return helpers.error(resp, 'Client not found', 404);
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

    module.exports.deleteClient=(req, resp, param)=>{
       let clientId=param
      
       try{
        //this.updateEmployee(req,resp,employeeId,{status:'inactive'})
        Client.get({clientId:clientId},{}).then(client=>{
            if(client){
                let updateData={
                    name:client.name,
                    status:'inactive',
                }
                // updateData=JSON.parse(updateData)
                const option={
                    new:true
                }
                 console.log(updateData);
                 if(client.status==='active'){
                    Client.findAndUpdate({clientId:clientId},updateData,option).then(result=>{
                        if(result){
                            console.log(result);
                            return helpers.success(resp,result)
                        }else{
                            helpers.error(resp,'something went wrong',500)
                        }
                     })
                 }
                 else{
                    helpers.error(resp,'already unlisted from active client')
                 }
            
            }
            else{
                helpers.validationError(resp,"Client not found",404)
            }
        })
        
       }
       catch(err){
        console.log(err);
       }
    }
   


