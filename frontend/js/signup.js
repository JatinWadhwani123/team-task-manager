const signupForm =
document.getElementById(
"signupForm"
);

if(signupForm){

signupForm
.addEventListener(
"submit",

async(e)=>{

e.preventDefault();

const name =
document.getElementById(
"name"
).value.trim();

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
`${AUTH_API}/signup`,
{
method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:
JSON.stringify({
name,
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

alert(
"Signup Successful"
);

window.location.href =
"./dashboard.html";

}else{

alert(
data.message
);
}

}catch(error){

console.error(error);

alert(
"Something went wrong"
);
}
}
);
}