require('dotenv').config();
require('./db/config')
const http = require('http');
const postData = require('./helper/postData')
const Employee = require('./models/Employee')
const EmployeeController = require('./controller/employeeController');
const ClientController = require('./controller/clientController');
const ProjectController = require('./controller/projectController')
const ChargeActivityController = require('./controller/chargeActivityController')
const TaskController=require('./controller/taskController')
const TimesheetSettingController=require('./controller/timesheetSettingController')
const { log } = require('console');
const MyTimesheetController=require('./controller/myTimesheetController')
const ApprovalController=require('./controller/approvalController')

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
      { path: "/task", method: "GET" },
      { path: "/addTask", method: "POST" },
      { path: "/updateTask/id", method: "PUT" },
      { path: "/deleteTask/id", method: "DELETE" },
      { path: "/timesheetsetting", method: "GET" },
      { path: "/addTimesheetSetting", method: "POST" },
      { path: "/updateTimesheetSetting/id", method: "PUT" },
      { path: "/deleteTimesheetSetting/id", method: "DELETE" },
      { path: "/mytimesheet", method: "GET" },
      { path: "/addMyTimesheet", method: "POST" },
      { path: "/updateMyTimesheet/id", method: "PUT" },
      { path: "/deleteMyTimesheet/id", method: "DELETE" },
      { path: "/AdminApproval", method: "GET" },
      { path: "/LeadApproval/leadId", method: "GET" },
      { path: "/updateApproval/MyTimesheetId", method: "PUT" },
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
  else if (path === '/task' && method === 'GET') {
    // const { employeeId, fName, lName, email, gender, leadId } = req.body;
    TaskController.getAllTask(req, resp)
  }
  else if (path === '/addTask' && method === 'POST') {
    try {
      postData.getPostData(req).then(formdata => {
        TaskController.registerTask(req, resp, formdata);
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match(/^\/updateTask\/([0-9]+)$/) && method === 'PUT') {
    const param = path.split("/")
    console.log(param);
    const taskId = parseInt(param[2])
    try {
      postData.getPostData(req).then(formdata => {
        // ClientController.updateClient(req, resp, clientId, formdata);
        TaskController.updateTask(req, resp, taskId, formdata)
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match(/^\/deleteTask\/([0-9]+)$/) && method === 'DELETE') {

    const param = path.split("/")
    const taskId = parseInt(param[2])
    try {
      TaskController.deleteTask(req, resp, taskId)

    } catch (error) {
      console.log(error);
    }
  }
  else if (path === '/timesheetsetting' && method === 'GET') {
    // const { employeeId, fName, lName, email, gender, leadId } = req.body;
  TimesheetSettingController.getAllTimesheetSetting(req,resp)
  }
  else if (path === '/addTimesheetSetting' && method === 'POST') {
    try {
      postData.getPostData(req).then(formdata => {
        TimesheetSettingController.registerTimesheetsetting(req, resp, formdata);
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match(/^\/updateTimesheetSetting\/([0-9]+)$/) && method === 'PUT') {
    const param = path.split("/")
    console.log(param);
    const timesheetId = parseInt(param[2])
    try {
      postData.getPostData(req).then(formdata => {
        // ClientController.updateClient(req, resp, clientId, formdata);
        TimesheetSettingController.updateTimesheetSetting(req, resp, timesheetId, formdata)
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match(/^\/deleteTimesheetSetting\/([0-9]+)$/) && method === 'DELETE') {

    const param = path.split("/")
    const timesheetId = parseInt(param[2])
    try {
      TimesheetSettingController.deleteTimesheetSetting(req, resp, timesheetId)

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match(/^\/mytimesheet\/([0-9]+)$/) && method === 'GET') {
    // const { employeeId, fName, lName, email, gender, leadId } = req.body;
    const param = path.split("/")
    const employeeId = parseInt(param[2])
  MyTimesheetController.getAllMyTimesheet(req,resp,employeeId)
  }
  else if (path === '/addMyTimesheet' && method === 'POST') {
    console.log("------------------------");
    try {
      postData.getPostData(req).then(formdata => {
        MyTimesheetController.registerMyTimesheet(req, resp, formdata);
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match(/^\/updateMyTimesheet\/([0-9]+)$/) && method === 'PUT') {
    const param = path.split("/")
    console.log(param);
    const timesheetId = parseInt(param[2])
    try {
      postData.getPostData(req).then(formdata => {
        // ClientController.updateClient(req, resp, clientId, formdata);
        MyTimesheetController.updateMyTimesheet(req, resp, timesheetId, formdata)
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match(/^\/deleteMyTimesheet\/([0-9]+)$/) && method === 'DELETE') {

    const param = path.split("/")
    const timesheetId = parseInt(param[2])
    try {
      MyTimesheetController.deleteMyTimesheet(req, resp, timesheetId)

    } catch (error) {
      console.log(error);
    }
  }
  else if (path === '/AdminApproval' && method === 'GET') {
    // const { employeeId, fName, lName, email, gender, leadId } = req.body;
  ApprovalController.getAllApprovalTimesheet(req,resp)
  }
  else if (path.match(/^\/LeadApproval\/([0-9]+)$/) && method === 'GET') {
    // const { employeeId, fName, lName, email, gender, leadId } = req.body;
    const param = path.split("/")
    const leadId = parseInt(param[2])
  ApprovalController.getAllApprovalTimesheetByLead(req,resp,leadId)
  }
  else if (path.match(/^\/updateApproval\/([0-9]+)$/) && method === 'PUT') {
    const param = path.split("/")
    console.log(param);
    const timesheetId = parseInt(param[2])
    try {
      postData.getPostData(req).then(formdata => {
        ApprovalController.updateStatusTimesheet(req, resp, timesheetId, formdata)
      })

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