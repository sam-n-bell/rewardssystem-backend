require('dotenv').config();

const initOptions = {
    // promiseLib: promise // overriding the default (ES6 Promise);
};

const pgp = require('pg-promise')(initOptions);


const cn = {
    host: process.env.HOST,
    port: process.env.DB_PORT,
    database: process.env.DATABASE,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    ssl: process.env.SSL
}
const db = pgp(cn);
let result = db.any(`select now()`)

const types = require('pg').types;


types.setTypeParser(1700, function(val) {
    return parseFloat(val)
});

//fix for using timezone without time stamp in database, otherwise javascript or pgpromise wants to try and be smart
types.setTypeParser(1114, function (stringValue) {
    return stringValue;
});


module.exports = db;