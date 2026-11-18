// Same storage key events.js reads from, so a posted event shows up on
// the Events calendar right away.
const STORAGE_KEY = "cuseconnect_events";

const form = document.getElementById("createEventForm");
const submitSuccess = document.getElementById("submitSuccess");

function loadEvents() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(stored)) return stored;
  } catch (err) {
    // ignore and start fresh
  }
  return [];
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function formatTime(value) {
  if (!value) return "";
  const [hoursStr, minutesStr] = value.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = ((hours + 11) % 12) + 1;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitSuccess.hidden = true;

  const name = document.getElementById("eventName").value.trim();
  const org = document.getElementById("eventOrg").value.trim();
  const date = document.getElementById("eventDate").value; // "YYYY-MM-DD"
  const time = document.getElementById("eventTime").value; // "HH:MM" (24h)
  const category = document.getElementById("eventCategory").value;
  const description = document.getElementById("eventDescription").value.trim();

  const location = document.getElementById("eventLocation").value.trim();

  if (!name || !org || !date || !time || !location) {
    alert("Please fill in all required fields.");
    return;
  }

  const events = loadEvents();
  events.push({
    id: "event-" + Date.now(),
    title: name,
    org,
    date,
    timeLabel: formatTime(time),
    location,
    category,
    description,
  });

  try {
    saveEvents(events);
  } catch (err) {
    alert("Couldn't save your event — please try again.");
    return;
  }

  form.reset();
  submitSuccess.hidden = false;
});
