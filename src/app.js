require('dotenv').config();
require('./db/config')
const http = require('http');
const postData = require('./helper/postData')
const Employee = require('./models/Employee')
const EmployeeController = require('./controller/employeeController');
const ClientController = require('./controller/clientController');
const ProjectController = require('./controller/projectController')
const ChargeActivityController = require('./controller/chargeActivityController')
const { log } = require('console');

const server = http.createServer((req, resp) => {
  //console.log(req.url)
  const origin = req.headers.origin || '*';
  resp.setHeader('Access-Control-Allow-Origin', origin);
  resp.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  resp.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const path = req.url
  const method = req.method
  if (method === 'OPTIONS') {
    resp.writeHead(200);
    resp.end();
    return;
  }
  if (path === '/' && method === 'GET') {
    const URL = [
      { path: "/employee", method: "GET" },
      { path: "/addEmployee", method: "POST" },
      { path: "/updateEmployee/id", method: "PUT" },
      { path: "/deleteEmployee/id", method: "DELETE" },
      { path: "/client", method: "GET" },
      { path: "/addClient", method: "POST" },
      { path: "/updateClient/id", method: "PUT" },
      { path: "/deleteClient/id", method: "DELETE" },
      { path: "/project", method: "GET" },
      { path: "/addProject", method: "POST" },
      { path: "/updateProject/id", method: "PUT" },
      { path: "/deleteProject/id", method: "DELETE" },
      { path: "/chargeactivity", method: "GET" },
      { path: "/addChargeActivity", method: "POST" },
      { path: "/updateChargeActivity/id", method: "PUT" },
      { path: "/deleteChargeActivity/id", method: "DELETE" },

    ]
    resp.end(JSON.stringify(URL))
  }
  else if (path === '/employee' && method === 'GET') {
    // const { employeeId, fName, lName, email, gender, leadId } = req.body;
    EmployeeController.getAllEmployee(req, resp)
  }
  else if (path === '/addEmployee' && method === 'POST') {

    try {
      postData.getPostData(req).then(formdata => {
        EmployeeController.registerEmployee(req, resp, formdata);
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match(/^\/updateEmployee\/([0-9]+)$/) && method === 'PUT') {
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
  else if (path.match(/^\/deleteEmployee\/([0-9]+)$/) && method === 'DELETE') {
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
  else if (path === '/addClient' && method === 'POST') {
    console.log(path);
    try {
      postData.getPostData(req).then(formdata => {
        ClientController.registerClient(req, resp, formdata);
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match(/^\/updateClient\/([0-9]+)$/) && method === 'PUT') {
    console.log("update client");

    const param = path.split("/")
    console.log(param);
    const clientId = parseInt(param[2])
    try {
      postData.getPostData(req).then(formdata => {
        // ClientController.updateClient(req, resp, clientId, formdata);
        ClientController.updateClient(req, resp, clientId, formdata)
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match(/^\/deleteClient\/([0-9]+)$/) && method === 'DELETE') {
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
    ProjectController.getAllProject(req, resp)
  }
  else if (path === '/addProject' && method === 'POST') {

    try {
      postData.getPostData(req).then(formdata => {
        ProjectController.registerProject(req, resp, formdata);
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match(/^\/updateProject\/([0-9]+)$/) && method === 'PUT') {
    console.log("update project");

    const param = path.split("/")
    console.log(param);
    const projectId = parseInt(param[2])
    try {
      postData.getPostData(req).then(formdata => {
        ProjectController.updateProject(req, resp, projectId, formdata)
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match(/^\/deleteProject\/([0-9]+)$/) && method === 'DELETE') {
    console.log("1111111");
    const param = path.split("/")
    console.log(param);
    const projectId = parseInt(param[2])
    try {
      console.log("2");
      ProjectController.deleteProject(req, resp, projectId)

    } catch (error) {
      console.log(error);
    }
  }
  else if (path === '/chargeactivity' && method === 'GET') {
    // const { employeeId, fName, lName, email, gender, leadId } = req.body;
    ChargeActivityController.getAllChargeActivity(req, resp)
  }
  else if (path === '/addChargeActivity' && method === 'POST') {
    log("activity")
    try {
      postData.getPostData(req).then(formdata => {
        ChargeActivityController.registerActivity(req, resp, formdata);
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match(/^\/updateChargeActivity\/([0-9]+)$/) && method === 'PUT') {
    console.log("update client");

    const param = path.split("/")
    console.log(param);
    const chargeActivityId = parseInt(param[2])
    try {
      postData.getPostData(req).then(formdata => {
        // ClientController.updateClient(req, resp, clientId, formdata);
        ChargeActivityController.updateChargeActivity(req, resp, chargeActivityId, formdata)
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match(/^\/deleteChargeActivity\/([0-9]+)$/) && method === 'DELETE') {

    const param = path.split("/")
    const chargeActivityId = parseInt(param[2])
    try {
      ChargeActivityController.deleteChargeActivity(req, resp, chargeActivityId)

    } catch (error) {
      console.log(error);
    }
  }
  else {
    resp.writeHead(404, { 'Content-Type': 'application/json' });
    resp.end(JSON.stringify({ message: "Page not found" }))

  }
});

server.listen(process.env.port, () => {
  console.log(process.env.port)
})