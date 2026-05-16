const express =
require("express");

const router =
express.Router();

const {
createProject,
getProjects,
getProjectById,
addMember,
removeMember
} = require(
"../controllers/projectController"
);

const {
protect
} = require(
"../middleware/authMiddleware"
);

/* =====================
   CREATE PROJECT
===================== */

router.post(
"/create",
protect,
createProject
);

/* =====================
   GET ALL PROJECTS
===================== */

router.get(
"/all",
protect,
getProjects
);

/* =====================
   GET SINGLE PROJECT
===================== */

router.get(
"/:id",
protect,
getProjectById
);

/* =====================
   ADD MEMBER
===================== */

router.put(
"/add-member",
protect,
addMember
);

/* =====================
   REMOVE MEMBER
===================== */

router.put(
"/remove-member",
protect,
removeMember
);

module.exports =
router;