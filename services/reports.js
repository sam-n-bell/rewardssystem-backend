const db = require('../db');
const _ = require('lodash')
const users = require('./users')
const crypto = require('crypto')

let reports = {
    
    aggregateReport: async function () {
       
    },
    pointUsageReport: async function() {
        let data = await db.any(`select
                    u.first_name || ' ' || u.last_name as name, u.email, u.available_points
                    from users u
                    where u.available_points > 0
                    order by u.available_points desc;`)
        return data;
    },
    redemptionsReport: async function() {
        let data = await db.any(`select
                        u.first_name || ' ' || u.last_name as name,
                        count(pr.point_redemption_id),
                        sum(pr.amount_of_points),
                        date_trunc('month', pr.date_created)::DATE as date
                    from point_redemptions pr
                    left join users u on u.user_id = pr.user_id
                    where pr.date_created >= current_date - INTERVAL '2 months'
                    group by name, date
                    order by date desc, name asc;`)
        return data
    }
}
module.exports = reports; 
