const role = localStorage.getItem("role");

// Menu options for each role
const menus = {
  student: [
    { icon: "📁", key: "menu.myProject", page: "project.html" },
    { icon: "🤝", key: "menu.meetings", page: "meetings.html" },
    { icon: "📤", key: "menu.deliverables", page: "deliverables.html" },
    { icon: "📅", key: "menu.calendar", page: "calendar.html" },
    { icon: "💬", key: "menu.messages", page: "messages.html" }
  ],
  teacher: [
    { icon: "📋", key: "menu.projects", page: "projects.html" },
    { icon: "✅", key: "menu.feedback", page: "feedback.html" },
    { icon: "🔍", key: "menu.audits", page: "meetings.html" },
    { icon: "📅", key: "menu.calendar", page: "calendar.html" },
    { icon: "💬", key: "menu.messages", page: "messages.html" }
  ]
};

// Page title depends on the role
document.getElementById("dash-title").dataset.i18n = "dash.title." + role;

// Build one card per menu option
const menu = document.getElementById("menu");
menus[role].forEach((item) => {
  const card = document.createElement("a");
  card.className = "menu-card";
  card.href = item.page;
  card.innerHTML = `
    <span class="menu-icon">${item.icon}</span>
    <h2 data-i18n="${item.key}"></h2>
    <p data-i18n="${item.key}.desc"></p>
  `;
  menu.appendChild(card);
});
