const express = require("express");
const router = express.Router();

const {
  createTask,
  getMyTasks,
  updateTaskStatus,
  editTask,
  deleteTask,
} = require(
  "../controllers/taskController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

/* =====================
   CREATE TASK
===================== */
router.post(
  "/create",
  protect,
  createTask
);

/* =====================
   GET TASKS
===================== */
router.get(
  "/my-tasks",
  protect,
  getMyTasks
);

/* =====================
   UPDATE STATUS
===================== */
router.put(
  "/update-status",
  protect,
  updateTaskStatus
);

/* =====================
   EDIT TASK
===================== */
router.put(
  "/edit/:id",
  protect,
  editTask
);

/* =====================
   DELETE TASK
===================== */
router.delete(
  "/delete/:id",
  protect,
  deleteTask
);

module.exports = router;