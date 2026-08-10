const eventRepository = require("../repositories/event.repository");

// service create event
async function createEvent({
    title,
    description,
    location,
    eventDate,
    userId
}) {
    const eventId = await eventRepository.createEvent({
        title,
        description,
        location,
        eventDate,
        createdBy: userId
    });

    return await eventRepository.findEventById(eventId);
}

// get all service events
async function getAllEvents() {
    return await eventRepository.findAllEvents();
}

// get service event by Id
async function getEventById(eventId) {
    return await eventRepository.findEventById(eventId);
}

// Update service event 
async function updateEvent(
    eventId,
    userId,
    { title, description, location, eventDate }
) {
    const event = await eventRepository.findEventById(eventId);

    if (!event) {
        return {
            error: "EVENT_NOT_FOUND"
        };
    }

    if (event.created_by !== userId) {
        return {
            error: "FORBIDDEN"
        };
    }

    await eventRepository.updateEvent(eventId, {
        title,
        description,
        location,
        eventDate
    });

    return await eventRepository.findEventById(eventId);
}

// Delete event 
async function deleteEvent(eventId, userId) {
    const event = await eventRepository.findEventById(eventId);

    if (!event) {
        return {
            error: "EVENT_NOT_FOUND"
        };
    }

    if (event.created_by !== userId) {
        return {
            error: "FORBIDDEN"
        };
    }

    await eventRepository.deleteEvent(eventId);

    return {
        success: true
    };
}

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
};