const rsvpService = require("../services/rsvp.service");

// This function creates or updates an RSVP for an event.
async function createOrUpdateRsvp(req, res) {
    try {
        // Get the event ID from the request parameters and user ID from auth token
        const eventId = req.params.id;
        const userId = req.user.userId;
        const { status } = req.body;

        const allowedStatuses = [
            "going",
            "maybe",
            "declined"
        ];

        // Return 400 when RSVP status is missing or invalid
        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be going, maybe, or declined"
            });
        }

        const rsvp = await rsvpService.createOrUpdateRsvp(
            eventId,
            userId,
            status
        );

        // Return 404 when the requested event does not exist
        if (rsvp.error === "EVENT_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "RSVP saved successfully",
            data: rsvp
        });

    } catch (error) {
        console.error("RSVP error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// This function fetches all RSVPs for an event.
async function getRsvpsByEventId(req, res) {
    try {
        // Get the event ID from the request parameters
        const eventId = req.params.id;

        const result = await rsvpService.getRsvpsByEventId(eventId);

        // Return 404 when the requested event does not exist
        if (result.error === "EVENT_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("Get RSVPs error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = {
    createOrUpdateRsvp,
    getRsvpsByEventId
};