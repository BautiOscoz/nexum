// ---------- Texts for this page ----------
Object.assign(translations.en, {
  "nav.back": "← Back to dashboard",
  "project.formTitle": "Project proposal",
  "project.formSubtitle": "Fill in your team's proposal. The teaching staff will review it.",
  "project.title": "Title",
  "project.title.ph": "e.g. Smart recycling app",
  "project.description": "Description",
  "project.description.ph": "What the project is about and what problem it solves",
  "project.members": "Team members",
  "project.members.ph": "Names separated by commas",
  "project.objectives": "Objectives",
  "project.objectives.ph": "Main goals of the project",
  "project.beneficiaries": "Beneficiaries",
  "project.beneficiaries.ph": "Who will benefit from it",
  "project.submit": "Submit proposal",
  "project.edit": "Edit and resubmit",
  "project.submittedOn": "Submitted on",
  "status.pending": "Pending review",
  "error.required": "Please complete all the fields.",
  "error.titleShort": "The title must have at least 5 characters."
});

Object.assign(translations.es, {
  "nav.back": "← Volver al panel",
  "project.formTitle": "Propuesta de proyecto",
  "project.formSubtitle": "Completá la propuesta de tu equipo. La cátedra la va a revisar.",
  "project.title": "Título",
  "project.title.ph": "Ej.: App de reciclaje inteligente",
  "project.description": "Descripción",
  "project.description.ph": "De qué se trata el proyecto y qué problema resuelve",
  "project.members": "Integrantes",
  "project.members.ph": "Nombres separados por comas",
  "project.objectives": "Objetivos",
  "project.objectives.ph": "Objetivos principales del proyecto",
  "project.beneficiaries": "Beneficiarios",
  "project.beneficiaries.ph": "A quiénes beneficia",
  "project.submit": "Enviar propuesta",
  "project.edit": "Editar y reenviar",
  "project.submittedOn": "Enviada el",
  "status.pending": "Pendiente de revisión",
  "error.required": "Completá todos los campos.",
  "error.titleShort": "El título debe tener al menos 5 caracteres."
});

// ---------- Elements ----------
const formSection = document.getElementById("form-section");
const viewSection = document.getElementById("view-section");
const form = document.getElementById("project-form");
const errorBox = document.getElementById("form-error");
const fields = ["title", "description", "members", "objectives", "beneficiaries"];

// ---------- Saved data ----------
function loadProject() {
  return JSON.parse(localStorage.getItem("project"));
}

function saveProject(project) {
  localStorage.setItem("project", JSON.stringify(project));
}

// ---------- Show the form ----------
function showForm() {
  const project = loadProject();
  if (project) {
    fields.forEach((f) => {
      document.getElementById(f).value =
        f === "members" ? project.members.join(", ") : project[f];
    });
  }
  formSection.hidden = false;
  viewSection.hidden = true;
}

// ---------- Show the summary ----------
function showView() {
  const project = loadProject();
  document.getElementById("view-title").textContent = project.title;
  document.getElementById("view-date").textContent =
    new Date(project.submittedAt).toLocaleString(getLang());
  document.getElementById("view-description").textContent = project.description;
  document.getElementById("view-objectives").textContent = project.objectives;
  document.getElementById("view-beneficiaries").textContent = project.beneficiaries;

  const list = document.getElementById("view-members");
  list.innerHTML = "";
  project.members.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    list.appendChild(li);
  });

  // Status and feedback come from the teacher's evaluations
  const badge = document.getElementById("view-status");
  badge.className = "badge badge-" + project.status;
  badge.dataset.i18n = "status." + project.status;
  document.getElementById("view-reviews").innerHTML = reviewsHtml(project.reviews);
  document.getElementById("edit-btn").hidden = project.status === "approved";

  formSection.hidden = true;
  viewSection.hidden = false;
  applyTranslations();
}

// ---------- Validation ----------
function showError(key) {
  errorBox.dataset.i18n = key;
  errorBox.hidden = false;
  applyTranslations();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = {};
  fields.forEach((f) => (data[f] = document.getElementById(f).value.trim()));

  if (fields.some((f) => data[f] === "")) return showError("error.required");
  if (data.title.length < 5) return showError("error.titleShort");

  errorBox.hidden = true;
  data.members = data.members.split(",").map((m) => m.trim()).filter(Boolean);
  data.status = "pending";
  data.submittedAt = new Date().toISOString();
  data.reviews = loadProject()?.reviews ?? [];

  saveProject(data);
  showView();
});

document.getElementById("edit-btn").addEventListener("click", showForm);

// ---------- Start ----------
loadProject() ? showView() : showForm();
