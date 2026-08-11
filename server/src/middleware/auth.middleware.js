const jwt = require("jsonwebtoken");

// This middleware checks whether the user has provided a valid JWT token in the Authorization header.
function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        // Check if the Authorization header is present and correctly formatted with 'Bearer '
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required"
            });
        }

        // Extract token from header
        const token = authHeader.split(" ")[1];

        // Verify token signature and expiration
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Attach decoded payload to request object
        req.user = decoded;

        next();

    } catch (error) {
        // Return 401 response if token verification fails
        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token"
        });
    }
}

module.exports = {
    authenticateToken
};