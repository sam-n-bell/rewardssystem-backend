var express = require('express')
var users = express.Router()
const db = require('../db');
const UsersController = require ('../controllers/users.controller');



var { Validator, ValidationError } = require('express-json-validator-middleware');
 
 
// Initialize a Validator instance first
var validator = new Validator({allErrors: true}); // pass in options to the Ajv instance
 
// Define a shortcut function
var validate = validator.validate;

// JSON Schema
var user_schema = {
    type: 'object',
    required: ['first_name', 'last_name', 'email', 'password'],
    properties: {
        first_name: {
            type: 'string'
        },
        last_name: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        password: {
            type: 'string'
        }
    }
}

users.get('/list', UsersController.getAllUsers);

users.post('/register', validate({body: user_schema}),UsersController.createRegularUser);


module.exports = users;