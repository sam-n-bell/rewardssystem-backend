const db = require('../db');
const _ = require('lodash')
const users = require('./users')
const crypto = require('crypto')

let reports = {
    
    aggregateReport: async function (num_months) {
        let monthly_aggregate_report = await db.any(`
                            WITH redemptions AS (
                                select
                                date_trunc('month', pr.date_created)::DATE as month,
                                pr.*
                                from point_redemptions pr
                            ), monthly_redemptions AS (
                                select
                                r.month,
                                sum(r.amount_of_points) as redeemed
                                from redemptions r
                                group by r.month
                            ), monthly_transfers AS (
                                select
                                t.month,
                                sum(t.given) as given,
                                sum(t.received) as received
                                from transfers_view t
                                group by t.month
                            )
                            select
                            mt.month, mt.given, mt.received, mr.redeemed
                            from monthly_transfers mt
                            left join monthly_redemptions mr on mr.month = mt.month
                            where mt.month >= date_trunc('month', current_date - INTERVAL '$1 months')::DATE
                            order by mt.month desc, mt.received desc;`, [num_months])

        let monthly_aggregate_user_report = await db.any(`
        WITH redemptions AS (
            select
            date_trunc('month', pr.date_created)::DATE as month,
            pr.*
            from point_redemptions pr
          ), monthly_redemptions AS (
              select
              r.month,
              r.user_id,
              0 as given,
              sum(r.amount_of_points) as redeemed,
              0 as received
              from redemptions r
              group by r.month, r.user_id
          ), monthly_given AS (
              select
              t.month,
              t.user_id,
              sum(t.given) as given,
              0 as redeemed,
              0 as received
              from transfers_view t
              group by t.month, t.user_id
          ), monthly_received AS (
              select
              t.month,
              t.user_id,
              0 as given,
              0 as redeemed,
              sum(t.received) as received
              from transfers_view t
              group by t.month, t.user_id
          ), data AS (select
              mr.*
              from monthly_redemptions mr
              union all
              select
              mg.*
              from monthly_given mg
              union all
              select
              mr2.*
              from monthly_received mr2
          ), monthly_amounts AS (
              select
              month,
              user_id,
              sum(redeemed) as redeemed,
              sum(given) as given,
              sum(received) as received
              from data d
              group by user_id, month
          )
          select
          m.month, (u.first_name || ' ' || u.last_name) as name, u.email, m.redeemed, m.given, m.received
          from monthly_amounts m
          left join users u on u.user_id = m.user_id
          where m.month >= date_trunc('month', current_date - INTERVAL '$1 months')
          order by month desc, received desc,given desc, redeemed desc;`, [num_months])
        return {
            monthly_aggregate: monthly_aggregate_report,
            monthly_aggregate_user: monthly_aggregate_user_report
        };
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
        let data = await db.any(`select
                        u.first_name || ' ' || u.last_name as name,
                        u.email,
                        count(pr.point_redemption_id) as num_redemptions,
                        sum(pr.amount_of_points) as sum_points_redeemed,
                        date_trunc('month', pr.date_created)::DATE as month
                    from point_redemptions pr
                    left join users u on u.user_id = pr.user_id
                    where date_trunc('month', pr.date_created)::DATE >= date_trunc('month', current_date - INTERVAL '$1 months')::DATE
                    group by email, month, name
                    order by month desc, name asc;`, [num_months])
        return data
    }
}
module.exports = reports; 
