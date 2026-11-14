// ---------- Texts for this page ----------
Object.assign(translations.en, {
  "nav.back": "← Back to dashboard",
  "meetings.title.student": "Meetings",
  "meetings.subtitle.student": "Audit meetings of your team and their notes.",
  "meetings.title.teacher": "Audits",
  "meetings.subtitle.teacher":
    "Schedule technical audits and follow up on every team.",
  "meetings.schedule": "Schedule an audit",
  "meetings.team": "Team",
  "meetings.date": "Date and time",
  "meetings.topics": "Topics",
  "meetings.topics.ph": "What will be reviewed in this meeting",
  "meetings.scheduleBtn": "Schedule audit",
  "meetings.allTeams": "All teams",
  "meetings.auditor": "Technical auditor",
  "meetings.upcoming": "Upcoming",
  "meetings.done": "Held",
  "meetings.comments": "Comments",
  "meetings.noComments": "No comments yet.",
  "meetings.comment.ph": "Add a note about this meeting...",
  "meetings.addComment": "Add comment",
  "meetings.commentsAfter": "Comments open once the meeting has taken place.",
  "meetings.empty.student":
    "Your team has no meetings yet. They will show up here once a teacher schedules them.",
  "meetings.empty.teacher": "No meetings for this team yet.",
  "error.required": "Please complete all the fields.",
});

Object.assign(translations.es, {
  "nav.back": "← Volver al panel",
  "meetings.title.student": "Reuniones",
  "meetings.subtitle.student":
    "Reuniones de auditoría de tu equipo y sus notas.",
  "meetings.title.teacher": "Auditorías",
  "meetings.subtitle.teacher":
    "Agendá auditorías técnicas y hacé el seguimiento de cada equipo.",
  "meetings.schedule": "Agendar una auditoría",
  "meetings.team": "Equipo",
  "meetings.date": "Fecha y hora",
  "meetings.topics": "Temas",
  "meetings.topics.ph": "Qué se va a revisar en esta reunión",
  "meetings.scheduleBtn": "Agendar auditoría",
  "meetings.allTeams": "Todos los equipos",
  "meetings.auditor": "Auditor técnico",
  "meetings.upcoming": "Próxima",
  "meetings.done": "Realizada",
  "meetings.comments": "Comentarios",
  "meetings.noComments": "Todavía no hay comentarios.",
  "meetings.comment.ph": "Agregá una nota sobre esta reunión...",
  "meetings.addComment": "Agregar comentario",
  "meetings.commentsAfter":
    "Los comentarios se habilitan cuando la reunión ya se realizó.",
  "meetings.empty.student":
    "Tu equipo todavía no tiene reuniones. Van a aparecer acá cuando un docente las agende.",
  "meetings.empty.teacher": "Este equipo todavía no tiene reuniones.",
  "error.required": "Completá todos los campos.",
});

// ---------- Setup ----------
const role = localStorage.getItem("role");
const STUDENT_TEAM = "G6"; // the demo student's team

const list = document.getElementById("meeting-list");
const teamFilter = document.getElementById("team-filter");
const scheduleForm = document.getElementById("schedule-form");

document.getElementById("page-title").dataset.i18n = "meetings.title." + role;
document.getElementById("page-subtitle").dataset.i18n =
  "meetings.subtitle." + role;

// ---------- Helpers ----------
function formatDate(value) {
  return new Date(value).toLocaleString(getLang(), {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// Turns user text into safe HTML (so nobody can inject code)
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ---------- Teacher tools ----------
if (role === "teacher") {
  document.getElementById("teacher-tools").hidden = false;

  const teams = getAllProjects().map((p) => p.team);
  teams.forEach((team) => {
    document.getElementById("schedule-team").add(new Option(team, team));
    teamFilter.add(new Option(team, team));
  });

  teamFilter.addEventListener("change", render);

  scheduleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const team = document.getElementById("schedule-team").value;
    const date = document.getElementById("schedule-date").value;
    const topics = document.getElementById("schedule-topics").value.trim();
    const errorBox = document.getElementById("schedule-error");

    if (!team || !date || !topics) {
      errorBox.hidden = false;
      return;
    }
    errorBox.hidden = true;

    const project = getAllProjects().find((p) => p.team === team);
    const meetings = getMeetings();
    meetings.push({
      id: Date.now(),
      team,
      date,
      auditor: project?.auditor ?? "Demo Teacher",
      topics,
      comments: [],
    });
    saveMeetings(meetings);

    scheduleForm.reset();
    render();
  });
}

// ---------- Comments ----------
function addComment(meetingId, text) {
  const meetings = getMeetings();
  const meeting = meetings.find((m) => m.id === meetingId);
  meeting.comments.push({ role, text, at: new Date().toISOString() });
  saveMeetings(meetings);
  render();
}

// ---------- One meeting card ----------
function meetingCard(m) {
  const done = new Date(m.date) < new Date();

  const comments = m.comments
    .map(
      (c) => `
        <li>
          <strong data-i18n="roles.${c.role}"></strong>
          <span class="small-muted">${formatDate(c.at)}</span>
          <p>${escapeHtml(c.text)}</p>
        </li>`,
    )
    .join("");

  const card = document.createElement("article");
  card.className = "meeting-card";
  card.innerHTML = `
    <div class="meeting-header">
      <h2>${escapeHtml(m.team)} · ${formatDate(m.date)}</h2>
      <span class="badge ${done ? "badge-approved" : "badge-observed"}"
            data-i18n="meetings.${done ? "done" : "upcoming"}"></span>
    </div>
    <p><strong data-i18n="meetings.auditor"></strong>: ${escapeHtml(m.auditor)}</p>
    <p><strong data-i18n="meetings.topics"></strong>: ${escapeHtml(m.topics)}</p>

    <h3 data-i18n="meetings.comments"></h3>
    ${
      comments
        ? `<ul class="comments">${comments}</ul>`
        : `<p class="small-muted" data-i18n="meetings.noComments"></p>`
    }

    ${
      done
        ? `<form class="comment-form">
           <textarea rows="2" data-i18n-placeholder="meetings.comment.ph"></textarea>
           <button type="submit" class="btn-secondary" data-i18n="meetings.addComment"></button>
         </form>`
        : `<p class="small-muted" data-i18n="meetings.commentsAfter"></p>`
    }
  `;

  if (done) {
    card.querySelector(".comment-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const text = event.target.querySelector("textarea").value.trim();
      if (text) addComment(m.id, text);
    });
  }

  return card;
}

// ---------- Draw the list ----------
function render() {
  let meetings = getMeetings();

  if (role === "student") {
    meetings = meetings.filter((m) => m.team === STUDENT_TEAM);
  } else if (teamFilter.value !== "all") {
    meetings = meetings.filter((m) => m.team === teamFilter.value);
  }

  meetings.sort((a, b) => b.date.localeCompare(a.date)); // newest first

  list.innerHTML = "";
  if (meetings.length === 0) {
    list.innerHTML = `<p class="empty-state" data-i18n="meetings.empty.${role}"></p>`;
  }
  meetings.forEach((m) => list.appendChild(meetingCard(m)));

  applyTranslations();
}

// Redraw after a language change (dates depend on the language)
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("lang-toggle").addEventListener("click", render);
});

render();
