require('dotenv').config();
require('./db/config')
const http = require('http');
const postData = require('./helper/postData')
const Employee = require('./models/Employee')
const EmployeeController = require('./controller/employeeController');
const ClientController = require('./controller/clientController')
const { log } = require('console');

const server = http.createServer((req, resp) => {
  console.log(req.url)
  const path = req.url
 
  const method = req.method
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
  else {
    resp.writeHead(404, { 'Content-Type': 'application/json' });
    resp.end(JSON.stringify({message:"Page not found"}))

  }
});

server.listen(process.env.port, () => {
  console.log(process.env.port)
})
