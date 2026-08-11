const rsvpRepository = require("../repositories/rsvp.repository");
const eventRepository = require("../repositories/event.repository");

// This function creates a new RSVP or updates an existing RSVP for a given user and event.
async function createOrUpdateRsvp(eventId, userId, status) {

    // Verify that the event exists
    const event = await eventRepository.findEventById(eventId);

    if (!event) {
        return {
            error: "EVENT_NOT_FOUND"
        };
    }

    // Check for an existing RSVP record
    const existingRsvp = await rsvpRepository.findRsvp(
        userId,
        eventId
    );

    // Update if RSVP already exists, otherwise create a new record
    if (existingRsvp) {
        await rsvpRepository.updateRsvp(
            userId,
            eventId,
            status
        );
    } else {
        await rsvpRepository.createRsvp(
            userId,
            eventId,
            status
        );
    }

    return await rsvpRepository.findRsvp(
        userId,
        eventId
    );
}

// This function fetches all RSVPs for an event after checking if the event exists.
async function getRsvpsByEventId(eventId) {
    const event = await eventRepository.findEventById(eventId);

    if (!event) {
        return {
            error: "EVENT_NOT_FOUND"
        };
    }

    const rsvps = await rsvpRepository.findRsvpsByEventId(eventId);

    return rsvps;
}

module.exports = {
    createOrUpdateRsvp,
    getRsvpsByEventId
};