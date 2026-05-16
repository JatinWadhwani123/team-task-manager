const API_URL =
"https://team-task-manager-production-4508.up.railway.app/api/projects";

const token =
localStorage.getItem(
"token"
);

if (!token) {
window.location.href =
"./login.html";
}

/* =====================
   GET PROJECT ID
===================== */

const params =
new URLSearchParams(
window.location.search
);

const projectId =
params.get("id");

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
   LOAD PROJECT DETAILS
===================== */

async function
loadProjectDetails() {

try {

const response =
await fetch(
`${API_URL}/${projectId}`,
{
headers: {
Authorization:
`Bearer ${token}`
}
}
);

const data =
await response.json();

console.log(data);

if (
!data.success
) {

showToast(
data.message,
"error"
);
return;
}

const {
project,
tasks,
progress
} = data;

/* Project Info */

document.getElementById(
"projectName"
).innerText =
project.name;

document.getElementById(
"projectDescription"
).innerText =
project.description;

document.getElementById(
"projectAdmin"
).innerText =
project.admin.name;

/* Progress */

document.getElementById(
"progressBar"
).style.width =
`${progress}%`;

document.getElementById(
"progressText"
).innerText =
`${progress}% Completed`;

/* Members */

const membersContainer =
document.getElementById(
"membersContainer"
);

membersContainer.innerHTML =
"";

project.members.forEach(
(member) => {

membersContainer.innerHTML +=
`
<div class=
"recent-card">

<h3>
${member.name}
</h3>

<p>
${member.email}
</p>

</div>
`;
}
);

/* Tasks */

const tasksContainer =
document.getElementById(
"tasksContainer"
);

tasksContainer.innerHTML =
"";

if (
tasks.length === 0
) {

tasksContainer.innerHTML =
`
<p>
No tasks in project
</p>
`;

return;
}

tasks.forEach(
(task) => {

tasksContainer.innerHTML +=
`
<div class=
"recent-card">

<h3>
${task.title}
</h3>

<p>
${task.description}
</p>

<p>
👤 Assigned To:
${task.assignedTo?.name || "Unknown"}
</p>

<p>
📅 ${new Date(
task.dueDate
).toLocaleDateString()}
</p>

<p>
Status:
${task.status}
</p>

</div>
`;
}
);

} catch (error) {

console.error(
error
);

showToast(
"Failed to load project",
"error"
);
}
}

loadProjectDetails();
