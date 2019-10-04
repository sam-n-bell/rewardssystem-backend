
let express = require('express');
let cors = require('cors');
let app = express();
let routes = require('./routes/index');
var bodyParser = require('body-parser')
require('dotenv').config();
require('babel-register');


app.use(cors());

app.use(bodyParser.json())// get route index file and mount it
app.use('/v1', routes);

app.get('/*', function(req, res){
    res.json({message: 'Database Management Project by Sam Bell and Sasha Opela, The University of Texas at Austin'});
});

// body JSON validator
const { ValidationError } = require('express-json-validator-middleware');
app.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
        console.log(err)
        res.status(400).send({message: err.validationErrors.body[0].message});
        next();
    }
    else next(err); // pass error on if not a validation error
});

let port = process.env.PORT || 5000;

app.listen(port, function(){
    console.log('listening in on port ' + port);
});