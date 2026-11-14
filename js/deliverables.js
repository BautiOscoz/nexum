// Only students upload deliverables (teachers review them in Feedback)
if (localStorage.getItem("role") !== "student") {
  window.location.href = "dashboard.html";
}

// ---------- Texts for this page ----------
Object.assign(translations.en, {
  "deliv.title": "Deliverables",
  "deliv.subtitle": "Upload your team's submissions and follow the teachers' feedback.",
  "deliv.new": "New submission",
  "deliv.type": "Type",
  "deliv.file": "File",
  "deliv.demoNote": "Demo: the file stays on your computer, only its name is saved.",
  "deliv.note": "Note for the reviewers (optional)",
  "deliv.note.ph": "Anything the teachers should know",
  "deliv.submit": "Submit",
  "deliv.fileRequired": "Please choose a file.",
  "deliv.history": "Your submissions",
  "deliv.noDelete": "Submissions can't be deleted once sent. To fix one, upload a new version.",
  "deliv.empty": "You haven't submitted anything yet.",
  "deliv.version": "Version"
});

Object.assign(translations.es, {
  "deliv.title": "Entregas",
  "deliv.subtitle": "Subí las entregas de tu equipo y seguí las devoluciones de los docentes.",
  "deliv.new": "Nueva entrega",
  "deliv.type": "Tipo",
  "deliv.file": "Archivo",
  "deliv.demoNote": "Demo: el archivo queda en tu computadora, solo se guarda su nombre.",
  "deliv.note": "Nota para los evaluadores (opcional)",
  "deliv.note.ph": "Algo que los docentes deban saber",
  "deliv.submit": "Entregar",
  "deliv.fileRequired": "Elegí un archivo.",
  "deliv.history": "Tus entregas",
  "deliv.noDelete": "Las entregas no se pueden borrar una vez enviadas. Para corregir una, subí una nueva versión.",
  "deliv.empty": "Todavía no hiciste ninguna entrega.",
  "deliv.version": "Versión"
});

// ---------- Elements ----------
const uploadForm = document.getElementById("upload-form");
const fileInput = document.getElementById("file");
const errorBox = document.getElementById("upload-error");
const list = document.getElementById("submission-list");

// 482000 -> "482 KB", 1500000 -> "1.5 MB"
function formatSize(bytes) {
  return bytes >= 1e6 ? (bytes / 1e6).toFixed(1) + " MB" : Math.round(bytes / 1e3) + " KB";
}

// ---------- Upload ----------
uploadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const file = fileInput.files[0];

  if (!file) {
    errorBox.hidden = false;
    return;
  }
  errorBox.hidden = true;

  const submissions = getSubmissions();
  submissions.push({
    id: Date.now(),
    team: DEMO_TEAM,
    type: document.getElementById("type").value,
    fileName: file.name,
    fileSize: file.size,
    note: document.getElementById("note").value.trim(),
    submittedAt: new Date().toISOString(),
    status: "pending",
    reviews: []
  });
  saveSubmissions(submissions);

  uploadForm.reset();
  render();
});

// ---------- Draw the list ----------
function render() {
  const mine = getSubmissions().filter((s) => s.team === DEMO_TEAM);

  // Newest first
  mine.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  list.innerHTML = "";
  if (mine.length === 0) {
    list.innerHTML = `<p class="empty-state" data-i18n="deliv.empty"></p>`;
  }

  mine.forEach((s) => {
    // Version = how many submissions of this type were sent up to this one
    const version = mine.filter(
      (o) => o.type === s.type && new Date(o.submittedAt) <= new Date(s.submittedAt)
    ).length;

    const card = document.createElement("article");
    card.className = "item-card";
    card.innerHTML = `
      <div class="item-header">
        <h2><span data-i18n="types.${s.type}"></span> · <span data-i18n="deliv.version"></span> ${version}</h2>
        <span class="badge badge-${s.status}" data-i18n="status.${s.status}"></span>
      </div>
      <p>📎 ${escapeHtml(s.fileName)} <span class="small-muted">(${formatSize(s.fileSize)})</span></p>
      <p class="small-muted">${formatDate(s.submittedAt)}</p>
      ${s.note ? `<p>${escapeHtml(s.note)}</p>` : ""}
      <h3 data-i18n="reviews.title"></h3>
      ${reviewsHtml(s.reviews)}
    `;
    list.appendChild(card);
  });

  applyTranslations();
}

// Redraw after a language change (dates depend on the language)
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("lang-toggle").addEventListener("click", render);
});

render();
