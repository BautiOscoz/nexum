# Nexum · Capstone Project Management System

Web app that manages the full lifecycle of final-year engineering projects: proposals, team follow-up, technical audits, deliverables, evaluations and the academic calendar.

**🔗 Live demo:** https://bautioscoz.github.io/nexum/

> Pick a role on the login screen (*Student team* or *Teacher / Auditor*) to explore the app. No account needed.

## About the project

Nexum started as the capstone project of my Software Engineering course, where my teammate and I wrote the full requirements specification: functional and non-functional requirements, use cases, collaboration and sequence diagrams, a test plan and a deployment plan.

This repository is the implementation of that specification as an interactive, bilingual demo.

## Features

**Student team**
- Register a project proposal with validation, and edit and resubmit it after feedback
- Upload deliverables with automatic versioning (submissions can't be deleted, as required by the spec)
- Follow audit meetings and add notes once a meeting has taken place
- Read-only academic calendar with deadlines, audits and defenses
- Chat with the teaching staff

**Teacher / Auditor**
- Projects table with search, status filter and column sorting
- Evaluate proposals and deliverables: Approved, Observed or Rejected, with grade and comments, keeping the full feedback history
- Schedule technical audits per team
- Shared calendar: add deadlines, evaluations and defenses for one team or for everyone
- Chat with each team

**General**
- Role-based access: each role only sees and opens its own pages
- English / Spanish language toggle, remembered between visits
- Responsive layout for desktop and mobile
- User input is always escaped before being shown, to prevent HTML injection

## Tech stack

- HTML5, CSS3 and vanilla JavaScript (no frameworks or libraries)
- `localStorage` to keep the demo data in the browser
- GitHub Pages for hosting

## Project structure

```
nexum/
├── index.html          Login and role selection
├── dashboard.html      Menu for each role
├── project.html        Student: project proposal
├── deliverables.html   Student: submissions
├── projects.html       Teacher: projects table
├── feedback.html       Teacher: evaluations
├── meetings.html       Both: audit meetings
├── calendar.html       Both: academic calendar
├── messages.html       Both: chat
├── css/style.css
└── js/
    ├── i18n.js         Translation system
    ├── auth.js         Session check and logout
    ├── data.js         Sample data and shared helpers
    └── one script per page
```

## Run it locally

1. Clone the repository: `git clone https://github.com/BautiOscoz/nexum.git`
2. Open the folder in VS Code and start **Live Server** on `index.html`, or simply open `index.html` in a browser.

To reset the demo data, clear the site's local storage in the browser's developer tools.

## Roadmap

- Backend with a real database and authentication
- Real file uploads
- Email notifications for key events
- PDF and Excel report export

## Authors

- **Bautista Oscoz**: implementation
- Requirements specification co-authored with Lautaro Salvador
