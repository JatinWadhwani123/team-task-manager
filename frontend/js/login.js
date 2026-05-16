const API_URL =
  "http://localhost:5000/api/auth/login";

const loginForm =
  document.getElementById(
    "loginForm"
  );

loginForm.addEventListener(
  "submit",
  async (e)=>{

    e.preventDefault();

    const email =
      document.getElementById(
        "email"
      ).value;

    const password =
      document.getElementById(
        "password"
      ).value;

    try{

      const response =
        await fetch(
          API_URL,
          {
            method:"POST",

            headers:{
              "Content-Type":
                "application/json"
            },

            body:JSON.stringify({
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

        alert(
          "Login Successful"
        );

        window.location.href =
          "./dashboard.html";
      }

      else{
        alert(
          data.message
        );
      }

    }catch(error){
      console.error(error);
    }
  }
);