const db = require('../db');
// const bcrypt = require('bcrypt');
const bcrypt = require('bcrypt')
const _ = require('lodash')
const moment = require('moment');


let venues = {
    deleteVenue: async function(venueId) {
       //delete events and participants
       let events = await db.any(`select * from events where venue_id = $1`, [venueId]);
       events.forEach(async (e) => {
            await db.none(`delete from participants where event_id = $1`, [e.event_id]);
       });
       await db.none(`delete from events where event_id = $1`, [venueId]);
    },
    createVenue: async function(name, address, acitivities) {
        await db.none(`insert into venues (venue_name, address, activities) values ($1, $2, $3)`, [name, address, acitivities]);
    },
    listVenues: async function() {
        let venues = await db.any(`select * from venues`);
        return venues;
    },
    getVenueById: async function(venueId) {
        let venue = await db.one(`select * from venues where venue_id = $1`, [venueId]);
        return venue
    },
    generateTimeSlots: function(start_time, end_time) {
        let slots = [];
        let start = moment(start_time, 'HH:mm:ss');
        let end = moment(end_time, 'HH:mm:ss');
        for (let start = moment(start_time, 'HH:mm:ss'); start.isBefore(end); start.add(1, 'hour')) {
            let slot_copy = moment(_.clone(start));
            slots.push(
                {value: slot_copy.format('HH:mm:ss'),
                 label: slot_copy.format('h:mm a')}
            );
        }
        return slots; 
    }
}

module.exports = venues; 
