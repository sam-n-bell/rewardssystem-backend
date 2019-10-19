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

points.post('/give', validate({body: transfer_schema}),PointsController.transferPoints);


points.get('/history', PointsController.getTransferHistoryForUser)


module.exports = points;