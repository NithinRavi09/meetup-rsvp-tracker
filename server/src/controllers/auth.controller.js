const authService = require("../services/auth.service");

// This function authenticates user credentials and returns a JWT token upon successful login.
async function login(req, res) {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Validate that required fields are present; return 400 if missing
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Authenticate user credentials via authService
        const result = await authService.login(email, password);

        // Return successful authentication response with user data and token
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });

    } catch (error) {
        // Handle invalid login credentials with 401 Unauthorized response
        if (error.message === "INVALID_CREDENTIALS") {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        console.error("Login error:", error);

        // Return 500 status code for unexpected internal errors
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = {
    login
};