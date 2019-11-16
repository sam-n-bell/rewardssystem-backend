const db = require('../db');
// const bcrypt = require('bcrypt');
const bcrypt = require('bcrypt')
const _ = require('lodash')


let users = {
    getAllUsers: async function () {
        let users = await db.any(`select user_id, first_name, last_name, email from users`);
        return users;
    },
    getAllUsersAdmin: async function () {
        let users = await db.any(`select user_id, first_name, last_name, email, administrator, date_created, available_points, points_received from users`);
        return users;
    },
    getUserByEmail: async function (email) {
        let user = await db.oneOrNone(`select * from users where email = $1`, [email]);
        return user;
   },
    getUserById: async function (user_id) {
         let user = await db.oneOrNone(`select * from users where user_id = $1`, [user_id]);
         return user;
    },
    createUser: async function (first_name, last_name, email, password, administrator) {
        let hashed_password = await bcrypt.hash(password, 10);
        // let unhashed = await bcrypt.compare(password ,hashed_password);
        let user = await db.one(`
        INSERT INTO USERS 
        (first_name, last_name, email, password, administrator) 
        VALUES ($1, $2, $3, $4, $5) 
        returning 
        user_id, email, first_name, last_name`, [first_name, last_name, email, hashed_password, administrator]);
        return user;
    },
    checkPassword: async function(provided_password, actual_password) {
        let correct = await bcrypt.compare(provided_password ,actual_password);
        if (!correct) throw Error('Invalid login credentials');
        return true;
    },
    makeUserAdmin: async function (user_id) {
        await db.none(`update users set administrator = True where user_id = $1`, [user_id])
    }
}

module.exports = users; 
