const express = require("express");

const eventController = require("../controllers/event.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const rsvpController = require("../controllers/rsvp.controller");

const router = express.Router();

router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.post(
    "/",
    authenticateToken,
    eventController.createEvent
);
router.put(
    "/:id",
    authenticateToken,
    eventController.updateEvent
);
router.delete(
    "/:id",
    authenticateToken,
    eventController.deleteEvent
);
router.post(
    "/:id/rsvp",
    authenticateToken,
    rsvpController.createOrUpdateRsvp
);
router.get(
    "/:id/rsvps",
    rsvpController.getRsvpsByEventId
);

module.exports = router;