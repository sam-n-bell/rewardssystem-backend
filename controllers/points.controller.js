const _ = require('lodash');
let db = require('../db');
const services = require('../services/index');
const moment = require('moment');

let PointsController = {
    getMyPoints: async function (req, res) {
        try {
                res.send('ok');
            } catch (err) {
                res.status(500).send({message: err.message});
            }
    },
    transferPoints: async function (req, res) {
        try {
                let giver = req.locals;
                let body = req.body;
                if (giver.available_points < body.amount) {
                    res.status(400).send({message: 'Not enough points to give'})
                } else if (giver.user_id === body.to_user) {
                    res.status(400).send({message: 'Can\'t give yourself points'})
                } else {
                    await services.points.transferPoints(giver.user_id, body.to_user, body.amount)
                    res.status(201).send('ok');
                }
            } catch (err) {
                res.status(500).send({message: err.message});
            }
    },
    getTransferHistoryForUser: async function (req, res) {
        try {
            let from_date = req.query.fromDate;
            let to_date = req.query.toDate;
            if (_.isNil((from_date)) ||  from_date === "") {
                from_date = moment().format('YYYY-MM-DD')
            }
            if (_.isNil((to_date)) ||  to_date === "") {
                to_date = moment().add(30, 'days').format('YYYY-MM-DD')
            }
            let transfers = await services.points.getUserTransferHistory(req.locals.user_id, from_date, to_date)
            res.send(transfers)
        } catch (err) {
            res.status(500).send({message: err.message});
        }
    },
    endCurrentMonthResetPoints: async function (req, res) {
        try {
            if (req.locals.administrator) {
                await services.points.endMonth();
                res.send('ok');
            } else {
                res.status(401).send({message: 'You do not have permission'})
            }
        } catch (err) {
            res.status(500).send({message: err.message});
        }
    },
    redeemPoints: async function (req, res) {
        try {
            if (req.locals.points_received < req.body.amount_of_points) {
                res.status(400).send({message: 'Not enough points'})
            } else if (req.body.amount_of_points % 10000 !== 0) {
                res.status(400).send({message: 'Invalid number of points'})
            } else {
                await services.points.redeemPoints(req.locals.user_id, req.body.amount_of_points)
                res.send('ok');
            }
        } catch (err) {
            res.status(500).send({message: err.message});
        }
    }
    
}

module.exports = PointsController;
