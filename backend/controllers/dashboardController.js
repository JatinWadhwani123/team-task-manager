const Task =
require(
"../models/Task"
);

const User =
require(
"../models/User"
);

/* =====================
   DASHBOARD STATS
===================== */

const getDashboardStats =
async (req, res) => {

try {

let taskFilter = {};

if (
req.user.role !==
"Admin"
) {

taskFilter =
{
assignedTo:
req.user._id
};
}

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

/* =====================
   TASKS PER USER
===================== */

let tasksPerUser =
[];

if (
req.user.role ===
"Admin"
) {

const users =
await User.find();

for (
const user of users
) {

const taskCount =
await Task.countDocuments({
assignedTo:
user._id
});

tasksPerUser.push({
name:
user.name,
count:
taskCount
});
}
}

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

module.exports = {
getDashboardStats
};