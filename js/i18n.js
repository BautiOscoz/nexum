const translations = {
  en: {
    "login.subtitle": "Capstone project management",
    "login.role": "Sign in as",
    "login.enter": "Enter demo",
    "roles.student": "Student team",
    "roles.teacher": "Teacher / Auditor",
    "lang.switch": "Español",
  },
  es: {
    "login.subtitle": "Gestión de proyectos integradores",
    "login.role": "Ingresar como",
    "login.enter": "Entrar a la demo",
    "roles.student": "Equipo de estudiantes",
    "roles.teacher": "Docente / Auditor",
    "lang.switch": "English",
  },
};

function getLang() {
  return localStorage.getItem("lang") || "en";
}

function applyTranslations() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = translations[lang][el.dataset.i18n];
  });
  const toggle = document.getElementById("lang-toggle");
  if (toggle) toggle.textContent = translations[lang]["lang.switch"];
}

function toggleLang() {
  localStorage.setItem("lang", getLang() === "en" ? "es" : "en");
  applyTranslations();
}

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
  const toggle = document.getElementById("lang-toggle");
  if (toggle) toggle.addEventListener("click", toggleLang);
});
