const DASHBOARD_BASE_URL =
"https://team-task-manager-production-4508.up.railway.app/api/dashboard";

const API_URL =
`${DASHBOARD_BASE_URL}/stats`;

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

const dashboardLoader =
document.getElementById(
"dashboardLoader"
);

const loaderMessage =
document.getElementById(
"loaderMessage"
);

const loadingMessages = [
"Syncing your latest tasks and project updates...",
"Checking overdue work and priorities...",
"Building your team analytics...",
"Almost ready, arranging your dashboard..."
];

let loadingMessageTimer =
null;

let teamMembers =
[];

function setDashboardLoading(
isLoading
) {
if (!dashboardLoader) return;

dashboardLoader.classList.toggle(
"hidden",
!isLoading
);

if (isLoading) {
if (loadingMessageTimer) {
clearInterval(
loadingMessageTimer
);
}

let messageIndex = 0;

if (loaderMessage) {
loaderMessage.innerText =
loadingMessages[messageIndex];
}

loadingMessageTimer =
setInterval(
() => {
messageIndex =
(messageIndex + 1) %
loadingMessages.length;

if (loaderMessage) {
loaderMessage.innerText =
loadingMessages[messageIndex];
}
},
1300
);
} else if (loadingMessageTimer) {
clearInterval(
loadingMessageTimer
);

loadingMessageTimer =
null;
}
}

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

function renderTeamDetails(
personId
) {
const details =
document.getElementById(
"teamMemberDetails"
);

if (!details) return;

const person =
teamMembers.find(
member =>
member.id ===
personId
);

if (!person) {
details.className =
"team-details empty-state";

details.innerHTML =
"Select a team member to see their projects and tasks.";
return;
}

details.className =
"team-details";

const projectList =
person.projects.length > 0
? person.projects
.map(
project =>
`<span>${project.name}</span>`
)
.join("")
: "<span>No projects</span>";

const taskList =
person.tasks.length > 0
? person.tasks
.map(
task =>
`
<div class="task-mini">
  <strong>${task.title}</strong>
  <span>${task.project} · ${task.status} · ${task.priority}</span>
</div>
`
)
.join("")
: "<p>No tasks assigned.</p>";

const removeButton =
person.id === user.id
? ""
: `
  <button class="danger-action" type="button" onclick="removeTeamMember('${person.id}')">
    Remove from my projects
  </button>
`;

details.innerHTML =
`
<div class="team-details-header">
  <div>
    <h3>${person.name}</h3>
    <p>${person.email}</p>
  </div>
  ${removeButton}
</div>
<div class="detail-grid">
  <div class="detail-panel">
    <h4>Projects</h4>
    <div class="pill-list">${projectList}</div>
  </div>
  <div class="detail-panel">
    <h4>Assigned Tasks (${person.count})</h4>
    ${taskList}
  </div>
</div>
`;
}

function renderTeamInspector(
members
) {
teamMembers =
members || [];

const select =
document.getElementById(
"teamMemberSelect"
);

const list =
document.getElementById(
"tasksPerUser"
);

if (!select || !list) return;

select.innerHTML =
`
<option value="">Select team member</option>
`;

list.innerHTML =
"";

if (
teamMembers.length === 0
) {
list.innerHTML =
`
<p>
No project team tasks yet
</p>
`;

renderTeamDetails(
""
);
return;
}

teamMembers.forEach(
member => {
select.innerHTML +=
`
<option value="${member.id}">
${member.name} · ${member.count} task(s)
</option>
`;

list.innerHTML +=
`
<div class="user-task-card" onclick="selectTeamMember('${member.id}')">
  <div>
    <h3>${member.name}</h3>
    <p>${member.email}</p>
  </div>
  <div class="user-task-count">${member.count} Tasks</div>
</div>
`;
}
);

select.onchange =
() => renderTeamDetails(
select.value
);
}

window.selectTeamMember =
function (
memberId
) {
const select =
document.getElementById(
"teamMemberSelect"
);

if (select) {
select.value =
memberId;
}

renderTeamDetails(
memberId
);
};

window.removeTeamMember =
async function (
memberId
) {
const person =
teamMembers.find(
member =>
member.id ===
memberId
);

if (!person) return;

const confirmed =
await showConfirm(
`Remove ${person.name} from every project you manage? Their assigned tasks in those projects will also be removed.`,
{
title:
"Remove team member",
confirmText:
"Remove"
}
);

if (!confirmed) return;

try {
const response =
await fetch(
`${DASHBOARD_BASE_URL}/remove-member`,
{
method:
"PUT",
headers: {
"Content-Type":
"application/json",
Authorization:
`Bearer ${token}`
},
body:
JSON.stringify({
userId:
memberId
})
}
);

const data =
await response.json();

showToast(
data.message,
data.success ? "success" : "error"
);

if (data.success) {
loadDashboard();
}
} catch (error) {
console.error(error);
showToast(
"Unable to remove team member.",
"error"
);
}
};

/* =====================
   LOAD DASHBOARD
===================== */

async function
loadDashboard() {

setDashboardLoading(
true
);

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

renderTeamInspector(
data.tasksPerUser || []
);

} else {

showToast(
data.message || "Unable to load dashboard.",
"error"
);
}

} catch (error) {

console.error(
"Dashboard Error:",
error
);

showToast(
"Unable to load dashboard. Please try again.",
"error"
);
} finally {

setDashboardLoading(
false
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
