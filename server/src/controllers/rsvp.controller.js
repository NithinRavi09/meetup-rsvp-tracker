const rsvpService = require("../services/rsvp.service");

async function createOrUpdateRsvp(req, res) {
    try {
        const eventId = req.params.id;
        const userId = req.user.userId;
        const { status } = req.body;

        const allowedStatuses = [
            "going",
            "maybe",
            "declined"
        ];

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

async function getRsvpsByEventId(req, res) {
    try {
        const eventId = req.params.id;

        const result = await rsvpService.getRsvpsByEventId(eventId);

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