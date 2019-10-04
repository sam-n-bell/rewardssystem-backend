let db = require('../db');
const services = require('../services/index');
const _ = require('lodash');

let AuthenticationController = {
    loginUser: async function (req, res) {
        try {
            let body = req.body;
            let user = await services.users.getUserByEmail(body.email);
            await services.users.checkPassword(body.password, user.password);
            let token = await services.authentication.createToken(user);
            if (!_.isNil(user.password)) {
                delete user.password;
            }
            res.status(201).json({ user: user, token: token });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    authenticateUser: async function (req, res) {
        try {
            let token = services.authentication.getTokenFromHeader(req.headers.authorization);
            let decoded = await services.authentication.decodeToken(token);
            let user = decoded.user;
            if (!_.isNil(user.password)) {
                delete user.password;
            }
            res.json(user);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
}

module.exports = AuthenticationController;
