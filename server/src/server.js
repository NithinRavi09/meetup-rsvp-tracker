require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

// This function initializes the MySQL database connection and starts the Express server.
async function startServer() {
    try {
        // Obtain a connection from the pool to test connectivity
        const connection = await pool.getConnection();

        console.log("MySQL connected successfully");

        // Release the connection back to the pool
        connection.release();

        // Start listening for incoming HTTP requests on the specified port
        app.listen(PORT, () => {
            console.log(`Server running on port http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

startServer();