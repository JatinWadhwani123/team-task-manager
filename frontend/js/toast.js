function ensureToastContainer() {
let container =
document.getElementById(
"toastContainer"
);

if (!container) {
container =
document.createElement(
"div"
);

container.id =
"toastContainer";

container.className =
"toast-container";

document.body.appendChild(
container
);
}

return container;
}

function escapeHtml(value) {
return String(value)
.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/"/g, "&quot;")
.replace(/'/g, "&#039;");
}

function showToast(
message,
type = "success"
) {

const container =
ensureToastContainer();

const toast =
document.createElement(
"div"
);

toast.className =
`toast ${type}`;

toast.innerHTML =
`
<span class="toast-icon"></span>
<span>${escapeHtml(message)}</span>
`;

container.appendChild(
toast
);

setTimeout(() => {

toast.remove();

}, 3000);
}

window.showToast =
showToast;

function closeDialog(
overlay,
value,
resolve
) {
overlay.remove();
resolve(value);
}

function showConfirm(
message,
options = {}
) {

return new Promise(
(resolve) => {

const overlay =
document.createElement(
"div"
);

overlay.className =
"app-dialog-overlay";

overlay.innerHTML =
`
<div class="app-dialog" role="dialog" aria-modal="true">
  <div class="app-dialog-icon warning"></div>
  <h3>${escapeHtml(options.title || "Please confirm")}</h3>
  <p>${escapeHtml(message)}</p>
  <div class="app-dialog-actions">
    <button class="dialog-btn secondary" type="button" data-action="cancel">${escapeHtml(options.cancelText || "Cancel")}</button>
    <button class="dialog-btn danger" type="button" data-action="confirm">${escapeHtml(options.confirmText || "Confirm")}</button>
  </div>
</div>
`;

document.body.appendChild(
overlay
);

overlay
.querySelector(
'[data-action="cancel"]'
)
.addEventListener(
"click",
() => closeDialog(
overlay,
false,
resolve
)
);

overlay
.querySelector(
'[data-action="confirm"]'
)
.addEventListener(
"click",
() => closeDialog(
overlay,
true,
resolve
)
);

overlay.addEventListener(
"click",
(event) => {
if (event.target === overlay) {
closeDialog(
overlay,
false,
resolve
);
}
}
);
}
);
}

window.showConfirm =
showConfirm;

function showPrompt(
message,
defaultValue = "",
options = {}
) {

return new Promise(
(resolve) => {

const overlay =
document.createElement(
"div"
);

overlay.className =
"app-dialog-overlay";

overlay.innerHTML =
`
<div class="app-dialog" role="dialog" aria-modal="true">
  <div class="app-dialog-icon info"></div>
  <h3>${escapeHtml(options.title || "Update value")}</h3>
  <p>${escapeHtml(message)}</p>
  <input class="dialog-input" type="text" value="${escapeHtml(defaultValue)}" />
  <div class="app-dialog-actions">
    <button class="dialog-btn secondary" type="button" data-action="cancel">${escapeHtml(options.cancelText || "Cancel")}</button>
    <button class="dialog-btn primary" type="button" data-action="save">${escapeHtml(options.confirmText || "Save")}</button>
  </div>
</div>
`;

document.body.appendChild(
overlay
);

const input =
overlay.querySelector(
".dialog-input"
);

input.focus();
input.select();

overlay
.querySelector(
'[data-action="cancel"]'
)
.addEventListener(
"click",
() => closeDialog(
overlay,
null,
resolve
)
);

overlay
.querySelector(
'[data-action="save"]'
)
.addEventListener(
"click",
() => closeDialog(
overlay,
input.value,
resolve
)
);

input.addEventListener(
"keydown",
(event) => {
if (event.key === "Enter") {
closeDialog(
overlay,
input.value,
resolve
);
}
}
);

overlay.addEventListener(
"click",
(event) => {
if (event.target === overlay) {
closeDialog(
overlay,
null,
resolve
);
}
}
);
}
);
}

window.showPrompt =
showPrompt;
