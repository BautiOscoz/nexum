const translations = {
  en: {
    "login.subtitle": "Capstone project management",
    "login.role": "Sign in as",
    "login.enter": "Enter demo",
    "roles.student": "Student team",
    "roles.teacher": "Teacher / Auditor",
    "lang.switch": "Español",
    "nav.logout": "Log out",

    "dash.title.student": "Team dashboard",
    "dash.title.teacher": "Teacher dashboard",
    "dash.subtitle": "Choose a section to get started",

    "menu.myProject": "My project",
    "menu.myProject.desc": "Register and follow your project proposal",
    "menu.meetings": "Meetings",
    "menu.meetings.desc": "Audit meetings and their notes",
    "menu.deliverables": "Deliverables",
    "menu.deliverables.desc": "Upload and track your submissions",
    "menu.calendar": "Calendar",
    "menu.calendar.desc": "Deadlines, meetings and defenses",
    "menu.messages": "Messages",
    "menu.messages.desc": "Talk with your team and teachers",
    "menu.projects": "Projects in charge",
    "menu.projects.desc": "All the projects you supervise",
    "menu.feedback": "Feedback",
    "menu.feedback.desc": "Evaluate proposals and progress reports",
    "menu.audits": "Audits",
    "menu.audits.desc": "Schedule and record technical audits",
  },
  es: {
    "login.subtitle": "Gestión de proyectos integradores",
    "login.role": "Ingresar como",
    "login.enter": "Entrar a la demo",
    "roles.student": "Equipo de estudiantes",
    "roles.teacher": "Docente / Auditor",
    "lang.switch": "English",
    "nav.logout": "Cerrar sesión",

    "dash.title.student": "Panel del equipo",
    "dash.title.teacher": "Panel docente",
    "dash.subtitle": "Elegí una sección para empezar",

    "menu.myProject": "Mi proyecto",
    "menu.myProject.desc": "Registrá y seguí tu propuesta de proyecto",
    "menu.meetings": "Reuniones",
    "menu.meetings.desc": "Reuniones de auditoría y sus notas",
    "menu.deliverables": "Entregas",
    "menu.deliverables.desc": "Subí y seguí tus entregas",
    "menu.calendar": "Calendario",
    "menu.calendar.desc": "Fechas de entrega, reuniones y defensas",
    "menu.messages": "Mensajes",
    "menu.messages.desc": "Hablá con tu equipo y los docentes",
    "menu.projects": "Proyectos a cargo",
    "menu.projects.desc": "Todos los proyectos que supervisás",
    "menu.feedback": "Devoluciones",
    "menu.feedback.desc": "Evaluá propuestas y reportes de avance",
    "menu.audits": "Auditorías",
    "menu.audits.desc": "Agendá y registrá auditorías técnicas",
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
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = translations[lang][el.dataset.i18nPlaceholder];
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
