const Project = require("../models/Project");
const User = require("../models/User");

/* =====================
   CREATE PROJECT
===================== */

const createProject =
async (req, res) => {

try {

const {
name,
description
} = req.body;

if (
!name ||
!description
) {
return res.status(400)
.json({
success:false,
message:
"Name and description are required"
});
}

const project =
await Project.create({
name,
description,
createdBy:
req.user._id,
admin:
req.user._id,
members:
[req.user._id]
});

res.status(201)
.json({
success:true,
message:
"Project created successfully",
project
});

} catch (error) {

console.error(error);

res.status(500)
.json({
success:false,
message:
"Server Error"
});
}
};

/* =====================
   GET PROJECTS
===================== */

const getProjects =
async (req, res) => {

try {

const projects =
await Project.find({
members:
req.user._id
})
.populate(
"members",
"name email role"
)
.populate(
"admin",
"name email"
);

res.status(200)
.json({
success:true,
count:
projects.length,
projects
});

} catch (error) {

console.error(error);

res.status(500)
.json({
success:false,
message:
"Server Error"
});
}
};
// =====================
// Get Single Project
// =====================

const getProjectById =
async (req, res) => {

try {

const { id } =
req.params;

const project =
await Project.findById(id)

.populate(
"members",
"name email role"
)

.populate(
"admin",
"name email"
);

if(!project){

return res.status(404)
.json({
success:false,
message:
"Project not found"
});
}

/* Get tasks */

const Task =
require("../models/Task");

const tasks =
await Task.find({
project:id
})
.populate(
"assignedTo",
"name email"
);

/* Progress */

const totalTasks =
tasks.length;

const completedTasks =
tasks.filter(
task =>
task.status ===
"Done"
).length;

const progress =
totalTasks === 0
? 0
: Math.round(
(completedTasks /
totalTasks) * 100
);

res.status(200)
.json({
success:true,
project,
tasks,
progress
});

}catch(error){

console.error(error);

res.status(500)
.json({
success:false,
message:
"Server Error"
});
}
};

/* =====================
   ADD MEMBER
===================== */

const addMember =
async (req, res) => {

try {

const {
projectId,
email
} = req.body;

const project =
await Project.findById(
projectId
);

if (!project) {
return res.status(404)
.json({
success:false,
message:
"Project not found"
});
}

/* Admin Only */

if (
project.admin.toString()
!== req.user._id.toString()
) {
return res.status(403)
.json({
success:false,
message:
"Only admin can add members"
});
}

const user =
await User.findOne({
email
});

if (!user) {
return res.status(404)
.json({
success:false,
message:
"User not found"
});
}

if (
project.members.includes(
user._id
)
) {
return res.status(400)
.json({
success:false,
message:
"User already added"
});
}

project.members.push(
user._id
);

await project.save();

res.status(200)
.json({
success:true,
message:
"Member added successfully"
});

} catch (error) {

console.error(error);

res.status(500)
.json({
success:false,
message:
"Server Error"
});
}
};

/* =====================
   REMOVE MEMBER
===================== */

const removeMember =
async (req, res) => {

try {

const {
projectId,
memberId
} = req.body;

const project =
await Project.findById(
projectId
);

if (!project) {
return res.status(404)
.json({
success:false,
message:
"Project not found"
});
}

/* Admin Only */

if (
project.admin.toString()
!== req.user._id.toString()
) {
return res.status(403)
.json({
success:false,
message:
"Only admin can remove members"
});
}

/* Can't remove admin */

if (
project.admin.toString()
=== memberId
) {
return res.status(400)
.json({
success:false,
message:
"Admin cannot be removed"
});
}

project.members =
project.members.filter(
(member)=>
member.toString()
!== memberId
);

await project.save();

res.status(200)
.json({
success:true,
message:
"Member removed successfully"
});

} catch (error) {

console.error(error);

res.status(500)
.json({
success:false,
message:
"Server Error"
});
}
};

module.exports = {
createProject,
getProjects,
getProjectById,
addMember,
removeMember
};