const _ = require('lodash');
let db = require('../db');
const services = require('../services/index');


let VenuesController = {
    getAllVenues: async function (req, res) {
        try {
            let venues = await services.venues.listVenues();
            res.json(venues);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    createVenue: async function (req, res) {
        try {
            if (!req.locals.administrator) {
                throw Error('Permission Denied')
            }
            let body = req.body;
            await services.venues.createVenue(body.name, body.address, body.activities)
            res.status(201).send('created');
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    deleteVenue: async function (req, res) {
        try {
            if (!req.locals.administrator) {
                throw Error('Denied')
            }
            await services.venues.deleteVenue(req.params.venueId)
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    getVenueAvailability: async function (req, res) {
        try {
            let venue = await services.venues.getVenueById(req.params.venueId);
            let slots = services.venues.generateTimeSlots(venue.open_time, venue.close_time);
            res.json(slots);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    }
}

module.exports = VenuesController;
