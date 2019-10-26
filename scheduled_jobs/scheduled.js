import moment from 'moment';
import cron from 'node-cron';
import db from '../db';

/**
 * Runs at midnight the first of every month
 */
cron.schedule("0 0 1 * * *", async () => {
    let today = moment().format('YYYY-MM-DD');
    let midnight = moment().startOf('month').format('YYYY-MM-DD')
    if (moment(midnight).isSame(today)) {
        db.none(`CALL reset_points_for_all_users(1000)`)
    } 
});

// cron.schedule("*/5 * * * * *", () => {
//     console.log('yay it worked')
//     console.log(moment().format())
// })