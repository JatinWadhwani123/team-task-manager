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

if (
!title ||
!description ||
!dueDate ||
!assignedEmail ||
!projectId
) {
return res.status(400)
.json({
success: false,
message:
"Please fill all fields"
});
}

if (
priority &&
![
"Low",
"Medium",
"High"
].includes(priority)
) {
return res.status(400)
.json({
success: false,
message:
"Invalid priority"
});
}

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

/* Project admin only */

if (
project.admin.toString() !==
req.user._id.toString()
) {
return res.status(403)
.json({
success: false,
message:
"Only project admin can create tasks"
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

const isProjectMember =
project.members.some(
member =>
member.toString() ===
user._id.toString()
);

if (!isProjectMember) {
return res.status(400)
.json({
success: false,
message:
"Assigned user must be a project member"
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

const adminProjects =
await Project.find({
admin:
req.user._id
}).select("_id");

const adminProjectIds =
adminProjects.map(
project =>
project._id
);

tasks =
await Task.find({
$or: [
{
assignedTo:
req.user._id
},
{
project: {
$in:
adminProjectIds
}
}
]
})
.populate(
"project",
"name admin members"
)
.populate(
"assignedTo",
"name email"
);

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
).populate(
"project",
"admin members"
);

if (!task) {
return res.status(404)
.json({
success: false,
message:
"Task not found"
});
}

const isAssignedUser =
task.assignedTo.toString() ===
req.user._id.toString();

const isProjectAdmin =
task.project.admin.toString() ===
req.user._id.toString();

if (
!isAssignedUser &&
!isProjectAdmin
) {
return res.status(403)
.json({
success: false,
message:
"You can update only assigned tasks"
});
}

if (
![
"To Do",
"In Progress",
"Done"
].includes(status)
) {
return res.status(400)
.json({
success: false,
message:
"Invalid task status"
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

if (
priority &&
![
"Low",
"Medium",
"High"
].includes(priority)
) {
return res.status(400)
.json({
success: false,
message:
"Invalid priority"
});
}

const task =
await Task.findById(id)
.populate(
"project",
"admin"
);

if (!task) {
return res.status(404)
.json({
success: false,
message:
"Task not found"
});
}

/* Project admin only */

if (
task.project.admin.toString() !==
req.user._id.toString()
) {
return res.status(403)
.json({
success: false,
message:
"Only project admin can edit tasks"
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
await Task.findById(id)
.populate(
"project",
"admin"
);

if (!task) {
return res.status(404)
.json({
success: false,
message:
"Task not found"
});
}

/* Project admin only */

if (
task.project.admin.toString() !==
req.user._id.toString()
) {
return res.status(403)
.json({
success: false,
message:
"Only project admin can delete tasks"
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
