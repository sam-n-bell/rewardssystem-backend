const db = require('../db');
const _ = require('lodash')
const users = require('./users')
const crypto = require('crypto')

let reports = {
    
    aggregateReport: async function (num_months) {
       let data = await db.many(`select 
                                    t.month,
                                    t.name,
                                    t.received,
                                    t.given
                                 from transfers_view t
                                 where t.month::DATE >= date_trunc('month', current_date - INTERVAL '$1 months')::DATE
                                 order by t.month desc, t.received desc, t.name asc`, [num_months])
        return data;
    },
    pointUsageReport: async function() {
        let data = await db.any(`select
                    u.first_name || ' ' || u.last_name as name, u.email, u.available_points
                    from users u
                    where u.available_points > 0
                    order by u.available_points desc;`)
        return data;
    },
    redemptionsReport: async function(num_months) {
        console.log(`getting data for ${num_months} months`)
        let d = await db.one(`select date_trunc('month', current_date - INTERVAL '$1 months')::DATE`, [num_months])
        console.log(`d = `)
        console.log(d)
        let data = await db.any(`select
                        u.first_name || ' ' || u.last_name as name,
                        count(pr.point_redemption_id) as num_redemptions,
                        sum(pr.amount_of_points) as sum_points_redeemed,
                        date_trunc('month', pr.date_created)::DATE as month
                    from point_redemptions pr
                    left join users u on u.user_id = pr.user_id
                    where date_trunc('month', pr.date_created)::DATE >= date_trunc('month', current_date - INTERVAL '$1 months')::DATE
                    group by name, month
                    order by month desc, name asc;`, [num_months])
        return data
    }
}
module.exports = reports; 
