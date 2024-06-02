const usernameInput = document.getElementsByName("username")[0];
const passwordInput = document.getElementsByName("password")[0];
const submitBtn = document.querySelector(".submit");

window.onload = function () {
  submitBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("username", usernameInput.value);
    formData.append("password", passwordInput.value);

    fetch("/login", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status == 401) return response.json();
        else if (response.ok) {
          alert("Login successful");
          window.location.href = "/";
        } else throw new Error("Unexpected server response");
      })
      .then((data) => {
        console.log(data);
        alert(data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  });
};
