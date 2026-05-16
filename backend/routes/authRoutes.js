const express = require("express");
const router = express.Router();

const {
  signupUser,
  loginUser,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorizeRoles = require(
  "../middleware/roleMiddleware"
);

// Signup
router.post("/signup", signupUser);

// Login
router.post("/login", loginUser);

// Protected Route
router.get(
  "/profile",
  protect,
  (req, res) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);

// Admin Route
router.get(
  "/admin",
  protect,
  authorizeRoles("Admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

module.exports = router;