require('dotenv').config();
const mongoose=require('mongoose');
mongoose.connect(
    // "mongodb+srv://sohailkhan:sohailkhan@cluster0.flsvmxv.mongodb.net/timesheet_application?retryWrites=true&w=majority"
    process.env.mongodbURL).then(result=>{
});

