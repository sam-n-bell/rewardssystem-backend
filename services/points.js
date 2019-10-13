const db = require('../db');
const _ = require('lodash')
const moment = require('moment');


let points = {
    transferPoints: async function(from_user, to_user, amount) {
       await db.query(`CALL transfer_points($1, $2, $3);`, [from_user, to_user, amount])
       await db.none(`insert into transfers (from_user, to_user, amount) VALUES ($1, $2, $3)`, [from_user, to_user, amount])
    },
    redeemPoints: async function() {
        
    },
    endMonth: async function() {

    }
}

module.exports = points; 
