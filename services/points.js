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

    },
    getUserTransferHistory: async function(user_id, from_date, to_date) {
        let transfers = await db.any(`select 
                        u.first_name,
                        u.last_name,
                        t.amount,
                        t.date_created
                        from transfers t
                        left join users u on u.user_id = t.to_user
                        where (t.from_user = $1 or t.to_user = $1) 
                        and (t.date_created::DATE >= $2 and t.date_created::DATE <= $3)
                        order by t.date_created desc;`, [user_id, from_date, to_date])
        return transfers;
    }
}

module.exports = points; 
