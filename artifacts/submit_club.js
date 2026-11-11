// Same storage key staff.js reads from, so a submitted club shows up
// there as "pending" right away.
const STORAGE_KEY = "cuseconnect_clubs";

const form = document.getElementById("submitClubForm");
const leadershipFields = document.getElementById("leadershipFields");
const addLeaderBtn = document.getElementById("addLeaderBtn");
const submitSuccess = document.getElementById("submitSuccess");
const constitutionInput = document.getElementById("clubConstitution");
const constitutionFileName = document.getElementById("constitutionFileName");

const MIN_LEADERS = 3;
const MAX_CONSTITUTION_BYTES = 2 * 1024 * 1024; // 2MB

// Holds the currently-selected constitution file as a base64 data URL,
// read as soon as it's chosen so submit doesn't need to wait on it.
let constitutionData = null;
let constitutionName = "";

constitutionInput.addEventListener("change", () => {
  const file = constitutionInput.files[0];
  constitutionData = null;
  constitutionName = "";
  constitutionFileName.textContent = "";

  if (!file) return;

  if (file.size > MAX_CONSTITUTION_BYTES) {
    alert("That file is larger than 2MB. Please choose a smaller file.");
    constitutionInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    constitutionData = reader.result;
    constitutionName = file.name;
    constitutionFileName.textContent = `Selected: ${file.name}`;
  };
  reader.readAsDataURL(file);
});

function leaderRowCount() {
  return leadershipFields.querySelectorAll(".leader-row").length;
}

function addLeaderRow() {
  const row = document.createElement("div");
  row.className = "leader-row";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "leader-input";
  nameInput.placeholder = `Leader ${leaderRowCount() + 1} name`;
  row.appendChild(nameInput);

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.className = "leader-email";
  emailInput.placeholder = "abc123@syr.edu";
  row.appendChild(emailInput);

  // Rows beyond the first 3 (required) can be removed individually.
  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-leader-btn";
  removeBtn.setAttribute("aria-label", "Remove this leader");
  removeBtn.textContent = "\u00D7"; // ×
  removeBtn.addEventListener("click", () => {
    row.remove();
  });
  row.appendChild(removeBtn);

  leadershipFields.appendChild(row);
}

addLeaderBtn.addEventListener("click", addLeaderRow);

function loadClubs() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(stored)) return stored;
  } catch (err) {
    // ignore and start fresh
  }
  return [];
}

function saveClubs(clubs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clubs));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitSuccess.hidden = true;

  const name = document.getElementById("clubName").value.trim();
  const mission = document.getElementById("clubMission").value.trim();
  const advisor = document.getElementById("clubAdvisor").value.trim();
  const email = document.getElementById("clubEmail").value.trim();
  const category = document.getElementById("clubCategory").value;
  const meeting = document.getElementById("clubMeeting").value.trim();
  const social = document.getElementById("clubSocial").value.trim();

  // Pair up each leader's name with their SYR email, keeping only rows
  // where at least one of the two was filled in (so a fully-empty extra
  // row added via "+ Add another leader" and left blank doesn't count).
  const leaderRows = Array.from(leadershipFields.querySelectorAll(".leader-row"));
  const leaders = leaderRows
    .map((row) => ({
      name: row.querySelector(".leader-input").value.trim(),
      email: row.querySelector(".leader-email").value.trim(),
    }))
    .filter((leader) => leader.name.length > 0 || leader.email.length > 0);

  if (!name || !mission || !advisor || !email) {
    alert("Please fill in all required fields.");
    return;
  }

  const incompleteLeader = leaders.find((leader) => !leader.name || !leader.email);
  if (incompleteLeader) {
    alert("Please enter both a name and a SYR email for every club leader listed.");
    return;
  }

  const nonSyrEmail = leaders.find(
    (leader) => !leader.email.toLowerCase().endsWith("@syr.edu")
  );
  if (nonSyrEmail) {
    alert(`"${nonSyrEmail.email}" doesn't look like a syr.edu email. Please use each leader's SYR email address.`);
    return;
  }

  if (leaders.length < MIN_LEADERS) {
    alert(`Please list at least ${MIN_LEADERS} club leaders, each with their SYR email.`);
    return;
  }

  if (!constitutionData) {
    alert("Please attach a club constitution before submitting.");
    return;
  }

  const clubs = loadClubs();
  clubs.push({
    id: "club-" + Date.now(),
    name,
    description: mission,
    leadership: leaders,
    advisor,
    email,
    category,
    meeting,
    social,
    constitutionName,
    constitutionData,
    status: "pending",
  });

  try {
    saveClubs(clubs);
  } catch (err) {
    alert("Couldn't save — the attached file may be too large for browser storage. Try a smaller file.");
    return;
  }

  form.reset();
  constitutionData = null;
  constitutionName = "";
  constitutionFileName.textContent = "";

  // Reset leadership rows back to the original 3 empty, required rows.
  leadershipFields.innerHTML = `
    <div class="leader-row">
      <input type="text" class="leader-input" placeholder="Leader 1 name" required>
      <input type="email" class="leader-email" placeholder="abc123@syr.edu" required>
    </div>
    <div class="leader-row">
      <input type="text" class="leader-input" placeholder="Leader 2 name" required>
      <input type="email" class="leader-email" placeholder="abc123@syr.edu" required>
    </div>
    <div class="leader-row">
      <input type="text" class="leader-input" placeholder="Leader 3 name" required>
      <input type="email" class="leader-email" placeholder="abc123@syr.edu" required>
    </div>
  `;

  submitSuccess.hidden = false;
});
