const Holiday = require('../models/holiday');
const helpers = require('./../helper/helper');
 require('mongoose');
module.exports.getHolidays=async (req,resp,year,startDate)=>{

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    Holiday.find({
        year: parseInt(year),
        date: { $gte: start, $lte: end } 
    }).then(holiday => {
       return helpers.success(resp,holiday)
    })

}

module.exports.getHolidaysOfFullYear=async (req,resp,year)=>{
    Holiday.find({
        year: parseInt(year),
    }).then(holiday => {
       return helpers.success(resp,holiday)
    })

}