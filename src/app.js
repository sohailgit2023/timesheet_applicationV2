require('dotenv').config();
require('./db/config')
const http = require('http');
const cors=require('cors')
const postData = require('./helper/postData')
const Employee = require('./models/Employee')
const EmployeeController = require('./controller/employeeController');
const ClientController = require('./controller/clientController');
const ProjectController=require('./controller/projectController')
const ChargeActivityController=require('./controller/chargeActivityController')
const { log } = require('console');

const server = http.createServer((req, resp) => {
  //console.log(req.url)
  const path = req.url
  const headers = {
    'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET,DELETE, PUT, PATCH',
  };
  resp.writeHead(204, headers);

  const method = req.method
//   if (method === "OPTIONS") {
//     resp.writeHead(200);
//    // resp.end();
//     return;
//   }
  console.log(path === '/updateClient/:clientId' && (method === 'PUT'||method === 'POST' ));

  if (path === '/' || path === '/employee' && method === 'GET') {
    // const { employeeId, fName, lName, email, gender, leadId } = req.body;
    EmployeeController.getAllEmployee(req, resp)
  }
  else if (path === '/addemployee' && method === 'POST') {

    try {
      postData.getPostData(req).then(formdata => {
        EmployeeController.registerEmployee(req, resp, formdata);
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match( /^\/updateEmployee\/([0-9]+)$/) &&  method === 'PUT') {
    console.log("update");
    const param = path.split("/")
    console.log(param);
    const employeeId = parseInt(param[2])
    try {
      postData.getPostData(req).then(formdata => {
        EmployeeController.updateEmployee(req, resp, employeeId, formdata);
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match( /^\/deleteEmployee\/([0-9]+)$/) &&  method === 'DELETE') {
    console.log("1");
    const param = path.split("/")
    console.log(param);
    const employeeId = parseInt(param[2])
    try {
      console.log("2");
      EmployeeController.deleteEmployee(req, resp, employeeId)

    } catch (error) {
      console.log(error);
    }
  }
  else if (path === '/client' && method === 'GET') {
    // const { employeeId, fName, lName, email, gender, leadId } = req.body;
    ClientController.getAllClient(req, resp)
  }
  else if (path === '/addclient' && method === 'POST') {
console.log(path);
    try {
      postData.getPostData(req).then(formdata => {
        ClientController.registerClient(req, resp, formdata);
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match( /^\/updateClient\/([0-9]+)$/) && method === 'PUT') {
    console.log("update client");
    
    const param = path.split("/")
    console.log(param);
    const clientId = parseInt(param[2])
    try {
      postData.getPostData(req).then(formdata => {
        // ClientController.updateClient(req, resp, clientId, formdata);
        ClientController.updateClient(req,resp,clientId,formdata)
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match( /^\/deleteClient\/([0-9]+)$/)&& method === 'DELETE') {
    console.log("1111111");
    const param = path.split("/")
    console.log(param);
    const clientId = parseInt(param[2])
    try {
      console.log("2");
      ClientController.deleteClient(req, resp, clientId)

    } catch (error) {
      console.log(error);
    }
  }
  else if (path === '/project' && method === 'GET') {
    // const { employeeId, fName, lName, email, gender, leadId } = req.body;
   // projectController.getAllClient(req, resp)
   ProjectController.getAllProject(req,resp)
  }
  else if (path === '/addproject' && method === 'POST') {

    try {
      postData.getPostData(req).then(formdata => {
        ProjectController.registerProject(req, resp, formdata);
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match( /^\/updateProject\/([0-9]+)$/) && method === 'PUT') {
    console.log("update project");
    
    const param = path.split("/")
    console.log(param);
    const projectId = parseInt(param[2])
    try {
      postData.getPostData(req).then(formdata => {
       ProjectController.updateProject(req,resp,projectId,formdata)
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path === '/chargeactivity' && method === 'GET') {
    // const { employeeId, fName, lName, email, gender, leadId } = req.body;
    ChargeActivityController.getAllChargeActivity(req, resp)
  }
  else if (path === '/addchargeactivity' && method === 'POST') {
log("activity")
    try {
      postData.getPostData(req).then(formdata => {
        ChargeActivityController.registerActivity(req, resp, formdata);
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match( /^\/updateachargeactivity\/([0-9]+)$/) && method === 'PUT') {
    console.log("update client");
    
    const param = path.split("/")
    console.log(param);
    const chargeActivityId = parseInt(param[2])
    try {
      postData.getPostData(req).then(formdata => {
        // ClientController.updateClient(req, resp, clientId, formdata);
        ChargeActivityController.updateChargeActivity(req,resp,chargeActivityId,formdata)
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match( /^\/deletechargeactivity\/([0-9]+)$/)&& method === 'DELETE') {
   
    const param = path.split("/")
    const chargeActivityId = parseInt(param[2])
    try {
     ChargeActivityController.deleteChargeActivity(req,resp,chargeActivityId)

    } catch (error) {
      console.log(error);
    }
  }
  else {
    resp.writeHead(404, { 'Content-Type': 'application/json' });
    resp.end(JSON.stringify({message:"Page not found"}))

  }
});

server.listen(process.env.port, () => {
  console.log(process.env.port)
})
