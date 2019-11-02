const _ = require('lodash');
let db = require('../db');
const services = require('../services/index');
const moment = require('moment');

let ReportsController = {
    getAggregateReport: async function (req, res) {
        try {
                res.send('ok');
            } catch (err) {
                res.status(500).send({message: err.message});
            }
    },
    getPointUsageReport: async function (req, res) {
        try {
                let query = await services.reports.pointUsageReport()
                res.json(query)
            } catch (err) {
                res.status(500).send({message: err.message});
            }
    },
    getRedemptionsReport: async function (req, res) {
        try {
            let query = await services.reports.redemptionsReport()
            res.json(query)
        } catch (err) {
            res.status(500).send({message: err.message});
        }
    }
}

module.exports = ReportsController;
