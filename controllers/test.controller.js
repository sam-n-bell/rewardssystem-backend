const _ = require('lodash');
const db = require('../db');
const services = require('../services/index');
const moment = require('moment');

let users = []

let TestController = {
    generateTestData: async function (req, res) {
        try {
                /**
                 * Generate test users if needed
                 */
                users = await services.users.getAllUsers()
                num_nonadmins = _.filter(users, { 'administrator': false })
                num_new_nonadmins = 13 - num_nonadmins.length;
                num_admins = _.filter(users, { 'administrator': true })
                num_new_admins = 1 - Number(num_admins.length)
                await services.test.generateTestUsers(num_new_nonadmins, num_new_admins)

                // Get updated list of users 
                users = await services.users.getAllUsers()
                // Give all users 1000 points
                users.forEach(user => {
                    user.available_points = 1000;
                    user.points_received = Math.floor(Math.random() * 20000 + 20000);
                }); 
                let transfers = []; 
                let redepemptions = [];
                for (let x = 2; x > 0; x--) {
                    let end = moment().subtract(x-1, 'months');
                    for (let beg = moment().subtract(x, 'months'); end.diff(beg, 'days') > 0; beg.add(1, 'day')) {
                        for (let x2 = 6; x2 > 0; x2--) {
                            //console.log(`running for the ${x2}th time`)
                            if (Math.floor(Math.random() * 2) == 0) {
                                let user1 = users[Math.floor(Math.random() * users.length)];
                                let user2 = users[Math.floor(Math.random() * users.length)];
                                if (user1.user_id !== user2.user_id) {
                                    let transfer_amount = Math.ceil(Math.floor((Math.random() * user1.available_points))/100) * 100;
                                    if (user1.available_points >= transfer_amount && transfer_amount > 0) {
                                        user1.available_points -= transfer_amount;
                                        user2.points_received += transfer_amount;
                                        transfers.push({from_user: user1.user_id, to_user: user2.user_id, amount: transfer_amount, date_created: beg.format()})
                                        if (user2.points_received >= 20000) {
                                            redepemptions.push({user_id: user2.user_id, amount_of_points: 20000, date_created: beg.format()})
                                            user2.points_received -= 20000;
                                        } else if (user2.points_received >= 10000) {
                                            redepemptions.push({user_id: user2.user_id, amount_of_points: 10000, date_created: beg.format()})
                                            user2.points_received -= 10000;
                                        }
                                        
                                    }
                                }
                            }
                        }
                        // if end of the month, reset available points
                        let e = moment(beg).endOf('month')
                        if (beg.isSame(e, 'day') || beg.isSame(moment(), 'day')) {
                            users.forEach(user => {
                                user.available_points = 1000;
                            })
                        }
                    }
                }
                
                transfers.forEach(async transfer => {
                    try {
                        await services.test.insertTestTransfers(transfer.from_user, transfer.to_user, transfer.amount, transfer.date_created)
                    } catch (err) {
                        console.log(err.message)
                    }
                })
                redepemptions.forEach(async r => {
                    try {
                        await services.test.insertTestRedemptions(r.user_id, r.amount_of_points, r.date_created)
                } catch (err) {
                        console.log(err.message)
                    }
                })
                // set current amounts for month for each user
                users.forEach(async u => {
                    try {
                        await services.test.updateUserBalances(u.user_id, u.points_received, u.available_points);
                    } catch (err) {
                        console.log(err.message)
                    }
                })

                res.send('ok');
            } catch (err) {
                res.status(500).send({message: err.message});
            }
    },
    
}

module.exports = TestController;
