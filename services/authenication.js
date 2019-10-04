const db = require('../db');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash')


let authentication = {
    createToken: async function (user) {
         let token = jwt.sign({user: user}, process.env.SECRET_KEY, { expiresIn: '1d' });
         await db.none(`update user_tokens set expired = True where user_id = $1`, [user.user_id])
         await db.none(`insert into user_tokens (user_id, token) values ($1, $2)`, [user.user_id, token])
         return token;
        //  console.log(token)
        //  let dec = jwt.verify(token, process.env.SECRET_KEY)
    },
    decodeToken: async function (token) {
        let user_token = await db.oneOrNone(`select * from user_tokens where token = $1`, [token]);
        if (_.isNil(user_token)) {
            throw Error('Invalid token');
        } else if (user_token.expired) {
            throw Error('Expired token');
        }
        return jwt.verify(token, process.env.SECRET_KEY)
    },
    getTokenFromHeader: function (auth_header) {
        if (_.isNil(auth_header)) {
            throw Error('Missing authentication header');
        } else if (auth_header.split(' ')[0] !== 'Bearer') {
            throw Error('Invalid authentication header');
        } else if (_.isNil(auth_header.split(' ')[1])) {
            throw Error('Invalid authentication header');
        } else {
            return auth_header.split(' ')[1];
        }
    }

}

module.exports = authentication; 
