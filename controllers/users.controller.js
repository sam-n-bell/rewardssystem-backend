const _ = require('lodash');
let db = require('../db');
const services = require('../services/index');


let UsersController = {
    getAllUsers: async function (req, res) {
        try {
                if (req.locals.administrator) {
                    let users = await services.users.getAllUsers();
                    res.json(users);
                } else {
                    res.status(401).send();
                }
            } catch (err) {
                res.status(500).send({message: err.message});
            }
    },
    //user_name, email, password, administrator
    createRegularUser: async function (req, res) {
        try {
                let body = req.body;
                let user = await services.users.getUserByEmail(body.email);
                if (!_.isNil(user)) throw Error('Email already on file');
                let new_user = await services.users.createUser(body.first_name, body.last_name, body.email, body.password);
                res.status(201).send('created');
            } catch (err) {
                res.status(500).send({message: err.message});
            }
    }
}

module.exports = UsersController;
