const TASK_API =
"https://team-task-manager-production-4508.up.railway.app/api/tasks";

const PROJECT_API =
"https://team-task-manager-production-4508.up.railway.app/api/projects";

const token =
localStorage.getItem(
"token"
);

const user =
JSON.parse(
localStorage.getItem(
"user"
)
) || {};

let allTasks = [];

const tasksLoader =
document.getElementById(
"tasksLoader"
);

const tasksLoaderMessage =
document.getElementById(
"tasksLoaderMessage"
);

const tasksLoadingMessages = [
"Sorting tasks into their lanes...",
"Checking mission priority levels...",
"Syncing assigned teammates...",
"Powering up your task board..."
];

let tasksLoadingTimer =
null;

let pendingLoads =
0;

function setTasksLoading(
isLoading
) {
if (!tasksLoader) return;

if (isLoading) {
pendingLoads += 1;
} else {
pendingLoads =
Math.max(
0,
pendingLoads - 1
);
}

const shouldShow =
pendingLoads > 0;

tasksLoader.classList.toggle(
"hidden",
!shouldShow
);

if (shouldShow) {
if (!tasksLoadingTimer) {
let messageIndex = 0;

if (tasksLoaderMessage) {
tasksLoaderMessage.innerText =
tasksLoadingMessages[messageIndex];
}

tasksLoadingTimer =
setInterval(
() => {
messageIndex =
(messageIndex + 1) %
tasksLoadingMessages.length;

if (tasksLoaderMessage) {
tasksLoaderMessage.innerText =
tasksLoadingMessages[messageIndex];
}
},
1200
);
}
} else if (tasksLoadingTimer) {
clearInterval(
tasksLoadingTimer
);

tasksLoadingTimer =
null;
}
}

if (!token) {
window.location.href =
"./login.html";
}

/* =====================
   NAVIGATION
===================== */

window.goDashboard =
function () {

window.location.href =
"./dashboard.html";
};

window.goProjects =
function () {

window.location.href =
"./projects.html";
};

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
   TOGGLE FORM
===================== */

const openFormBtn =
document.getElementById(
"openForm"
);

openFormBtn.style.display =
"none";

openFormBtn
.addEventListener(
"click",
() => {

const form =
document.getElementById(
"taskForm"
);

form.style.display =
form.style.display ===
"block"
? "none"
: "block";
}
);

/* =====================
   LOAD PROJECTS
===================== */

async function
loadProjects() {

setTasksLoading(
true
);

try {

const response =
await fetch(
`${PROJECT_API}/all`,
{
headers: {
Authorization:
`Bearer ${token}`
}
}
);

const data =
await response.json();

const projectSelect =
document.getElementById(
"projectSelect"
);

projectSelect.innerHTML =
`
<option value="">
Select Project
</option>
`;

const adminProjects =
data.projects.filter(
project =>
project.admin &&
project.admin._id ===
user.id
);

openFormBtn.style.display =
adminProjects.length > 0
? "inline-block"
: "none";

adminProjects.forEach(
(project) => {

projectSelect.innerHTML +=
`
<option value=
"${project._id}">
${project.name}
</option>
`;
}
);

projectSelect
.addEventListener(
"change",
() => {

const selected =
adminProjects.find(
(project) =>
project._id ===
projectSelect.value
);

loadMembers(
selected
);
}
);

} catch (error) {

console.error(error);

showToast(
"Unable to load projects for task creation.",
"error"
);
} finally {

setTasksLoading(
false
);
}
}

/* =====================
   LOAD MEMBERS
===================== */

function loadMembers(
project
) {

const memberSelect =
document.getElementById(
"memberSelect"
);

memberSelect.innerHTML =
`
<option value="">
Assign Member
</option>
`;

if (
!project ||
!project.members
) return;

project.members.forEach(
(member) => {

memberSelect.innerHTML +=
`
<option value=
"${member.email}">
${member.name}
</option>
`;
}
);
}

/* =====================
   CREATE TASK
===================== */

document
.getElementById(
"createTask"
)
.addEventListener(
"click",
async () => {

const title =
document.getElementById(
"title"
).value.trim();

const description =
document.getElementById(
"description"
).value.trim();

const dueDate =
document.getElementById(
"dueDate"
).value;

const priority =
document.getElementById(
"priority"
).value;

const projectId =
document.getElementById(
"projectSelect"
).value;

const assignedEmail =
document.getElementById(
"memberSelect"
).value;

if (
!title ||
!description ||
!dueDate ||
!projectId ||
!assignedEmail
) {

showToast(
"Please fill all fields",
"warning"
);
return;
}

try {

const response =
await fetch(
`${TASK_API}/create`,
{
method:
"POST",

headers: {
"Content-Type":
"application/json",

Authorization:
`Bearer ${token}`
},

body:
JSON.stringify({
title,
description,
dueDate,
priority,
projectId,
assignedEmail
})
}
);

const data =
await response.json();

if (
data.success
) {

showToast(
"Task created successfully",
"success"
);

/* Reset Form */

document.getElementById(
"title"
).value = "";

document.getElementById(
"description"
).value = "";

document.getElementById(
"dueDate"
).value = "";

document.getElementById(
"projectSelect"
).value = "";

document.getElementById(
"memberSelect"
).innerHTML =
`
<option value="">
Assign Member
</option>
`;

/* Instant UI Update */

await loadTasks();

} else {

showToast(
data.message,
"error"
);
}

} catch (error) {

console.error(error);
}
}
);

/* =====================
   LOAD TASKS
===================== */

async function
loadTasks() {

setTasksLoading(
true
);

try {

const response =
await fetch(
`${TASK_API}/my-tasks`,
{
headers: {
Authorization:
`Bearer ${token}`
}
}
);

const data =
await response.json();

allTasks =
data.tasks || [];

renderTasks(
allTasks
);

} catch (error) {

console.error(error);

showToast(
"Unable to load tasks. Please try again.",
"error"
);
} finally {

setTasksLoading(
false
);
}
}

/* =====================
   RENDER TASKS
===================== */

function renderTasks(
tasks
) {

document.getElementById(
"todo"
).innerHTML =
"";

document.getElementById(
"progress"
).innerHTML =
"";

document.getElementById(
"completed"
).innerHTML =
"";

tasks.forEach(
(task) => {

const isProjectAdmin =
task.project &&
task.project.admin ===
user.id;

const isAssignedUser =
task.assignedTo &&
task.assignedTo._id ===
user.id;

const adminButtons =
isProjectAdmin

? `
<button onclick=
"editTask(
'${task._id}',
'${task.title}',
'${task.description}',
'${task.priority}',
'${task.dueDate}'
)">
✏️ Edit
</button>

<button onclick=
"deleteTask(
'${task._id}'
)">
🗑 Delete
</button>
`
: "";

const card =
`
<div class=
"task-card">

<h3>
${task.title}
</h3>

<p>
${task.description}
</p>

<p>
👤 Assigned To:
<b>
${task.assignedTo?.name || "Unknown"}
</b>
</p>

<p>
📅 ${new Date(
task.dueDate
).toLocaleDateString()}
</p>

<p>
Priority:
${task.priority}
</p>

<div class=
"task-actions">

${task.status ===
"To Do"
&&
(isAssignedUser || isProjectAdmin)
? `
<button onclick=
"updateTaskStatus(
'${task._id}',
'In Progress'
)">
Start
</button>
`
: ""}

${task.status !==
"Done"
&&
(isAssignedUser || isProjectAdmin)
? `
<button onclick=
"updateTaskStatus(
'${task._id}',
'Done'
)">
Complete
</button>
`
: ""}

${adminButtons}

</div>

</div>
`;

if (
task.status ===
"To Do"
) {

document.getElementById(
"todo"
).innerHTML +=
card;

} else if (
task.status ===
"In Progress"
) {

document.getElementById(
"progress"
).innerHTML +=
card;

} else {

document.getElementById(
"completed"
).innerHTML +=
card;
}
});
}

/* =====================
   SEARCH + FILTER
===================== */

function filterTasks() {

const searchValue =
document.getElementById(
"searchTask"
).value
.toLowerCase();

const statusValue =
document.getElementById(
"statusFilter"
).value;

const priorityValue =
document.getElementById(
"priorityFilter"
).value;

const filteredTasks =
allTasks.filter(
(task) => {

const matchesSearch =
task.title
.toLowerCase()
.includes(
searchValue
);

const matchesStatus =
statusValue ===
"All"
? true
: task.status ===
statusValue;

const matchesPriority =
priorityValue ===
"All"
? true
: task.priority ===
priorityValue;

return (
matchesSearch &&
matchesStatus &&
matchesPriority
);
}
);

renderTasks(
filteredTasks
);
}

document
.getElementById(
"searchTask"
)
.addEventListener(
"input",
filterTasks
);

document
.getElementById(
"statusFilter"
)
.addEventListener(
"change",
filterTasks
);

document
.getElementById(
"priorityFilter"
)
.addEventListener(
"change",
filterTasks
);

/* =====================
   UPDATE STATUS
===================== */

async function
updateTaskStatus(
taskId,
status
) {

try {

const response =
await fetch(
`${TASK_API}/update-status`,
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
taskId,
status
})
}
);

const data =
await response.json();

if(data.success){

await loadTasks();
}

}catch(error){

console.error(error);
}
}

window.updateTaskStatus =
updateTaskStatus;

/* =====================
   DELETE TASK
===================== */

async function
deleteTask(id) {

const confirmDelete =
await showConfirm(
"Delete this task? This action cannot be undone.",
{
title: "Delete task",
confirmText: "Delete"
}
);

if (
!confirmDelete
) return;

try {

const response =
await fetch(
`${TASK_API}/delete/${id}`,
{
method:
"DELETE",

headers: {
Authorization:
`Bearer ${token}`
}
}
);

const data =
await response.json();

if(data.success){

showToast(
"Task deleted",
"success"
);

await loadTasks();
}

}catch(error){

console.error(error);
}
}

window.deleteTask =
deleteTask;

/* =====================
   EDIT TASK
===================== */

async function
editTask(
id,
oldTitle,
oldDescription,
oldPriority,
oldDate
) {

const title =
await showPrompt(
"Edit title",
oldTitle,
{
title: "Edit task title"
}
);

if (!title)
return;

const description =
await showPrompt(
"Edit description",
oldDescription,
{
title: "Edit task description"
}
);

const priority =
await showPrompt(
"Edit priority (Low/Medium/High)",
oldPriority,
{
title: "Edit task priority"
}
);

try {

const response =
await fetch(
`${TASK_API}/edit/${id}`,
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
title,
description,
priority,
dueDate:
oldDate
})
}
);

const data =
await response.json();

if(data.success){

showToast(
"Task updated",
"success"
);

await loadTasks();
}

} catch (error) {

console.error(
"Edit Error:",
error
);
}
}

window.editTask =
editTask;

/* =====================
   INITIAL LOAD
===================== */

loadProjects();
loadTasks();
