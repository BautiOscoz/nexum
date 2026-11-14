// Shared by every page after login
if (!localStorage.getItem("role")) {
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const logout = document.getElementById("logout");
  if (logout) {
    logout.addEventListener("click", () => {
      localStorage.removeItem("role");
      window.location.href = "index.html";
    });
  }
});
