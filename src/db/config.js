require('dotenv').config();
const mongoose=require('mongoose');
mongoose.connect(process.env.mongodbURL).then(result=>{
    console.log("connected",process.env.mongodbURL);
});