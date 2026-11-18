// Mock submission: saved to its own localStorage key so a future
// "Finance Board" review page could read from it, the same way
// submit_club.js feeds staff.js.
const STORAGE_KEY = "cuseconnect_funding_requests";
const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2MB per file

const form = document.getElementById("fundingForm");
const submitSuccess = document.getElementById("submitSuccess");
const itemFields = document.getElementById("itemFields");
const addItemBtn = document.getElementById("addItemBtn");
const fundingTotal = document.getElementById("fundingTotal");
const filesInput = document.getElementById("fundingFiles");
const fileListEl = document.getElementById("fundingFileList");

// Holds every file the user has picked across however many times they've
// used the file input, as { name, data } with data as a base64 data URL.
let selectedFiles = [];

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function calculateTotal() {
  const amounts = itemFields.querySelectorAll(".item-amount");
  let total = 0;
  amounts.forEach((input) => {
    const value = parseFloat(input.value);
    if (!Number.isNaN(value)) total += value;
  });
  fundingTotal.textContent = formatCurrency(total);
  return total;
}

function itemRowCount() {
  return itemFields.querySelectorAll(".item-row").length;
}

function addItemRow() {
  const row = document.createElement("div");
  row.className = "item-row";

  const descInput = document.createElement("input");
  descInput.type = "text";
  descInput.className = "item-description";
  descInput.placeholder = "e.g. Catering for 50 guests";
  row.appendChild(descInput);

  const dollarSign = document.createElement("span");
  dollarSign.className = "item-dollar";
  dollarSign.textContent = "$";
  row.appendChild(dollarSign);

  const amountInput = document.createElement("input");
  amountInput.type = "number";
  amountInput.className = "item-amount";
  amountInput.min = "0";
  amountInput.step = "0.01";
  amountInput.placeholder = "0.00";
  amountInput.addEventListener("input", calculateTotal);
  row.appendChild(amountInput);

  // Only rows beyond the first can be removed — at least one item is required.
  if (itemRowCount() >= 1) {
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-item-btn";
    removeBtn.setAttribute("aria-label", "Remove this item");
    removeBtn.textContent = "×"; // ×
    removeBtn.addEventListener("click", () => {
      row.remove();
      calculateTotal();
    });
    row.appendChild(removeBtn);
  }

  itemFields.appendChild(row);
}

addItemBtn.addEventListener("click", addItemRow);
itemFields
  .querySelector(".item-amount")
  .addEventListener("input", calculateTotal);

function renderFileList() {
  fileListEl.innerHTML = "";
  selectedFiles.forEach((file) => {
    const chip = document.createElement("div");
    chip.className = "file-chip";
    chip.textContent = `📎 ${file.name}`;
    fileListEl.appendChild(chip);
  });
}

filesInput.addEventListener("change", () => {
  const files = Array.from(filesInput.files || []);
  let pending = files.length;
  if (pending === 0) return;

  files.forEach((file) => {
    if (file.size > MAX_FILE_BYTES) {
      alert(`"${file.name}" is larger than 2MB and wasn't added. Please choose a smaller file.`);
      pending -= 1;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      selectedFiles.push({ name: file.name, data: reader.result });
      renderFileList();
    };
    reader.readAsDataURL(file);
  });

  // Clear the input so the same filename can be re-selected later if needed,
  // and so each "change" event only ever contains newly-picked files.
  filesInput.value = "";
});

function loadRequests() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(stored)) return stored;
  } catch (err) {
    // ignore and start fresh
  }
  return [];
}

function saveRequests(requests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitSuccess.hidden = true;

  const club = document.getElementById("fundingClub").value.trim();
  const requester = document.getElementById("fundingRequester").value.trim();
  const email = document.getElementById("fundingEmail").value.trim();
  const eventName = document.getElementById("fundingEvent").value.trim();
  const purpose = document.getElementById("fundingPurpose").value;
  const sourceInput = form.querySelector('input[name="fundingSource"]:checked');
  const fundingSource = sourceInput ? sourceInput.value : "";
  const neededBy = document.getElementById("fundingDate").value;

  const itemRows = Array.from(itemFields.querySelectorAll(".item-row"));
  const items = itemRows
    .map((row) => ({
      description: row.querySelector(".item-description").value.trim(),
      amount: parseFloat(row.querySelector(".item-amount").value),
    }))
    .filter((item) => item.description.length > 0 || !Number.isNaN(item.amount));

  const links = document
    .getElementById("fundingLinks")
    .value.split("\n")
    .map((link) => link.trim())
    .filter((link) => link.length > 0);

  if (!club || !requester || !email || !eventName || !purpose || !fundingSource || !neededBy) {
    alert("Please fill in all required fields.");
    return;
  }

  if (!email.toLowerCase().endsWith("@syr.edu")) {
    alert("Please use your SYR email address.");
    return;
  }

  const incompleteItem = items.find(
    (item) => !item.description || Number.isNaN(item.amount)
  );
  if (items.length === 0 || incompleteItem) {
    alert("Please give every item both a description and an amount.");
    return;
  }

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  const requests = loadRequests();
  requests.push({
    id: "funding-" + Date.now(),
    club,
    requester,
    email,
    eventName,
    purpose,
    fundingSource,
    neededBy,
    items,
    total,
    links,
    files: selectedFiles,
    status: "pending",
  });

  try {
    saveRequests(requests);
  } catch (err) {
    alert("Couldn't save — the attached files may be too large for browser storage. Try smaller or fewer files.");
    return;
  }

  form.reset();
  selectedFiles = [];
  renderFileList();

  // Reset item rows back to a single empty, required row.
  itemFields.innerHTML = `
    <div class="item-row">
      <input type="text" class="item-description" placeholder="e.g. Catering for 50 guests" required>
      <span class="item-dollar">$</span>
      <input type="number" class="item-amount" min="0" step="0.01" placeholder="0.00" required>
    </div>
  `;
  itemFields.querySelector(".item-amount").addEventListener("input", calculateTotal);
  calculateTotal();

  submitSuccess.hidden = false;
});
