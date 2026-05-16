(function () {
const avatars = [
"A1",
"B2",
"C3",
"D4",
"E5",
"F6"
];

const user =
JSON.parse(
localStorage.getItem(
"user"
)
) || {};

function escapeHtml(value) {
return String(value || "")
.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/"/g, "&quot;")
.replace(/'/g, "&#039;");
}

const mount =
document.getElementById(
"profileMount"
);

if (!mount) return;

const storedAvatar =
localStorage.getItem(
"avatar"
) || avatars[0];

function renderProfile(
activeAvatar
) {
const initial =
(user.name || "User")
.charAt(0)
.toUpperCase();

const safeName =
escapeHtml(
user.name || "User"
);

const safeEmail =
escapeHtml(
user.email || "Signed in"
);

mount.innerHTML =
`
<div class="profile-menu">
  <button class="profile-trigger" id="profileTrigger" type="button" aria-label="Open profile menu">
    <span class="profile-avatar avatar-${activeAvatar}">${initial}</span>
    <span class="profile-name">${safeName}</span>
  </button>
  <div class="profile-dropdown" id="profileDropdown">
    <div class="profile-summary">
      <span class="profile-avatar avatar-${activeAvatar}">${initial}</span>
      <div>
        <strong>${safeName}</strong>
        <p>${safeEmail}</p>
      </div>
    </div>
    <p class="profile-label">Change avatar</p>
    <div class="avatar-grid">
      ${avatars.map(
avatar =>
`<button class="avatar-choice avatar-${avatar} ${avatar === activeAvatar ? "selected" : ""}" data-avatar="${avatar}" type="button">${initial}</button>`
).join("")}
    </div>
    <a class="profile-link" href="../pages/contact.html">Contact support</a>
  </div>
</div>
`;

const trigger =
document.getElementById(
"profileTrigger"
);

const dropdown =
document.getElementById(
"profileDropdown"
);

trigger.addEventListener(
"click",
() => {
dropdown.classList.toggle(
"open"
);
}
);

dropdown
.querySelectorAll(
".avatar-choice"
)
.forEach(
button => {
button.addEventListener(
"click",
() => {
const nextAvatar =
button.dataset.avatar;

localStorage.setItem(
"avatar",
nextAvatar
);

renderProfile(
nextAvatar
);
}
);
}
);
}

document.addEventListener(
"click",
event => {
const menu =
mount.querySelector(
".profile-menu"
);

if (
menu &&
!menu.contains(
event.target
)
) {
const dropdown =
mount.querySelector(
".profile-dropdown"
);

if (dropdown) {
dropdown.classList.remove(
"open"
);
}
}
}
);

renderProfile(
storedAvatar
);
})();
