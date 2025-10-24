const min = 0, max = 100;
const container = document.getElementById("numberLineContainer");
const currentPositionDisplay = document.getElementById("currentPosition");
let currentValue = 0;
let startValue = null;

/* Convert a number (0–100) into % position */
function toPercent(value) {
  return ((value - min) / (max - min)) * 100;
}

/* Draw number line ONCE — we don’t rebuild it later */
function drawNumberLine() {
  // Baseline
  const line = document.createElement("div");
  line.id = "numberLine";
  line.className = "absolute left-0 right-0 h-1 bg-black";
  line.style.top = "50%";
  line.style.transform = "translateY(-50%)";
  container.appendChild(line);

  // Ticks and labels
  for (let i = min; i <= max; i++) {
    const x = toPercent(i);

    const tick = document.createElement("div");
    tick.className = "marker";
    tick.style.left = `${x}%`;
    if (i % 10 === 0) {
      tick.style.height = "34px";
      tick.style.top = "calc(50% - 17px)";
      tick.style.width = "3px";
    }
    container.appendChild(tick);

    const label = document.createElement("div");
    label.className = "label";
    label.style.left = `${x}%`;
    label.textContent = i.toString();
    container.appendChild(label);
  }

  // Blue cursor
  const cursor = document.createElement("div");
  cursor.id = "cursor";
  cursor.className = "cursor";
  container.appendChild(cursor);

  updateCursor();
}

/* Update cursor and status text */
function updateCursor() {
  const cursor = document.getElementById("cursor");
  if (!cursor) return;
  cursor.style.left = `${toPercent(currentValue)}%`;
  currentPositionDisplay.textContent = `Current number: ${currentValue}`;
}

/* Leave a footprint for actual moves */
function leaveFootprint() {
  const footprint = document.createElement("div");
  footprint.className = "footprint";
  footprint.style.left = `${toPercent(currentValue)}%`;
  container.appendChild(footprint);
}

/* Mark the start number with a red label */
function markStartPosition(value) {
  // Remove any existing label first
  const existing = container.querySelector(".start-label");
  if (existing) existing.remove();

  const label = document.createElement("div");
  label.className = "start-label";
  label.style.left = `${toPercent(value)}%`;
  label.textContent = `Start: ${value}`;
  container.appendChild(label);
}

/* ===== Buttons ===== */

document.getElementById("setStartBtn").addEventListener("click", () => {
  const val = parseInt(document.getElementById("startNum").value, 10);
  if (Number.isNaN(val) || val < min || val > max) {
    alert(`Please choose a number between ${min} and ${max}`);
    return;
  }

  // Remove old footprints and start labels only
  container.querySelectorAll(".footprint, .start-label").forEach(el => el.remove());

  // Set and label the new start
  startValue = val;
  currentValue = val;
  markStartPosition(val);
  updateCursor();
});

document.getElementById("stepForwardBtn").addEventListener("click", () => {
  if (currentValue < max) {
    currentValue += 1;
    // Drop footprints ONLY after the first move
    if (startValue !== null && currentValue !== startValue) leaveFootprint();
    updateCursor();
  }
});

document.getElementById("stepBackBtn").addEventListener("click", () => {
  if (currentValue > min) {
    currentValue -= 1;
    if (startValue !== null && currentValue !== startValue) leaveFootprint();
    updateCursor();
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  container.querySelectorAll(".footprint, .start-label").forEach(el => el.remove());
  currentValue = 0;
  startValue = null;
  updateCursor();
});

/* ===== Initialize ===== */
window.addEventListener("load", () => {
  drawNumberLine(
