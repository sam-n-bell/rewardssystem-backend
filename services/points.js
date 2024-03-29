const db = require('../db');
const _ = require('lodash')
const moment = require('moment');


let points = {
    transferPoints: async function(from_user, to_user, amount) {
       await db.query(`CALL transfer_points($1, $2, $3);`, [from_user, to_user, amount])
       await db.none(`insert into transfers (from_user, to_user, amount) VALUES ($1, $2, $3)`, [from_user, to_user, amount])
    },
    redeemPoints: async function(user_id, amount_of_points) {
        await db.none(`INSERT into point_redemptions
                        (user_id, amount_of_points)
                        VALUES ($1, $2)`, [user_id, amount_of_points]);
        await db.none(`UPDATE users SET points_received = (points_received - $1) where user_id = $2`, [amount_of_points, user_id])

    },
    endMonth: async function(amount) {
        await db.query(`CALL reset_points_for_all_users($1);`, [amount])
    },
    getUserTransferHistory: async function(user_id, from_date, to_date) {
        let transfers = await db.any(`
                        select 
                        json_build_object('user_id', u.user_id, 'first_name', u.first_name, 'last_name', u.last_name) as to_user,
                        json_build_object('user_id', u2.user_id, 'first_name', u2.first_name, 'last_name', u2.last_name) as from_user,
                        CASE WHEN t.from_user = $1 THEN 'giving' ELSE 'receiving' END AS direction,
                        t.amount,
                        t.date_created
                        from transfers t
                        left join users u on u.user_id = t.to_user
                        left join users u2 on u2.user_id = t.from_user
                        where (t.from_user = $1 or t.to_user = $1) 
                        and (t.date_created::DATE >= $2::DATE and t.date_created::DATE <= $3::DATE)
                        order by t.date_created desc;`, 
                        [user_id, from_date, to_date])
        return transfers;
    }
}

module.exports = points; 
