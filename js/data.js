// =====================================================
// Shared data and helpers used by every page after login
// =====================================================

// The demo student always belongs to this team
const DEMO_TEAM = "G6";

// ---------- Shared texts ----------
Object.assign(translations.en, {
  "nav.back": "← Back to dashboard",
  "status.pending": "Pending review",
  "status.approved": "Approved",
  "status.observed": "Observed",
  "status.rejected": "Rejected",
  "common.unassigned": "Unassigned",
  "error.required": "Please complete all the fields.",
  "reviews.title": "Feedback history",
  "reviews.none": "No feedback yet.",
  "reviews.grade": "Grade",
  "types.proposal": "Project proposal",
  "types.progress1": "Progress report 1",
  "types.progress2": "Progress report 2",
  "types.final": "Final documentation"
});

Object.assign(translations.es, {
  "nav.back": "← Volver al panel",
  "status.pending": "Pendiente de revisión",
  "status.approved": "Aprobado",
  "status.observed": "Observado",
  "status.rejected": "Rechazado",
  "common.unassigned": "Sin asignar",
  "error.required": "Completá todos los campos.",
  "reviews.title": "Historial de devoluciones",
  "reviews.none": "Todavía no hay devoluciones.",
  "reviews.grade": "Nota",
  "types.proposal": "Propuesta de proyecto",
  "types.progress1": "Reporte de avance 1",
  "types.progress2": "Reporte de avance 2",
  "types.final": "Documentación final"
});

// ---------- Helpers ----------
function t(key) {
  return translations[getLang()][key] ?? key;
}

// Turns user text into safe HTML (so nobody can inject code)
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Date and time, e.g. "Nov 14, 2026, 4:30 PM"
function formatDate(value) {
  return new Date(value).toLocaleString(getLang(), {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

// Reads a list from the browser, or starts from the sample data
function loadList(key, sample) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(sample));
}

function saveList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

// HTML for a list of teacher evaluations (used in several pages)
function reviewsHtml(reviews = []) {
  if (reviews.length === 0) {
    return `<p class="small-muted" data-i18n="reviews.none"></p>`;
  }
  const items = reviews
    .map(
      (r) => `
        <li>
          <div class="review-top">
            <span class="badge badge-${r.status}" data-i18n="status.${r.status}"></span>
            ${r.grade ? `<span class="grade"><span data-i18n="reviews.grade"></span>: ${r.grade}</span>` : ""}
            <span class="small-muted">${formatDate(r.at)}</span>
          </div>
          ${r.comment ? `<p>${escapeHtml(r.comment)}</p>` : ""}
        </li>`
    )
    .join("");
  return `<ul class="reviews">${items}</ul>`;
}

// =====================================================
// Projects
// =====================================================
const SAMPLE_PROJECTS = [
  {
    team: "G1",
    title: "Hospital appointment system",
    members: ["Lucía García", "Camila López"],
    beneficiaries: "Municipal Hospital",
    status: "approved",
    submittedAt: "2026-04-15T12:00",
    auditor: "Federico Ruiz",
    grade: 9
  },
  {
    team: "G2",
    title: "Smart recycling app",
    members: ["Juan Pérez", "Martín Díaz"],
    beneficiaries: "Verde Vida Cooperative",
    status: "approved",
    submittedAt: "2026-04-20T12:00",
    auditor: "Laura Ferreyra",
    grade: 8
  },
  {
    team: "G3",
    title: "Internship management platform",
    members: ["Sofía Ramírez", "Tomás Acosta"],
    beneficiaries: "Academic Office",
    status: "observed",
    submittedAt: "2026-05-10T12:00",
    auditor: "Diego Altamirano",
    grade: null
  },
  {
    team: "G4",
    title: "Greenhouse monitoring system",
    members: ["Mateo Fernández", "Valentina Ruiz"],
    beneficiaries: "Local farmers",
    status: "pending",
    submittedAt: "2026-05-05T12:00",
    auditor: "Ernesto Lucero",
    grade: null
  },
  {
    team: "G5",
    title: "University help-desk chatbot",
    members: ["Agustina Molina", "Nicolás Herrera"],
    beneficiaries: "University students",
    status: "rejected",
    submittedAt: "2026-05-12T12:00",
    auditor: null,
    grade: null
  }
];

// All projects: samples + the one the demo student registered
function getAllProjects() {
  const projects = [...SAMPLE_PROJECTS];
  const own = JSON.parse(localStorage.getItem("project"));
  if (own) {
    projects.push({
      team: DEMO_TEAM,
      title: own.title,
      members: own.members,
      beneficiaries: own.beneficiaries,
      status: own.status,
      submittedAt: own.submittedAt,
      auditor: null,
      grade: own.grade ?? null
    });
  }
  return projects;
}

// =====================================================
// Meetings
// =====================================================
const SAMPLE_MEETINGS = [
  {
    id: 1,
    team: "G1",
    date: "2026-06-20T10:00",
    auditor: "Federico Ruiz",
    topics: "Requirements review and use cases",
    comments: [
      {
        role: "teacher",
        text: "Good progress. Please add the missing sequence diagrams.",
        at: "2026-06-20T11:00"
      }
    ]
  },
  {
    id: 2,
    team: "G2",
    date: "2026-07-02T15:30",
    auditor: "Laura Ferreyra",
    topics: "Prototype demo and test plan",
    comments: []
  },
  {
    id: 3,
    team: "G3",
    date: "2026-12-03T09:00",
    auditor: "Diego Altamirano",
    topics: "Follow-up on observed proposal",
    comments: []
  },
  {
    id: 4,
    team: "G1",
    date: "2026-12-10T10:00",
    auditor: "Federico Ruiz",
    topics: "Sprint 2 progress report",
    comments: []
  }
];

function getMeetings() {
  return loadList("meetings", SAMPLE_MEETINGS);
}

function saveMeetings(meetings) {
  saveList("meetings", meetings);
}

// =====================================================
// Deliverables (submissions)
// =====================================================
const SAMPLE_SUBMISSIONS = [
  {
    id: 101,
    team: "G1",
    type: "progress1",
    fileName: "G1_progress_report_1.pdf",
    fileSize: 482000,
    note: "First sprint: requirements and prototype.",
    submittedAt: "2026-07-10T18:20",
    status: "approved",
    reviews: [
      { status: "approved", grade: 9, comment: "Clear and complete. Good job.", at: "2026-07-14T10:00" }
    ]
  },
  {
    id: 102,
    team: "G2",
    type: "progress1",
    fileName: "G2_sprint1.pdf",
    fileSize: 350000,
    note: "",
    submittedAt: "2026-07-12T21:05",
    status: "observed",
    reviews: [
      { status: "observed", grade: null, comment: "Add the test cases for the login flow.", at: "2026-07-15T09:30" }
    ]
  },
  {
    id: 103,
    team: "G3",
    type: "progress1",
    fileName: "G3_progress_report.docx",
    fileSize: 610000,
    note: "Includes the corrected proposal.",
    submittedAt: "2026-11-02T16:45",
    status: "pending",
    reviews: []
  },
  {
    id: 104,
    team: "G1",
    type: "progress2",
    fileName: "G1_progress_report_2.pdf",
    fileSize: 530000,
    note: "",
    submittedAt: "2026-11-08T12:10",
    status: "pending",
    reviews: []
  }
];

function getSubmissions() {
  return loadList("submissions", SAMPLE_SUBMISSIONS);
}

function saveSubmissions(submissions) {
  saveList("submissions", submissions);
}

// =====================================================
// Calendar events
// =====================================================
const SAMPLE_EVENTS = [
  { id: 201, title: "Weekly progress update", date: "2026-11-17", type: "reminder", team: DEMO_TEAM },
  { id: 202, title: "Progress report 2 deadline", date: "2026-11-20", type: "deadline", team: "all" },
  { id: 203, title: "Preliminary evaluation G1", date: "2026-11-25", type: "evaluation", team: "G1" },
  { id: 204, title: "Final documentation deadline", date: "2026-12-15", type: "deadline", team: "all" },
  { id: 205, title: "Final defenses", date: "2026-12-18", type: "defense", team: "all" }
];

function getEvents() {
  return loadList("events", SAMPLE_EVENTS);
}

function saveEvents(events) {
  saveList("events", events);
}

// =====================================================
// Messages
// =====================================================
const SAMPLE_MESSAGES = [
  {
    id: 301,
    team: DEMO_TEAM,
    role: "teacher",
    text: "Welcome to Nexum! Use this channel for any question about your project.",
    at: "2026-11-10T09:00"
  },
  {
    id: 302,
    team: "G1",
    role: "teacher",
    text: "Remember to upload Progress report 2 before the deadline.",
    at: "2026-11-05T11:00"
  },
  {
    id: 303,
    team: "G1",
    role: "student",
    text: "Thanks! We'll upload it this week.",
    at: "2026-11-05T13:20"
  }
];

function getMessages() {
  return loadList("messages", SAMPLE_MESSAGES);
}

function saveMessages(messages) {
  saveList("messages", messages);
}
