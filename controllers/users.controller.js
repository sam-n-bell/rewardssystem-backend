const _ = require('lodash');
let db = require('../db');
const services = require('../services/index');


let UsersController = {
    getAllUsers: async function (req, res) {
        try {
                let users = await services.users.getAllUsers();
                res.json(users);
            } catch (err) {
                res.status(500).send({message: err.message});
            }
    },
    getAllUsersAdmin: async function (req, res) {
        try {
                if (!req.locals.administrator) {
                    res.status(401).send()
                } else {
                    let users = await services.users.getAllUsersAdmin();
                    res.json(users);
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
                if (!_.isNil(user)) {
                    res.status(400).send('Email already on file')
                } else {
                    res.status(201).send('created');
                }
                // throw Error('Email already on file');
                //let new_user = await services.users.createUser(body.first_name, body.last_name, body.email, body.password);
            } catch (err) {
                res.status(500).send({message: err.message});
            }
    },
    makeUserAdmin: async function (req, res) {
        try {
            if (req.locals.administrator) {
                await services.users.makeUserAdmin(req.params.user_id)
                res.send('ok')
            } else {
                res.status(401).send()
            }
        } catch (err) {
                res.status(500).send({message: err.message});
        }
    },
    resetPointsForUsers: async function (req, res) {
        try {
            if (req.locals.administrator) {
                await services.users.resetPointsForUsers()
                res.send('ok')
            } else {
                res.status(401).send()
            }
        } catch (err) {
                res.status(500).send({message: err.message});
        }
    }
}

module.exports = UsersController;
