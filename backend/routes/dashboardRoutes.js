const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  removeTeamMember,
} = require(
  "../controllers/dashboardController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

// Dashboard Stats
router.get(
  "/stats",
  protect,
  getDashboardStats
);

router.put(
  "/remove-member",
  protect,
  removeTeamMember
);

module.exports = router;
