const _ = require('lodash');
let db = require('../db');
const services = require('../services/index');


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
    
}

module.exports = PointsController;
