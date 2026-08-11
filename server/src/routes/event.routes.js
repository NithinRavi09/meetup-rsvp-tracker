const express = require("express");

const eventController = require("../controllers/event.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const rsvpController = require("../controllers/rsvp.controller");

const router = express.Router();

// Route to fetch all events
router.get("/", eventController.getAllEvents);

// Route to fetch a single event by ID
router.get("/:id", eventController.getEventById);

// Route to create a new event (requires authentication)
router.post(
    "/",
    authenticateToken,
    eventController.createEvent
);

// Route to update an existing event (requires authentication)
router.put(
    "/:id",
    authenticateToken,
    eventController.updateEvent
);

// Route to delete an event (requires authentication)
router.delete(
    "/:id",
    authenticateToken,
    eventController.deleteEvent
);

// Route to create or update an RSVP for an event (requires authentication)
router.post(
    "/:id/rsvp",
    authenticateToken,
    rsvpController.createOrUpdateRsvp
);

// Route to fetch all RSVPs for a specific event
router.get(
    "/:id/rsvps",
    rsvpController.getRsvpsByEventId
);

module.exports = router;