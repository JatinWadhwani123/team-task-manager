const API_URL =
"http://localhost:5000/api/projects";

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

if (
user.role ===
"Admin"
) {

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

} else {

document
.getElementById(
"openModalBtn"
)
.style.display =
"none";
}

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
return alert(
"Please fill all fields"
);
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

alert(
"Project Created"
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

alert(
data.message
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
return alert(
"Enter email"
);
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

alert(
data.message
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
confirm(
"Remove member?"
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

alert(
data.message
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
user.role ===
"Admin" &&
member._id !==
project.admin._id

? `
<button
onclick=
"removeMember(
'${project._id}',
'${member._id}'
)"
>
❌
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
user.role ===
"Admin"

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