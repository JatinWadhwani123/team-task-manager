const API_URL =
  "http://localhost:5000/api/auth";

// Signup
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
        ).value;

      const email =
        document.getElementById(
          "email"
        ).value;

      const password =
        document.getElementById(
          "password"
        ).value;

      try {
        const response =
          await fetch(
            `${API_URL}/signup`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                name,
                email,
                password,
              }),
            }
          );

        const data =
          await response.json();

        if (data.success) {
          localStorage.setItem(
            "token",
            data.token
          );

          alert(
            "Signup Successful"
          );

          window.location.href =
            "./dashboard.html";
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error(error);

        alert("Something went wrong");
      }
    }
  );
}