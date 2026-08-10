const eventService = require("../services/event.service");

// Create events
async function createEvent(req, res) {
    try {
        const {
            title,
            description,
            location,
            eventDate
        } = req.body;

        if (!title || !location || !eventDate) {
            return res.status(400).json({
                success: false,
                message: "Title, location and event date are required"
            });
        }

        const event = await eventService.createEvent({
            title,
            description,
            location,
            eventDate,
            userId: req.user.userId
        });

        return res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: event
        });

    } catch (error) {
        console.error("Create event error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

//Get all events
async function getAllEvents(req, res) {
    try {
        const events = await eventService.getAllEvents();

        return res.status(200).json({
            success: true,
            data: events
        });

    } catch (error) {
        console.error("Get events error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Get event by Id
async function getEventById(req, res) {
    try {
        const eventId = req.params.id;

        const event = await eventService.getEventById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: event
        });

    } catch (error) {
        console.error("Get event error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Update event
async function updateEvent(req, res) {
    try {
        const eventId = req.params.id;

        const {
            title,
            description,
            location,
            eventDate
        } = req.body;

        if (!title || !location || !eventDate) {
            return res.status(400).json({
                success: false,
                message: "Title, location and event date are required"
            });
        }

        const result = await eventService.updateEvent(
            eventId,
            req.user.userId,
            {
                title,
                description,
                location,
                eventDate
            }
        );

        if (result.error === "EVENT_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        if (result.error === "FORBIDDEN") {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to edit this event"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: result
        });

    } catch (error) {
        console.error("Update event error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Delete event 
async function deleteEvent(req, res) {
    try {
        const eventId = req.params.id;

        const result = await eventService.deleteEvent(
            eventId,
            req.user.userId
        );

        if (result.error === "EVENT_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        if (result.error === "FORBIDDEN") {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this event"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        });

    } catch (error) {
        console.error("Delete event error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
};