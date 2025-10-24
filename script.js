const min = -20, max = 120;
const container = document.getElementById("numberLineContainer");
const currentPositionDisplay = document.getElementById("currentPosition");
let currentValue = 0;
let startValue = null;

function toPercent(value) {
  return ((value - min) / (max - min)) * 100;
}

/* Draw number line once and keep it visible */
function drawNumberLine() {
  // Always start clean ONCE on load
  container.innerHTML = '<div id="numberLine" class="absolute left-0 right-0 h-1 bg-black"></div>';

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
    label.textContent = i;
    container.appendChild(label);
  }

  const cursor = document.createElement("div");
  cursor.id = "cursor";
  cursor.className = "cursor";
  container.appendChild(cursor);

  updateCursor();
}

function updateCursor() {
  const cursor = document.getElementById("cursor");
  if (!cursor) return;
  cursor.style.left = `${toPercent(currentValue)}%`;
  currentPositionDisplay.textContent = `Current number: ${currentValue}`;
}

function leaveFootprint() {
  const footprint = document.createElement("div");
  footprint.className = "footprint";
  footprint.style.left = `${toPercent(currentValue)}%`;
  container.appendChild(footprint);
}

function markStartPosition(value) {
  container.querySelectorAll(".start-label").forEach(l => l.remove());
  const label = document.createElement("div");
  label.className = "start-label";
  label.style.left = `${toPercent(value)}%`;
  label.textContent = `Start: ${value}`;
  container.appendChild(label);
}

/* Move by any amount (+1, -1, +10, -10) */
function moveBy(amount) {
  // Work one step at a time so footprints appear for each unit
  const step = amount > 0 ? 1 : -1;
  const steps = Math.abs(amount);

  for (let i = 0; i < steps; i++) {
    let newValue = currentValue + step;
    if (newValue < min || newValue > max) break; // stop at edges
    currentValue = newValue;
    if (startValue !== null && currentValue !== startValue) {
      leaveFootprint();     // drop a dot for every unit crossed
    }
  }
  updateCursor();
}


/* Button Events */
document.getElementById("setStartBtn").addEventListener("click", () => {
  const val = parseInt(document.getElementById("startNum").value, 10);
  if (Number.isNaN(val) || val < min || val > max) {
    alert(`Please choose a number between ${min} and ${max}`);
    return;
  }
  container.querySelectorAll(".footprint, .start-label").forEach(f => f.remove());
  startValue = val;
  currentValue = val;
  markStartPosition(val);
  updateCursor();
});
document.getElementById("stepForwardBtn").addEventListener("click", () => moveBy(1));
document.getElementById("stepBackBtn").addEventListener("click", () => moveBy(-1));
document.getElementById("stepForward10Btn").addEventListener("click", () => moveBy(10));
document.getElementById("stepBack10Btn").addEventListener("click", () => moveBy(-10));
document.getElementById("resetBtn").addEventListener("click", () => {
  container.querySelectorAll(".footprint, .start-label").forEach(f => f.remove());
  currentValue = 0;
  startValue = null;
  updateCursor();
});

/* Initialize */
window.addEventListener("load", drawNumberLine);

