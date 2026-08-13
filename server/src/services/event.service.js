const eventRepository = require("../repositories/event.repository");

// This function creates a new event record in the database.
async function createEvent({
    title,
    description,
    location,
    eventDate,
    eventEndDate,
    userId
}) {
    const eventId = await eventRepository.createEvent({
        title,
        description,
        location,
        eventDate,
        eventEndDate,
        createdBy: userId
    });

    return await eventRepository.findEventById(eventId);
}

// This function fetches all events.
async function getAllEvents() {
    return await eventRepository.findAllEvents();
}

// This function fetches a single event by ID.
async function getEventById(eventId) {
    return await eventRepository.findEventById(eventId);
}

// This function updates an event after verifying ownership.
async function updateEvent(
    eventId,
    userId,
    { title, description, location, eventDate, eventEndDate }
) {
    const event = await eventRepository.findEventById(eventId);

    // Return error if event does not exist
    if (!event) {
        return {
            error: "EVENT_NOT_FOUND"
        };
    }

    // Verify if the current user is the owner of the event
    if (event.created_by !== userId) {
        return {
            error: "FORBIDDEN"
        };
    }

    await eventRepository.updateEvent(eventId, {
        title,
        description,
        location,
        eventDate,
        eventEndDate
    });

    return await eventRepository.findEventById(eventId);
}

// This function deletes an event after verifying ownership.
async function deleteEvent(eventId, userId) {
    const event = await eventRepository.findEventById(eventId);

    // Return error if event does not exist
    if (!event) {
        return {
            error: "EVENT_NOT_FOUND"
        };
    }

    // Verify if the current user is the owner of the event
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