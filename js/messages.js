// ---------- Texts for this page ----------
Object.assign(translations.en, {
  "msg.title": "Messages",
  "msg.subtitle.student": "Chat with the teaching staff about your project.",
  "msg.subtitle.teacher": "Chat with each team you supervise.",
  "msg.team": "Team",
  "msg.ph": "Write a message...",
  "msg.send": "Send",
  "msg.empty": "No messages yet. Say hi!"
});

Object.assign(translations.es, {
  "msg.title": "Mensajes",
  "msg.subtitle.student": "Chateá con la cátedra sobre tu proyecto.",
  "msg.subtitle.teacher": "Chateá con cada equipo que supervisás.",
  "msg.team": "Equipo",
  "msg.ph": "Escribí un mensaje...",
  "msg.send": "Enviar",
  "msg.empty": "Todavía no hay mensajes. ¡Saludá!"
});

// ---------- Setup ----------
const role = localStorage.getItem("role");
const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const teamSelect = document.getElementById("msg-team");

document.getElementById("msg-subtitle").dataset.i18n = "msg.subtitle." + role;

// Teachers choose which team to talk to; students always talk as their team
if (role === "teacher") {
  document.getElementById("team-picker").hidden = false;
  getAllProjects().forEach((p) => teamSelect.add(new Option(p.team, p.team)));
  teamSelect.addEventListener("change", render);
}

function currentTeam() {
  return role === "teacher" ? teamSelect.value : DEMO_TEAM;
}

// ---------- Draw the conversation ----------
function render() {
  const messages = getMessages()
    .filter((m) => m.team === currentTeam())
    .sort((a, b) => new Date(a.at) - new Date(b.at)); // oldest first, like any chat

  chatLog.innerHTML = messages.length
    ? messages
        .map(
          (m) => `
          <div class="msg ${m.role === role ? "mine" : ""}">
            <span class="msg-author" data-i18n="roles.${m.role}"></span>
            <p>${escapeHtml(m.text)}</p>
            <span class="msg-time">${formatDate(m.at)}</span>
          </div>`
        )
        .join("")
    : `<p class="small-muted chat-empty" data-i18n="msg.empty"></p>`;

  applyTranslations();
  chatLog.scrollTop = chatLog.scrollHeight; // jump to the latest message
}

// ---------- Send ----------
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  const messages = getMessages();
  messages.push({ id: Date.now(), team: currentTeam(), role, text, at: new Date().toISOString() });
  saveMessages(messages);

  chatInput.value = "";
  render();
});

// Redraw after a language change (dates depend on the language)
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("lang-toggle").addEventListener("click", render);
});

render();
