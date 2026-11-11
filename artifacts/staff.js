// Key used to persist the club list in this browser's localStorage.
// Each club has a "status" of "pending", "approved", or "rejected".
const STORAGE_KEY = "cuseconnect_clubs";

const DEFAULT_CLUBS = [
  { id: "seed-1", name: "Club 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", status: "pending" },
  { id: "seed-2", name: "Club 2", description: "Sed do eiusmod tempor incididunt ut labore et dolore.", status: "pending" },
  { id: "seed-3", name: "Club 3", description: "Ut enim ad minim veniam, quis nostrud exercitation.", status: "pending" },
];

const pendingGrid = document.getElementById("pendingGrid");
const noPending = document.getElementById("noPending");
const approvedGrid = document.getElementById("approvedGrid");
const noApproved = document.getElementById("noApproved");
const rejectedGrid = document.getElementById("rejectedGrid");
const noRejected = document.getElementById("noRejected");

function loadClubs() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(stored)) return stored;
  } catch (err) {
    // fall through to defaults
  }
  return DEFAULT_CLUBS;
}

function saveClubs(clubs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clubs));
}

// Minimal HTML-escaping so club names/descriptions can't break the page's markup.
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderReadOnlyGrid(grid, emptyEl, clubs, extraClass) {
  grid.innerHTML = "";
  emptyEl.style.display = clubs.length === 0 ? "block" : "none";

  clubs.forEach((club, index) => {
    const card = document.createElement("div");
    card.className = "org-card" + (extraClass ? " " + extraClass : "");
    card.dataset.id = club.id;

    card.innerHTML = `
      <div class="org-art">${index + 1}</div>
      <h3>${escapeHtml(club.name)}</h3>
      <p>${escapeHtml(club.description || "")}</p>
    `;

    grid.appendChild(card);
  });
}

function renderClubs() {
  const clubs = loadClubs();
  const pending = clubs.filter((club) => club.status === "pending");
  const approved = clubs.filter((club) => club.status === "approved");
  const rejected = clubs.filter((club) => club.status === "rejected");

  // Pending clubs — each gets an Accept and a Reject button.
  pendingGrid.innerHTML = "";
  noPending.style.display = pending.length === 0 ? "block" : "none";

  pending.forEach((club, index) => {
    const card = document.createElement("div");
    card.className = "org-card";
    card.dataset.id = club.id;

    card.innerHTML = `
      <div class="org-art">${index + 1}</div>
      <h3>${escapeHtml(club.name)}</h3>
      <p>${escapeHtml(club.description || "")}</p>
      <div class="card-actions">
        <button type="button" class="btn-accept accept-btn">Accept</button>
        <button type="button" class="btn-decline reject-btn">Reject</button>
      </div>
    `;

    pendingGrid.appendChild(card);
  });

  // Approved and rejected clubs are read-only lists.
  renderReadOnlyGrid(approvedGrid, noApproved, approved);
  renderReadOnlyGrid(rejectedGrid, noRejected, rejected, "rejected");
}

// Event delegation: handles every Accept/Reject button, including ones
// added after the page first loads.
pendingGrid.addEventListener("click", (event) => {
  const acceptButton = event.target.closest(".accept-btn");
  const rejectButton = event.target.closest(".reject-btn");
  if (!acceptButton && !rejectButton) return;

  const card = event.target.closest(".org-card");
  const id = card.dataset.id;
  const clubs = loadClubs();

  const newStatus = acceptButton ? "approved" : "rejected";
  const updated = clubs.map((club) =>
    club.id === id ? { ...club, status: newStatus } : club
  );
  saveClubs(updated);

  renderClubs();
});

document.addEventListener("DOMContentLoaded", renderClubs);
