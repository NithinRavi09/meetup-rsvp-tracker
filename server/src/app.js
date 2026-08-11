// Configure Express application and middleware setup
const express = require("express");
const cors = require("cors");

const authRoutes = require('./routes/auth.routes')
const eventRoutes = require("./routes/event.routes");

const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
// Parse incoming requests with JSON payloads
app.use(express.json());

// Health check endpoint to verify server status
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running"
    });
});

// Register API route handlers
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

module.exports = app;