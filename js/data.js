// ---------- Shared texts ----------
Object.assign(translations.en, {
  "status.pending": "Pending review",
  "status.approved": "Approved",
  "status.observed": "Observed",
  "status.rejected": "Rejected",
  "common.unassigned": "Unassigned",
});

Object.assign(translations.es, {
  "status.pending": "Pendiente de revisión",
  "status.approved": "Aprobado",
  "status.observed": "Observado",
  "status.rejected": "Rechazado",
  "common.unassigned": "Sin asignar",
});

// ---------- Sample projects (demo data) ----------
const SAMPLE_PROJECTS = [
  {
    team: "G1",
    title: "Hospital appointment system",
    members: ["Lucía García", "Camila López"],
    beneficiaries: "Municipal Hospital",
    status: "approved",
    submittedAt: "2026-04-15",
    auditor: "Federico Ruiz",
    grade: 9,
  },
  {
    team: "G2",
    title: "Smart recycling app",
    members: ["Juan Pérez", "Martín Díaz"],
    beneficiaries: "Verde Vida Cooperative",
    status: "approved",
    submittedAt: "2026-04-20",
    auditor: "Laura Ferreyra",
    grade: 8,
  },
  {
    team: "G3",
    title: "Internship management platform",
    members: ["Sofía Ramírez", "Tomás Acosta"],
    beneficiaries: "Academic Office",
    status: "observed",
    submittedAt: "2026-05-10",
    auditor: "Diego Altamirano",
    grade: null,
  },
  {
    team: "G4",
    title: "Greenhouse monitoring system",
    members: ["Mateo Fernández", "Valentina Ruiz"],
    beneficiaries: "Local farmers",
    status: "pending",
    submittedAt: "2026-05-05",
    auditor: "Ernesto Lucero",
    grade: null,
  },
  {
    team: "G5",
    title: "University help-desk chatbot",
    members: ["Agustina Molina", "Nicolás Herrera"],
    beneficiaries: "University students",
    status: "rejected",
    submittedAt: "2026-05-12",
    auditor: null,
    grade: null,
  },
];

// ---------- All projects: samples + the one the student registered ----------
function getAllProjects() {
  const projects = [...SAMPLE_PROJECTS];
  const own = JSON.parse(localStorage.getItem("project"));
  if (own) {
    projects.push({
      team: "G6",
      title: own.title,
      members: own.members,
      beneficiaries: own.beneficiaries,
      status: own.status,
      submittedAt: own.submittedAt,
      auditor: null,
      grade: null,
    });
  }
  return projects;
}
