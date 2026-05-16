const API_URL =
  "http://localhost:5000/api/auth";

/* =========================
   SIGNUP
========================= */

const signupForm =
  document.getElementById(
    "signupForm"
  );

if (signupForm) {

  signupForm.addEventListener(
    "submit",
    async (e) => {

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

      try {

        const response =
          await fetch(
            `${API_URL}/signup`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                name,
                email,
                password
              })
            }
          );

        const data =
          await response.json();

        console.log(
          "Signup Response:",
          data
        );

        if (data.success) {

          // Save Token
          localStorage.setItem(
            "token",
            data.token
          );

          // Save User
          localStorage.setItem(
            "user",
            JSON.stringify(
              data.user
            )
          );

          console.log(
            "Saved User:",
            localStorage.getItem(
              "user"
            )
          );

          alert(
            "Signup Successful"
          );

          // Correct Redirect
          window.location.href =
            "../pages/dashboard.html";

        } else {

          alert(
            data.message
          );
        }

      } catch (error) {

        console.error(
          "Signup Error:",
          error
        );

        alert(
          "Something went wrong"
        );
      }
    }
  );
}

/* =========================
   LOGIN
========================= */

const loginForm =
  document.getElementById(
    "loginForm"
  );

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const email =
        document.getElementById(
          "email"
        ).value.trim();

      const password =
        document.getElementById(
          "password"
        ).value.trim();

      try {

        const response =
          await fetch(
            `${API_URL}/login`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                email,
                password
              })
            }
          );

        const data =
          await response.json();

        console.log(
          "Login Response:",
          data
        );

        if (data.success) {

          // Save Token
          localStorage.setItem(
            "token",
            data.token
          );

          // Save User
          localStorage.setItem(
            "user",
            JSON.stringify(
              data.user
            )
          );

          console.log(
            "Saved User:",
            localStorage.getItem(
              "user"
            )
          );

          alert(
            "Login Successful"
          );

          // Correct Redirect
          window.location.href =
            "../pages/dashboard.html";

        } else {

          alert(
            data.message
          );
        }

      } catch (error) {

        console.error(
          "Login Error:",
          error
        );

        alert(
          "Something went wrong"
        );
      }
    }
  );
}