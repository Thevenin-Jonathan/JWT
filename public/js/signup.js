function init() {
  const password = document.querySelector("#password");
  const togglePassword = document.querySelector("#togglePassword");

  togglePassword.addEventListener("click", () => {
    // Change input type
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    // Display or hide eye icon
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
  })
};

document.addEventListener('DOMContentLoaded', () => init());