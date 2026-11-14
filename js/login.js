document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const role = document.getElementById("role").value;
  localStorage.setItem("role", role);
  window.location.href = "dashboard.html";
});
