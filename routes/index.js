const express = require('express');
const routes = express.Router(); 
let authenicate = require('../middleware/authenticate')
//Module imports
let users = require('./users');
let authentication = require('./authentication');
const UsersController = require ('../controllers/users.controller');

let { Validator, ValidationError } = require('express-json-validator-middleware');
// Initialize a Validator instance first
let validator = new Validator({allErrors: true}); // pass in options to the Ajv instance
// Define a shortcut function
let validate = validator.validate;
let user_schema = {
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
routes.post('/public/register', validate({body: user_schema}),UsersController.createRegularUser);

routes.use('/authentication', authentication);

//Mounting routes
routes.use('/users', authenicate.authenicate_user, users);

module.exports = routes;