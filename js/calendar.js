// ---------- Texts for this page ----------
Object.assign(translations.en, {
  "cal.title": "Calendar",
  "cal.subtitle.student": "Deadlines, meetings and defenses for your team.",
  "cal.subtitle.teacher": "Academic calendar shared with all the teams.",
  "cal.prev": "← Previous",
  "cal.next": "Next →",
  "cal.monthEvents": "Events this month",
  "cal.empty": "No events this month.",
  "cal.add": "Add an event",
  "cal.eventTitle": "Title",
  "cal.date": "Date",
  "cal.type": "Type",
  "cal.team": "Team",
  "cal.allTeams": "All teams",
  "cal.addBtn": "Add event",
  "cal.readOnly": "Read-only: events are managed by the teaching staff.",
  "evt.deadline": "Deadline",
  "evt.meeting": "Audit meeting",
  "evt.evaluation": "Evaluation",
  "evt.defense": "Final defense",
  "evt.reminder": "Reminder"
});

Object.assign(translations.es, {
  "cal.title": "Calendario",
  "cal.subtitle.student": "Entregas, reuniones y defensas de tu equipo.",
  "cal.subtitle.teacher": "Calendario académico compartido con todos los equipos.",
  "cal.prev": "← Anterior",
  "cal.next": "Siguiente →",
  "cal.monthEvents": "Eventos del mes",
  "cal.empty": "No hay eventos este mes.",
  "cal.add": "Agregar un evento",
  "cal.eventTitle": "Título",
  "cal.date": "Fecha",
  "cal.type": "Tipo",
  "cal.team": "Equipo",
  "cal.allTeams": "Todos los equipos",
  "cal.addBtn": "Agregar evento",
  "cal.readOnly": "Solo lectura: los eventos los administra la cátedra.",
  "evt.deadline": "Fecha de entrega",
  "evt.meeting": "Reunión de auditoría",
  "evt.evaluation": "Evaluación",
  "evt.defense": "Defensa final",
  "evt.reminder": "Recordatorio"
});

// ---------- Setup ----------
const role = localStorage.getItem("role");
const grid = document.getElementById("cal-grid");
const monthLabel = document.getElementById("month-label");
const monthEvents = document.getElementById("month-events");
const eventForm = document.getElementById("event-form");

document.getElementById("cal-subtitle").dataset.i18n = "cal.subtitle." + role;

// The month on screen (always day 1 of that month)
const today = new Date();
let current = new Date(today.getFullYear(), today.getMonth(), 1);

// ---------- Date helpers ----------
// year, month (0-11), day -> "2026-11-05"
function dayKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// "2026-11-05" -> Date (in local time, so the day never shifts)
function dateFromKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// ---------- All events visible to this user ----------
// Calendar events + audit meetings, so nothing has to be loaded twice
function visibleEvents() {
  const events = getEvents();

  getMeetings().forEach((m) => {
    events.push({
      id: "m" + m.id,
      title: t("evt.meeting") + " · " + m.team,
      date: m.date.slice(0, 10),
      type: "meeting",
      team: m.team
    });
  });

  if (role === "student") {
    return events.filter((e) => e.team === "all" || e.team === DEMO_TEAM);
  }
  return events;
}

// ---------- Draw the month ----------
function render() {
  const year = current.getFullYear();
  const month = current.getMonth();
  const lang = getLang();
  const events = visibleEvents();

  // "noviembre de 2026" -> "Noviembre de 2026"
  const label = current.toLocaleDateString(lang, { month: "long", year: "numeric" });
  monthLabel.textContent = label.charAt(0).toUpperCase() + label.slice(1);

  // Weekday names, starting on Monday (Jan 1, 2024 was a Monday)
  let html = "";
  for (let i = 0; i < 7; i++) {
    const name = new Date(2024, 0, 1 + i).toLocaleDateString(lang, { weekday: "short" });
    html += `<div class="cal-weekday">${name}</div>`;
  }

  // Empty cells before day 1 (getDay: Sunday = 0, so we shift to Monday = 0)
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  for (let i = 0; i < firstWeekday; i++) {
    html += `<div class="cal-day empty"></div>`;
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = dayKey(today.getFullYear(), today.getMonth(), today.getDate());

  for (let day = 1; day <= daysInMonth; day++) {
    const key = dayKey(year, month, day);
    const chips = events
      .filter((e) => e.date === key)
      .map((e) => `<span class="cal-chip evt-${e.type}">${escapeHtml(e.title)}</span>`)
      .join("");
    html += `
      <div class="cal-day ${key === todayKey ? "today" : ""}">
        <span class="cal-num">${day}</span>
        ${chips}
      </div>`;
  }

  grid.innerHTML = html;

  // List of this month's events, in date order
  const prefix = dayKey(year, month, 1).slice(0, 7); // "2026-11"
  const inMonth = events
    .filter((e) => e.date.startsWith(prefix))
    .sort((a, b) => a.date.localeCompare(b.date));

  monthEvents.innerHTML = inMonth.length
    ? inMonth
        .map(
          (e) => `
          <li>
            <i class="cal-dot evt-${e.type}"></i>
            <strong>${dateFromKey(e.date).toLocaleDateString(lang, { day: "numeric", month: "short" })}</strong>
            ${escapeHtml(e.title)}
            <span class="small-muted">· <span data-i18n="evt.${e.type}"></span>${
              e.team === "all" ? "" : " · " + escapeHtml(e.team)
            }</span>
          </li>`
        )
        .join("")
    : `<li class="small-muted" data-i18n="cal.empty"></li>`;

  applyTranslations();
}

// ---------- Month navigation ----------
document.getElementById("prev-month").addEventListener("click", () => {
  current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
  render();
});

document.getElementById("next-month").addEventListener("click", () => {
  current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  render();
});

// ---------- Teachers can add events; students only read ----------
if (role === "teacher") {
  eventForm.hidden = false;
  getAllProjects().forEach((p) => {
    document.getElementById("event-team").add(new Option(p.team, p.team));
  });

  eventForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("event-title").value.trim();
    const date = document.getElementById("event-date").value;
    const errorBox = document.getElementById("event-error");

    if (!title || !date) {
      errorBox.hidden = false;
      return;
    }
    errorBox.hidden = true;

    const events = getEvents();
    events.push({
      id: Date.now(),
      title,
      date,
      type: document.getElementById("event-type").value,
      team: document.getElementById("event-team").value
    });
    saveEvents(events);

    // Jump to the month of the new event
    const d = dateFromKey(date);
    current = new Date(d.getFullYear(), d.getMonth(), 1);
    eventForm.reset();
    render();
  });
} else {
  document.getElementById("read-only").hidden = false;
}

// Redraw after a language change (month and weekday names depend on it)
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("lang-toggle").addEventListener("click", render);
});

render();
