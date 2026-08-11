const express = require("express");

const authController = require("../controllers/auth.controller");

const router = express.Router();

// Route to handle user login and JWT issuance
router.post("/login", authController.login);

module.exports = router;