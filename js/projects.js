// Only teachers can see this page
if (localStorage.getItem("role") !== "teacher") {
  window.location.href = "dashboard.html";
}

// ---------- Texts for this page ----------
Object.assign(translations.en, {
  "nav.back": "← Back to dashboard",
  "projects.title": "Projects in charge",
  "projects.subtitle": "Search, filter and sort the projects you supervise.",
  "projects.search.ph": "Search by team, project, student or auditor...",
  "projects.filter.all": "All statuses",
  "projects.count": "Showing {n} of {total} projects",
  "projects.empty": "No projects match your search.",
  "col.team": "Team",
  "col.title": "Project",
  "col.members": "Members",
  "col.status": "Status",
  "col.submitted": "Submitted",
  "col.auditor": "Technical auditor",
  "col.grade": "Grade"
});

Object.assign(translations.es, {
  "nav.back": "← Volver al panel",
  "projects.title": "Proyectos a cargo",
  "projects.subtitle": "Buscá, filtrá y ordená los proyectos que supervisás.",
  "projects.search.ph": "Buscar por equipo, proyecto, estudiante o auditor...",
  "projects.filter.all": "Todos los estados",
  "projects.count": "Mostrando {n} de {total} proyectos",
  "projects.empty": "Ningún proyecto coincide con la búsqueda.",
  "col.team": "Equipo",
  "col.title": "Proyecto",
  "col.members": "Integrantes",
  "col.status": "Estado",
  "col.submitted": "Presentado",
  "col.auditor": "Auditor técnico",
  "col.grade": "Nota"
});

// ---------- Elements and state ----------
const searchInput = document.getElementById("search");
const statusFilter = document.getElementById("status-filter");
const tableBody = document.getElementById("table-body");
const countText = document.getElementById("count");
const headers = document.querySelectorAll("th[data-sort]");

let sort = { key: "team", dir: 1 }; // dir: 1 = ascending, -1 = descending

function t(key) {
  return translations[getLang()][key];
}

// Value used to compare two projects in a given column
function sortValue(project, key) {
  if (key === "members") return project.members.join(", ");
  if (key === "grade") return project.grade ?? -1;
  return (project[key] ?? "").toString().toLowerCase();
}

// Creates a table cell with safe text
function cell(text) {
  const td = document.createElement("td");
  td.textContent = text;
  return td;
}

// ---------- Draw the table ----------
function render() {
  const all = getAllProjects();
  const text = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;

  const list = all.filter((p) => {
    const matchesStatus = status === "all" || p.status === status;
    const searchable = [p.team, p.title, p.members.join(" "), p.auditor ?? ""]
      .join(" ")
      .toLowerCase();
    return matchesStatus && searchable.includes(text);
  });

  list.sort((a, b) => {
    const va = sortValue(a, sort.key);
    const vb = sortValue(b, sort.key);
    return (va > vb ? 1 : va < vb ? -1 : 0) * sort.dir;
  });

  tableBody.innerHTML = "";

  if (list.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 7;
    td.className = "empty";
    td.dataset.i18n = "projects.empty";
    tr.appendChild(td);
    tableBody.appendChild(tr);
  }

  list.forEach((p) => {
    const tr = document.createElement("tr");
    tr.appendChild(cell(p.team));
    tr.appendChild(cell(p.title));
    tr.appendChild(cell(p.members.join(", ")));

    const statusTd = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "badge badge-" + p.status;
    badge.dataset.i18n = "status." + p.status;
    statusTd.appendChild(badge);
    tr.appendChild(statusTd);

    tr.appendChild(cell(new Date(p.submittedAt).toLocaleDateString(getLang())));

    const auditorTd = cell(p.auditor ?? "");
    if (!p.auditor) {
      auditorTd.dataset.i18n = "common.unassigned";
      auditorTd.className = "muted";
    }
    tr.appendChild(auditorTd);

    tr.appendChild(cell(p.grade ?? "—"));
    tableBody.appendChild(tr);
  });

  countText.textContent = t("projects.count")
    .replace("{n}", list.length)
    .replace("{total}", all.length);

  headers.forEach((th) => {
    const arrow = th.querySelector(".arrow");
    arrow.textContent = th.dataset.sort === sort.key ? (sort.dir === 1 ? " ▲" : " ▼") : "";
  });

  applyTranslations();
}

// ---------- Events ----------
searchInput.addEventListener("input", render);
statusFilter.addEventListener("change", render);

headers.forEach((th) => {
  th.addEventListener("click", () => {
    const key = th.dataset.sort;
    sort = { key, dir: sort.key === key ? -sort.dir : 1 };
    render();
  });
});

// Redraw after a language change (dates and counter depend on the language)
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("lang-toggle").addEventListener("click", render);
});

render();
