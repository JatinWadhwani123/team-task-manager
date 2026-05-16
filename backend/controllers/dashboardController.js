const Task =
require(
"../models/Task"
);

const Project =
require(
"../models/Project"
);

/* =====================
   DASHBOARD STATS
===================== */

async function getAdminTeamOverview(
adminId
) {
const adminProjects =
await Project.find({
admin:
adminId
})
.populate(
"members",
"name email role"
)
.select(
"_id name members admin"
);

const adminProjectIds =
adminProjects.map(
project =>
project._id
);

if (
adminProjectIds.length === 0
) {
return {
adminProjects,
adminProjectIds,
tasksPerUser: []
};
}

const tasks =
await Task.find({
project: {
$in:
adminProjectIds
}
})
.populate(
"assignedTo",
"name email role"
)
.populate(
"project",
"name"
);

const teamMap =
new Map();

adminProjects.forEach(
project => {
project.members.forEach(
member => {
const id =
member._id.toString();

if (!teamMap.has(id)) {
teamMap.set(id, {
id,
name:
member.name,
email:
member.email,
role:
member.role,
projects: [],
tasks: []
});
}

teamMap.get(id).projects.push({
id:
project._id,
name:
project.name
});
}
);
}
);

tasks.forEach(
task => {
if (!task.assignedTo) return;

const id =
task.assignedTo._id.toString();

if (!teamMap.has(id)) {
teamMap.set(id, {
id,
name:
task.assignedTo.name,
email:
task.assignedTo.email,
role:
task.assignedTo.role,
projects: [],
tasks: []
});
}

teamMap.get(id).tasks.push({
id:
task._id,
title:
task.title,
status:
task.status,
priority:
task.priority,
dueDate:
task.dueDate,
project:
task.project
? task.project.name
: "Unknown project"
});
}
);

return {
adminProjects,
adminProjectIds,
tasksPerUser:
Array.from(
teamMap.values()
)
.map(
person => ({
...person,
count:
person.tasks.length
})
)
.sort(
(a, b) =>
a.name.localeCompare(
b.name
)
)
};
}

const getDashboardStats =
async (req, res) => {

try {

const {
adminProjectIds,
tasksPerUser
} =
await getAdminTeamOverview(
req.user._id
);

const taskFilter =
adminProjectIds.length > 0
? {
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
}
: {
assignedTo:
req.user._id
};

/* Stats */

const totalTasks =
await Task.countDocuments(
taskFilter
);

const todoTasks =
await Task.countDocuments({
...taskFilter,
status:
"To Do"
});

const inProgressTasks =
await Task.countDocuments({
...taskFilter,
status:
"In Progress"
});

const completedTasks =
await Task.countDocuments({
...taskFilter,
status:
"Done"
});

const overdueTasks =
await Task.countDocuments({
...taskFilter,

dueDate: {
$lt:
new Date()
},

status: {
$ne:
"Done"
}
});

/* Recent Tasks */

const recentTasks =
await Task.find(
taskFilter
)
.sort({
createdAt:-1
})
.limit(5);

res.status(200)
.json({
success:true,

stats:{
totalTasks,
todoTasks,
inProgressTasks,
completedTasks,
overdueTasks
},

recentTasks,
tasksPerUser
});

} catch (error) {

console.error(
error
);

res.status(500)
.json({
success:false,
message:
"Server Error"
});
}
};

const removeTeamMember =
async (req, res) => {

try {

const {
userId
} = req.body;

if (!userId) {
return res.status(400)
.json({
success:false,
message:
"User id is required"
});
}

if (
userId ===
req.user._id.toString()
) {
return res.status(400)
.json({
success:false,
message:
"You cannot remove yourself from your projects"
});
}

const projects =
await Project.find({
admin:
req.user._id,
members:
userId
});

if (
projects.length === 0
) {
return res.status(404)
.json({
success:false,
message:
"This user is not part of your projects"
});
}

const projectIds =
projects.map(
project =>
project._id
);

await Project.updateMany(
{
_id: {
$in:
projectIds
}
},
{
$pull: {
members:
userId
}
}
);

const deletedTasks =
await Task.deleteMany({
project: {
$in:
projectIds
},
assignedTo:
userId
});

res.status(200)
.json({
success:true,
message:
deletedTasks.deletedCount > 0
? `Team member removed and ${deletedTasks.deletedCount} assigned task(s) were removed`
: "Team member removed from your projects"
});

} catch (error) {

console.error(
error
);

res.status(500)
.json({
success:false,
message:
"Server Error"
});
}
};

module.exports = {
getDashboardStats,
removeTeamMember
};
