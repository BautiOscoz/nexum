// Only teachers evaluate
if (localStorage.getItem("role") !== "teacher") {
  window.location.href = "dashboard.html";
}

// ---------- Texts for this page ----------
Object.assign(translations.en, {
  "feedback.title": "Feedback",
  "feedback.subtitle": "Evaluate proposals and deliverables. Pending items are shown first.",
  "feedback.filter.all": "All statuses",
  "feedback.empty": "Nothing to show with this filter.",
  "feedback.evaluate": "Evaluate",
  "feedback.result": "Result",
  "feedback.choose": "Choose a result...",
  "feedback.grade": "Grade (1-10, optional)",
  "feedback.comment": "Comments",
  "feedback.comment.ph": "What is good and what needs to change",
  "feedback.save": "Save evaluation",
  "feedback.errorStatus": "Choose a result.",
  "feedback.errorComment": "Explain what to fix when the result is Observed or Rejected.",
  "feedback.errorGrade": "The grade must be a number from 1 to 10."
});

Object.assign(translations.es, {
  "feedback.title": "Devoluciones",
  "feedback.subtitle": "Evaluá propuestas y entregas. Lo pendiente aparece primero.",
  "feedback.filter.all": "Todos los estados",
  "feedback.empty": "No hay nada para mostrar con este filtro.",
  "feedback.evaluate": "Evaluar",
  "feedback.result": "Resultado",
  "feedback.choose": "Elegí un resultado...",
  "feedback.grade": "Nota (1-10, opcional)",
  "feedback.comment": "Comentarios",
  "feedback.comment.ph": "Qué está bien y qué hay que cambiar",
  "feedback.save": "Guardar evaluación",
  "feedback.errorStatus": "Elegí un resultado.",
  "feedback.errorComment": "Explicá qué corregir cuando el resultado es Observado o Rechazado.",
  "feedback.errorGrade": "La nota debe ser un número del 1 al 10."
});

const list = document.getElementById("review-list");
const statusFilter = document.getElementById("status-filter");

// ---------- Everything a teacher can evaluate ----------
// The student's proposal + all the deliverables, in one list
function getReviewItems() {
  const items = [];

  const project = JSON.parse(localStorage.getItem("project"));
  if (project) {
    items.push({
      kind: "proposal",
      id: "proposal",
      team: DEMO_TEAM,
      type: "proposal",
      detail: project.title,
      submittedAt: project.submittedAt,
      status: project.status,
      reviews: project.reviews ?? []
    });
  }

  getSubmissions().forEach((s) => {
    items.push({ kind: "submission", ...s, detail: s.fileName });
  });

  return items;
}

// ---------- Save an evaluation ----------
function saveReview(item, review) {
  if (item.kind === "proposal") {
    const project = JSON.parse(localStorage.getItem("project"));
    project.status = review.status;
    project.reviews = [...(project.reviews ?? []), review];
    if (review.grade) project.grade = review.grade;
    localStorage.setItem("project", JSON.stringify(project));
  } else {
    const submissions = getSubmissions();
    const submission = submissions.find((s) => s.id === item.id);
    submission.status = review.status;
    submission.reviews.push(review);
    saveSubmissions(submissions);
  }
  render();
}

// ---------- One card with its evaluation form ----------
function reviewCard(item) {
  const card = document.createElement("article");
  card.className = "item-card";
  card.innerHTML = `
    <div class="item-header">
      <h2>${escapeHtml(item.team)} · <span data-i18n="types.${item.type}"></span></h2>
      <span class="badge badge-${item.status}" data-i18n="status.${item.status}"></span>
    </div>
    <p>${item.kind === "proposal" ? "📁" : "📎"} ${escapeHtml(item.detail)}</p>
    <p class="small-muted">${formatDate(item.submittedAt)}</p>
    ${item.note ? `<p>${escapeHtml(item.note)}</p>` : ""}

    <h3 data-i18n="reviews.title"></h3>
    ${reviewsHtml(item.reviews)}

    <details class="review-box" ${item.status === "pending" ? "open" : ""}>
      <summary data-i18n="feedback.evaluate"></summary>
      <form class="review-form" novalidate>
        <label data-i18n="feedback.result"></label>
        <select name="status">
          <option value="" data-i18n="feedback.choose"></option>
          <option value="approved" data-i18n="status.approved"></option>
          <option value="observed" data-i18n="status.observed"></option>
          <option value="rejected" data-i18n="status.rejected"></option>
        </select>

        <label data-i18n="feedback.grade"></label>
        <input name="grade" type="number" min="1" max="10">

        <label data-i18n="feedback.comment"></label>
        <textarea name="comment" rows="3" data-i18n-placeholder="feedback.comment.ph"></textarea>

        <p class="form-error" hidden></p>
        <button type="submit" class="btn-primary" data-i18n="feedback.save"></button>
      </form>
    </details>
  `;

  const form = card.querySelector(".review-form");
  const errorBox = form.querySelector(".form-error");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.status.value;
    const comment = form.comment.value.trim();
    const grade = form.grade.value === "" ? null : Number(form.grade.value);

    let error = null;
    if (!status) error = "feedback.errorStatus";
    else if (status !== "approved" && !comment) error = "feedback.errorComment";
    else if (grade !== null && (!Number.isInteger(grade) || grade < 1 || grade > 10)) {
      error = "feedback.errorGrade";
    }

    if (error) {
      errorBox.dataset.i18n = error;
      errorBox.hidden = false;
      applyTranslations();
      return;
    }

    saveReview(item, { status, grade, comment, at: new Date().toISOString() });
  });

  return card;
}

// ---------- Draw the list ----------
function render() {
  const filter = statusFilter.value;
  let items = getReviewItems();
  if (filter !== "all") items = items.filter((i) => i.status === filter);

  // Pending first, then newest first
  items.sort((a, b) => {
    if ((a.status === "pending") !== (b.status === "pending")) {
      return a.status === "pending" ? -1 : 1;
    }
    return new Date(b.submittedAt) - new Date(a.submittedAt);
  });

  list.innerHTML = "";
  if (items.length === 0) {
    list.innerHTML = `<p class="empty-state" data-i18n="feedback.empty"></p>`;
  }
  items.forEach((item) => list.appendChild(reviewCard(item)));

  applyTranslations();
}

statusFilter.addEventListener("change", render);

// Redraw after a language change (dates depend on the language)
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("lang-toggle").addEventListener("click", render);
});

render();
