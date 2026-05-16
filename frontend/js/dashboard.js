const API_URL =
"https://team-task-manager-production-4508.up.railway.app/api/dashboard/stats";

const token =
localStorage.getItem(
"token"
);

const user =
JSON.parse(
localStorage.getItem(
"user"
)
);

/* =====================
   AUTH CHECK
===================== */

if (!token) {

window.location.href =
"./login.html";
}

/* =====================
   NAVIGATION
===================== */

window.goToProjects =
function () {

window.location.href =
"./projects.html";
};

window.goToTasks =
function () {

window.location.href =
"./tasks.html";
};

/* =====================
   LOAD DASHBOARD
===================== */

async function
loadDashboard() {

try {

const response =
await fetch(
API_URL,
{
headers: {
Authorization:
`Bearer ${token}`
}
}
);

const data =
await response.json();

console.log(
"Dashboard Data:",
data
);

if (
data.success
) {

/* =====================
   STATS
===================== */

const totalTasks =
data.stats.totalTasks || 0;

const todoTasks =
data.stats.todoTasks || 0;

const progressTasks =
data.stats.inProgressTasks || 0;

const completedTasks =
data.stats.completedTasks || 0;

const overdueTasks =
data.stats.overdueTasks || 0;

document.getElementById(
"totalTasks"
).innerText =
totalTasks;

document.getElementById(
"todoTasks"
).innerText =
todoTasks;

document.getElementById(
"progressTasks"
).innerText =
progressTasks;

document.getElementById(
"completedTasks"
).innerText =
completedTasks;

document.getElementById(
"overdueTasks"
).innerText =
overdueTasks;

/* =====================
   ANALYTICS
===================== */

/* Completion % */

const completionPercentage =
totalTasks === 0
? 0
: Math.round(
(completedTasks /
totalTasks) * 100
);

/* Progress Bar */

document.getElementById(
"taskProgressBar"
).style.width =
`${completionPercentage}%`;

document.getElementById(
"taskProgressText"
).innerText =
`${completionPercentage}% Completed`;

/* Analytics Boxes */

document.getElementById(
"analyticsTodo"
).innerText =
todoTasks;

document.getElementById(
"analyticsProgress"
).innerText =
progressTasks;

document.getElementById(
"analyticsCompleted"
).innerText =
completedTasks;

/* =====================
   RECENT TASKS
===================== */

const recentContainer =
document.getElementById(
"recentTasks"
);

recentContainer.innerHTML =
"";

if (
data.recentTasks &&
data.recentTasks.length > 0
) {

data.recentTasks.forEach(
(task) => {

recentContainer.innerHTML +=
`
<div class=
"recent-card">

<h3>
${task.title}
</h3>

<p>
${task.description ||
"No description"}
</p>

<p>
📌 Status:
<b>
${task.status}
</b>
</p>

</div>
`;
});

} else {

recentContainer.innerHTML =
`
<p>
No recent tasks
</p>
`;
}

/* =====================
   TASKS PER USER
===================== */

const tasksUserContainer =
document.getElementById(
"tasksPerUser"
);

tasksUserContainer.innerHTML =
"";

/* Admin Only */

if (
user &&
user.role ===
"Admin"
) {

if (
data.tasksPerUser &&
data.tasksPerUser.length > 0
) {

data.tasksPerUser.forEach(
(item) => {

tasksUserContainer.innerHTML +=
`
<div class=
"user-task-card">

<h3>
${item.name}
</h3>

<div class=
"user-task-count">

${item.count}
Tasks

</div>

</div>
`;
});

} else {

tasksUserContainer.innerHTML =
`
<p>
No users found
</p>
`;
}

} else {

tasksUserContainer.innerHTML =
`
<p>
Only admin can view
tasks per user
</p>
`;
}

}

} catch (error) {

console.error(
"Dashboard Error:",
error
);
}
}

/* =====================
   LOGOUT
===================== */

document
.getElementById(
"logoutBtn"
)
.addEventListener(
"click",
() => {

localStorage.removeItem(
"token"
);

localStorage.removeItem(
"user"
);

window.location.href =
"../index.html";
}
);

/* =====================
   INITIAL LOAD
===================== */

loadDashboard();