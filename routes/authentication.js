var express = require('express')
var authentication = express.Router()
let db = require('../db');
let a = require('../controllers/authentication.controller')
let AuthenticationController = require ('../controllers/authentication.controller.js');


var { Validator, ValidationError } = require('express-json-validator-middleware');
 
 
// Initialize a Validator instance first
var validator = new Validator({allErrors: true}); // pass in options to the Ajv instance
 
// Define a shortcut function
var validate = validator.validate;

// JSON Schema
var login_schema = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: {
            type: 'string'
        },
        password: {
            type: 'string'
        }
    }
}

authentication.post('/login', validate({body: login_schema}), AuthenticationController.loginUser );
authentication.get('/user', AuthenticationController.authenticateUser);

module.exports = authentication;