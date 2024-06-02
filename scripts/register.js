const usernameInput = document.getElementsByName("username")[0];
const passwordInput = document.getElementsByName("password")[0];
const submitBtn = document.querySelector(".submit");

window.onload = function () {
  submitBtn.addEventListener("click", (event) => {
    event.preventDefault();

    if (!validateUsername() || !validatePassword()) {
      return;
    }

    const formData = new FormData();
    formData.append("username", usernameInput.value);
    formData.append("password", passwordInput.value);

    fetch("/register", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status == 409) return response.json();
        else if (response.ok) {
          alert("Registration successful");
          window.location.href = "/login";
        } else throw new Error("Unexpected server response");
      })
      .then((data) => {
        alert(data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  });
};

function validateUsername() {
  const username = usernameInput.value;
  const regex = /^[a-zA-Z0-9_.]{3,}$/;
  if (!regex.test(username)) {
    alert(
      "Your username should be at least 3 characters long and can only contain letters, numbers, underlines (_) and periods (.)",
    );
    return false;
  }

  return true;
}

function validatePassword() {
  const password = passwordInput.value;
  const regex = /^[a-zA-Z0-9!@#$%^&*()\-_=+\[\]{}|;:,.<>?]{8,}$/;
  if (!regex.test(password)) {
    alert(
      "Your password must contain at least 8 characters and cannot contain special characters other than !@#$%^&*()-_=+[]{}|;:,.<>?",
    );
    return false;
  }
  return true;
}
