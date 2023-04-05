// LOGIN //

const loginForm = document.querySelector("#js-login-form");
const errorMessage = document.querySelector("#js-error-message");
const connectButton = document.querySelector("#js-connect-button");

const login = async (email, password) => {
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      const token = data.token;
      localStorage.setItem("token", token);
      window.location.href = "./index.html";
      console.log(token);
    } else {
      errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe";
      connectButton.classList.add("shake");

      setTimeout(() => {
        connectButton.classList.remove("shake");
      }, 500);
    }
  } catch (error) {
    console.log(error);
  }
};

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm.querySelector("#js-email").value;
  const password = loginForm.querySelector("#js-password").value;

  login(email, password);
});
