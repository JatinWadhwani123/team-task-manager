const loginForm =
document.getElementById(
"loginForm"
);

if(loginForm){

loginForm
.addEventListener(
"submit",

async(e)=>{

e.preventDefault();

const email =
document.getElementById(
"email"
).value.trim();

const password =
document.getElementById(
"password"
).value.trim();

try{

const response =
await fetch(
`${AUTH_API}/login`,
{
method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:
JSON.stringify({
email,
password
})
}
);

const data =
await response.json();

if(data.success){

localStorage.setItem(
"token",
data.token
);

localStorage.setItem(
"user",
JSON.stringify(
data.user
)
);

showToast(
"Login successful",
"success"
);

setTimeout(
() => {
window.location.href =
"./dashboard.html";
},
700
);

}else{

showToast(
data.message,
"error"
);
}

}catch(error){

console.error(error);

showToast(
"Something went wrong",
"error"
);
}
}
);
}
