let express = require('express')
let test = express.Router()
const db = require('../db');
const TestController = require ('../controllers/test.controller');

test.post('/generate', TestController.generateTestData);



module.exports = test;