let express = require('express')
let reports = express.Router()
const db = require('../db');
const ReportsController = require ('../controllers/reports.controller');


reports.get('/aggregate', ReportsController.getAggregateReport)
reports.get('/point-utilization', ReportsController.getPointUsageReport)
reports.get('/redemptions', ReportsController.getRedemptionsReport)


module.exports = reports;