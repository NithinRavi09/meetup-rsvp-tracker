const express = require("express");

const eventController = require("../controllers/event.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

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

module.exports = router;