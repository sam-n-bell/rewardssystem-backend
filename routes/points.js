let express = require('express')
let points = express.Router()
const db = require('../db');
const PointsController = require ('../controllers/points.controller');



let { Validator, ValidationError } = require('express-json-validator-middleware');
 
 
// Initialize a Validator instance first
let validator = new Validator({allErrors: true}); // pass in options to the Ajv instance
 
// Define a shortcut function
let validate = validator.validate;

// JSON Schema
let transfer_schema = {
    type: 'object',
    required: ['to_user', 'amount'],
    properties: {
        to_user: {
            type: 'string'
        },
        amount: {
            type: 'number'
        }
    }
}

let redeem_schema = {
    type: 'object',
    required: ['amount_of_points'],
    properties: {
        amount_of_points: {
            type: 'number'
        }
    }
}
points.post('/give', validate({body: transfer_schema}),PointsController.transferPoints);

points.post('/redeem', validate({body: redeem_schema}), PointsController.redeemPoints)

points.get('/history', PointsController.getTransferHistoryForUser)

let reset_schema = {
    type: 'object',
    required: ['amount_of_points'],
    properties: {
        amount_of_points: {
            type: 'number'
        }
    }
}
points.put('/reset', validate({body: reset_schema}), PointsController.endCurrentMonthResetPoints)


module.exports = points;