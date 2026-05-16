const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

/* =====================
   CREATE TASK
===================== */

const createTask =
async (req, res) => {

try {

const {
title,
description,
dueDate,
priority,
assignedEmail,
projectId
} = req.body;

const project =
await Project.findById(
projectId
);

if (!project) {
return res.status(404)
.json({
success: false,
message:
"Project not found"
});
}

/* Only Admin */

if (
project.admin.toString() !==
req.user._id.toString()
) {
return res.status(403)
.json({
success: false,
message:
"Only admin can create tasks"
});
}

const user =
await User.findOne({
email:
assignedEmail
});

if (!user) {
return res.status(404)
.json({
success: false,
message:
"User not found"
});
}

const task =
await Task.create({
title,
description,
dueDate,
priority,
assignedTo:
user._id,
project:
projectId,
createdBy:
req.user._id
});

res.status(201).json({
success: true,
message:
"Task created successfully",
task
});

} catch (error) {

console.error(error);

res.status(500).json({
success: false,
message:
"Server Error"
});
}
};

/* =====================
   GET MY TASKS
===================== */

const getMyTasks =
async (req, res) => {

try {

let tasks;

if (
req.user.role ===
"Admin"
) {

tasks =
await Task.find()
.populate(
"project",
"name"
)
.populate(
"assignedTo",
"name email"
);

} else {

tasks =
await Task.find({
assignedTo:
req.user._id
})
.populate(
"project",
"name"
)
.populate(
"assignedTo",
"name email"
);
}

res.status(200).json({
success: true,
count:
tasks.length,
tasks
});

} catch (error) {

res.status(500).json({
success: false,
message:
"Server Error"
});
}
};

/* =====================
   UPDATE STATUS
===================== */

const updateTaskStatus =
async (req, res) => {

try {

const {
taskId,
status
} = req.body;

const task =
await Task.findById(
taskId
);

if (!task) {
return res.status(404)
.json({
success: false,
message:
"Task not found"
});
}

task.status =
status;

await task.save();

res.status(200).json({
success: true,
message:
"Task updated",
task
});

} catch (error) {

res.status(500).json({
success: false,
message:
"Server Error"
});
}
};

/* =====================
   EDIT TASK
===================== */

const editTask =
async (req, res) => {

try {

const { id } =
req.params;

const {
title,
description,
priority,
dueDate
} = req.body;

const task =
await Task.findById(id);

if (!task) {
return res.status(404)
.json({
success: false,
message:
"Task not found"
});
}

/* Admin only */

if (
req.user.role !==
"Admin"
) {
return res.status(403)
.json({
success: false,
message:
"Only admin can edit tasks"
});
}

task.title =
title ||
task.title;

task.description =
description ||
task.description;

task.priority =
priority ||
task.priority;

task.dueDate =
dueDate ||
task.dueDate;

await task.save();

res.status(200).json({
success: true,
message:
"Task updated successfully",
task
});

} catch (error) {

console.error(error);

res.status(500).json({
success: false,
message:
"Server Error"
});
}
};

/* =====================
   DELETE TASK
===================== */

const deleteTask =
async (req, res) => {

try {

const { id } =
req.params;

const task =
await Task.findById(id);

if (!task) {
return res.status(404)
.json({
success: false,
message:
"Task not found"
});
}

/* Admin only */

if (
req.user.role !==
"Admin"
) {
return res.status(403)
.json({
success: false,
message:
"Only admin can delete tasks"
});
}

await task.deleteOne();

res.status(200).json({
success: true,
message:
"Task deleted successfully"
});

} catch (error) {

console.error(error);

res.status(500).json({
success: false,
message:
"Server Error"
});
}
};

module.exports = {
createTask,
getMyTasks,
updateTaskStatus,
editTask,
deleteTask
};