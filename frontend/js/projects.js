const API_URL =
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

const projectsLoader =
document.getElementById(
"projectsLoader"
);

const projectsLoaderMessage =
document.getElementById(
"projectsLoaderMessage"
);

const projectsLoadingMessages = [
"Locating active project zones...",
"Syncing team member signals...",
"Checking project status lanes...",
"Deploying project cards..."
];

let projectsLoadingTimer =
null;

function setProjectsLoading(
isLoading
) {
if (!projectsLoader) return;

projectsLoader.classList.toggle(
"hidden",
!isLoading
);

if (isLoading) {
if (projectsLoadingTimer) {
clearInterval(
projectsLoadingTimer
);
}

let messageIndex = 0;

if (projectsLoaderMessage) {
projectsLoaderMessage.innerText =
projectsLoadingMessages[messageIndex];
}

projectsLoadingTimer =
setInterval(
() => {
messageIndex =
(messageIndex + 1) %
projectsLoadingMessages.length;

if (projectsLoaderMessage) {
projectsLoaderMessage.innerText =
projectsLoadingMessages[messageIndex];
}
},
1200
);
} else if (projectsLoadingTimer) {
clearInterval(
projectsLoadingTimer
);

projectsLoadingTimer =
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

window.goTasks =
function () {

window.location.href =
"./tasks.html";
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
   MODALS
===================== */

const projectModal =
document.getElementById(
"projectModal"
);

const memberModal =
document.getElementById(
"memberModal"
);

let selectedProjectId =
null;

/* Open Create Project */

document
.getElementById(
"openModalBtn"
)
.addEventListener(
"click",
() => {

projectModal.style.display =
"flex";
}
);

/* =====================
   CREATE PROJECT
===================== */

document
.getElementById(
"saveProject"
)
.addEventListener(
"click",
async () => {

const name =
document.getElementById(
"projectName"
).value.trim();

const description =
document.getElementById(
"projectDescription"
).value.trim();

if (
!name ||
!description
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
`${API_URL}/create`,
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
name,
description
})
}
);

const data =
await response.json();

if (
data.success
) {

showToast(
"Project created",
"success"
);

projectModal.style.display =
"none";

document.getElementById(
"projectName"
).value = "";

document.getElementById(
"projectDescription"
).value = "";

loadProjects();

} else {

showToast(
data.message,
"error"
);
}

} catch (error) {

console.error(
error
);
}
}
);

/* =====================
   ADD MEMBER
===================== */

document
.getElementById(
"addMemberBtn"
)
.addEventListener(
"click",
async () => {

const email =
document.getElementById(
"memberEmail"
).value.trim();

if (!email) {
showToast(
"Enter email",
"warning"
);
return;
}

try {

const response =
await fetch(
`${API_URL}/add-member`,
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
projectId:
selectedProjectId,
email
})
}
);

const data =
await response.json();

showToast(
data.message,
data.success ? "success" : "error"
);

if (
data.success
) {

memberModal.style.display =
"none";

document.getElementById(
"memberEmail"
).value = "";

loadProjects();
}

} catch (error) {

console.error(
error
);
}
}
);

/* =====================
   REMOVE MEMBER
===================== */

async function
removeMember(
projectId,
memberId
) {

const confirmRemove =
await showConfirm(
"Remove this member from the project?",
{
title: "Remove member",
confirmText: "Remove"
}
);

if (
!confirmRemove
) return;

try {

const response =
await fetch(
`${API_URL}/remove-member`,
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
projectId,
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

loadProjects();

} catch (error) {

console.error(
error
);
}
}

window.removeMember =
removeMember;

/* =====================
   LOAD PROJECTS
===================== */

async function
loadProjects() {

setProjectsLoading(
true
);

try {

const response =
await fetch(
`${API_URL}/all`,
{
headers: {
Authorization:
`Bearer ${token}`
}
}
);

const data =
await response.json();

const container =
document.getElementById(
"projectsContainer"
);

container.innerHTML =
"";

data.projects.forEach(
(project) => {

const isProjectAdmin =
project.admin &&
project.admin._id ===
user.id;

const membersHTML =
project.members
.map(
(member) =>

`
<div class=
"member-item">

<span>
${member.name}
</span>

${
isProjectAdmin &&
member._id !==
project.admin._id

? `
<button
onclick=
"event.stopPropagation();
removeMember(
'${project._id}',
'${member._id}'
)"
>
Remove
</button>
`
: ""
}

</div>
`
)
.join("");

container.innerHTML +=
`
<div class=
"project-card"
onclick=
"goToProjectDetails(
'${project._id}'
)">

<h3>
${project.name}
</h3>

<p>
${project.description}
</p>

<div class=
"status">
${project.status}
</div>

<h4
style="
margin-top:20px;
margin-bottom:10px;
">
Team Members
</h4>

<div>
${membersHTML}
</div>

${
isProjectAdmin

? `
<button
class=
"member-btn"
onclick=
"event.stopPropagation();
openMemberModal(
'${project._id}'
)">
+ Add Member
</button>
`
: ""
}

</div>
`;
}
);

} catch (error) {

console.error(
error
);

showToast(
"Unable to load projects. Please try again.",
"error"
);
} finally {

setProjectsLoading(
false
);
}
}

/* =====================
   OPEN MEMBER MODAL
===================== */

window.openMemberModal =
function (
projectId
) {

selectedProjectId =
projectId;

memberModal.style.display =
"flex";
};
/* =====================
   PROJECT DETAILS
===================== */

window.goToProjectDetails =
function (
projectId
) {

window.location.href =
`./project-details.html?id=${projectId}`;
};
loadProjects();
