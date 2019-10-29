const db = require('../db');
const _ = require('lodash')
const users = require('./users')
const crypto = require('crypto')

const first_names = ['jadzia', 'michael', 'nathan', 'coty', 'josh', 'theresa', 'rose', 'elizabeth']
const last_names = ['paredes', 'opela', 'dax', 'bell', 'mueller', 'morrow', 'wolfe', 'jones']

let test = {
    
    generateTestUsers: async function (num_new_users, num_new_admins) {
        for (let i = 0; i < num_new_users; i++) {
            let fname = first_names[Math.floor(Math.random() * first_names.length)]
            let lname = last_names[Math.floor(Math.random() * last_names.length)]
            await users.createUser(fname, lname, crypto.randomBytes(5).toString('hex') + '@test.com', 'password')
        }
        for (let i = 0; i < num_new_admins; i++) {
            let fname = first_names[Math.floor(Math.random() * 6)]
            let lname = last_names[Math.floor(Math.random() * 6)]
            await users.createUser(fname, lname, crypto.randomBytes(5).toString('hex') + '@test.com', 'password', true) 
        }
    },
    insertTestTransfers: async function(from_user, to_user, amount, date_created) {
        await db.none(`insert into transfers (from_user, to_user, amount, date_created) VALUES ($1, $2, $3, $4)`, [from_user, to_user, amount, date_created])
    },
    insertTestRedemptions: async function(user_id, amount_of_points, date_created) {
        await db.none(`insert into point_redemptions (user_id, amount_of_points, date_created) VALUES ($1, $2, $3)`, [user_id, amount_of_points, date_created])
    },
    updateUserBalances: async function(user_id, points_received, available_points) {
        await db.none(`update users set points_received = $3, available_points = $2 where user_id = $1`, [user_id, available_points, points_received])
    }
}
module.exports = test; 
