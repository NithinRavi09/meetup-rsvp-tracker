const rsvpRepository = require("../repositories/rsvp.repository");
const eventRepository = require("../repositories/event.repository");

async function createOrUpdateRsvp(eventId, userId, status) {

    const event = await eventRepository.findEventById(eventId);

    if (!event) {
        return {
            error: "EVENT_NOT_FOUND"
        };
    }

    const existingRsvp = await rsvpRepository.findRsvp(
        userId,
        eventId
    );

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