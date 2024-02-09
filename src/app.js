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
const MyDashboardController=require('./controller/myDashboardController')
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
      { path: "/employee/leadId", method: "GET" },
      { path: "/addEmployee", method: "POST" },
      { path: "/updateEmployee/employeeId", method: "PUT" },
      { path: "/deleteEmployee/employeeId", method: "DELETE" },
      { path: "/client", method: "GET" },
      { path: "/client/clientId", method: "GET" },
      { path: "/addClient", method: "POST" },
      { path: "/updateClient/clientId", method: "PUT" },
      { path: "/deleteClient/clientId", method: "DELETE" },
      { path: "/project", method: "GET" },
      { path: "/project/projectId", method: "GET" },
      { path: "/addProject", method: "POST" },
      { path: "/updateProject/projectId", method: "PUT" },
      { path: "/deleteProject/projectId", method: "DELETE" },
      { path: "/chargeactivity", method: "GET" },
      { path: "/chargeactivity/chargeactivityId", method: "GET" },
      { path: "/addChargeActivity", method: "POST" },
      { path: "/updateChargeActivity/chargeactivityId", method: "PUT" },
      { path: "/deleteChargeActivity/chargeactivityId", method: "DELETE" },
      { path: "/task", method: "GET" },
      { path: "/task/Id", method: "GET" },
      { path: "/addTask", method: "POST" },
      { path: "/updateTask/taskId", method: "PUT" },
      { path: "/deleteTask/taskId", method: "DELETE" },
      { path: "/timesheetsetting", method: "GET" },
      { path: "/timesheetsetting/employeeId", method: "GET" },
      { path: "/addTimesheetSetting", method: "POST" },
      { path: "/updateTimesheetSetting/timesheetsettingId", method: "PUT" },
      { path: "/deleteTimesheetSetting/timesheetsettingId", method: "DELETE" },
      { path: "/mytimesheet", method: "GET" },
      { path: "/addMyTimesheet", method: "POST" },
      { path: "/updateMyTimesheet/MyTimesheetId", method: "PUT" },
      { path: "/deleteMyTimesheet/MyTimesheetId", method: "DELETE" },
      { path: "/approval/year/leadId/employeeId/status", method: "GET" },
      { path: "/updateApproval/MyTimesheetId", method: "PUT" },
    ]
    resp.end(JSON.stringify(URL))
  }
  else if (path === '/employee' && method === 'GET') {
    EmployeeController.getAllEmployee(req, resp)
  }
  else if (path.match(/^\/employee\/([0-9]+)$/) && method === 'GET') {
    const param = path.split("/")
    const leadId = parseInt(param[2])
    EmployeeController.getOneEmployee(req, resp,leadId)
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
    const param = path.split("/")
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
    const param = path.split("/")
    const employeeId = parseInt(param[2])
    try {
      EmployeeController.deleteEmployee(req, resp, employeeId)

    } catch (error) {
      console.log(error);
    }
  }
  else if (path === '/client' && method === 'GET') {
    ClientController.getAllClient(req, resp)
  }
  else if (path.match(/^\/client\/([0-9]+)$/) && method === 'GET') {
    const param = path.split("/")
    const clientId = parseInt(param[2])
    ClientController.getOneClient(req, resp,clientId)
  }
  else if (path === '/addClient' && method === 'POST') {
    try {
      postData.getPostData(req).then(formdata => {
        ClientController.registerClient(req, resp, formdata);
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match(/^\/updateClient\/([0-9]+)$/) && method === 'PUT') {
    const param = path.split("/")
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
    ProjectController.getAllProject(req, resp)
  }
  else if (path.match(/^\/project\/([0-9]+)$/) && method === 'GET') {
    const param = path.split("/")
    const projectId = parseInt(param[2])
    ProjectController.getOneProject(req, resp,projectId)
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
    const param = path.split("/")
    console.log(param);
    const projectId = parseInt(param[2])
    try {
      ProjectController.deleteProject(req, resp, projectId)

    } catch (error) {
      console.log(error);
    }
  }
  else if (path === '/chargeactivity' && method === 'GET') {
    ChargeActivityController.getAllChargeActivity(req, resp)
  }
  else if (path.match(/^\/chargeactivity\/([0-9]+)$/) && method === 'GET') {
    const param = path.split("/")
    const chargeActivityId = parseInt(param[2])
    ChargeActivityController.getOneChargeActivity(req, resp,chargeActivityId)
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
    const param = path.split("/")
    const chargeActivityId = parseInt(param[2])
    try {
      postData.getPostData(req).then(formdata => {
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
    TaskController.getAllTask(req, resp)
  }
  else if (path.match(/^\/task\/([0-9]+)$/) && method === 'GET') {
    const param = path.split("/")
    const employeeId = parseInt(param[2])
    TaskController.getOneTask(req, resp,employeeId)
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
  else if (path.match(/^\/timesheetsetting\/([0-9]+)$/) && method === 'GET') {
    const param = path.split("/")
    const employeeId = parseInt(param[2])
    TimesheetSettingController.getOneTimesheetSetting(req, resp,employeeId)
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
    const param = path.split("/")
    const employeeId = parseInt(param[2])
  MyTimesheetController.getAllMyTimesheet(req,resp,employeeId)
  }
  else if (path.match(/^\/mytimesheet\/([0-9]+)\/([0-9]+)\/([0-9]+)\/([0-9]+)$/) && method === 'GET') {
    let param = path.split("/")
    const week=param.splice(3,3).join("/")
    const employeeId = parseInt(param[2])
    MyTimesheetController.getAllWeeklyMyTimesheet(req,resp,employeeId,week)
  }
  else if (path === '/addMyTimesheet' && method === 'POST') {
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
    const timesheetId = parseInt(param[2])
    try {
      postData.getPostData(req).then(formdata => {
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
  else if (path.match(/.*\/approval\/([0-9]+)\/([0-9]+)\/([0-9]+)\/([a-z]+).*/) && method === 'GET') {
    const param = path.split("/")
    const year=parseInt(param[2])?param[2]:0
    const leadId = parseInt(param[3])?parseInt(param[3]):0
    const employeeId=parseInt(param[4])?parseInt(param[4]):0
    const status=param[5]
    ApprovalController.getAllApprovalTimesheet(req,resp,leadId,year,employeeId,status)
  }
  else if (path.match(/^\/updateApproval\/([0-9]+)$/) && method === 'PUT') {
    const param = path.split("/")
    const timesheetId = parseInt(param[2])
    try {
      postData.getPostData(req).then(formdata => {
        ApprovalController.updateStatusTimesheet(req, resp, timesheetId, formdata)
      })

    } catch (error) {
      console.log(error);
    }
  }
  else if (path.match(/^\/mydashboard\/([0-9]+)$/) && method === 'GET') {
    const param = path.split("/")
    const employeeId = parseInt(param[2])
    MyDashboardController.MyDashboard(req,resp,employeeId)
    }
  else {
    resp.writeHead(404, { 'Content-Type': 'application/json' });
    resp.end(JSON.stringify({ message: "Page not found" }))

  }
});

server.listen(process.env.port, () => {
  console.log(process.env.port)
})