const min = -20, max = 120; // extended range
const container = document.getElementById("numberLineContainer");
const currentPositionDisplay = document.getElementById("currentPosition");
let currentValue = 0;
let startValue = null;

function toPercent(value) {
  return ((value - min) / (max - min)) * 100;
}

/* Draw number line */
function drawNumberLine() {
  const line = document.createElement("div");
  line.id = "numberLine";
  line.className = "absolute left-0 right-0 h-1 bg-black";
  line.style.top = "50%";
  line.style.transform = "translateY(-50%)";
  container.appendChild(line);

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

/* Controls */
document.getElementById("setStartBtn").addEventListener("click", () => {
  const val = parseInt(document.getElementById("startNum").value, 10);
  if (Number.isNaN(val) || val < min || val > max) {
    alert(`Please choose a number between ${min} and ${max}`);
    return;
  }

  container.querySelectorAll(".footprint, .start-label").forEach(el => el.remove());
  startValue = val;
  currentValue = val;
  markStartPosition(val);
  updateCursor();
});

/* Step by 1s */
document.getElementById("stepForwardBtn").addEventListener("click", () => moveBy(1));
document.getElementById("stepBackBtn").addEventListener("click", () => moveBy(-1));

/* Step by 10s */
document.getElementById("stepForward10Btn").addEventListener("click", () => moveBy(10));
document.getElementById("stepBack10Btn").addEventListener("click", () => moveBy(-10));

function moveBy(amount) {
  let newValue = currentValue + amount;
  if (newValue < min) newValue = min;
  if (newValue > max) newValue = max;

  currentValue = newValue;
  if (startValue !== null && currentValue !== startValue) leaveFootprint();
  updateCursor();
}

/* Reset */
document.getElementById("resetBtn").addEventListener("click", () => {
  container.querySelectorAll(".footprint, .start-label").forEach(el => el.remove());
  currentValue = 0;
  startValue = null;
  updateCursor();
});

window.addEventListener("load", () => {
  drawNumberLine();
  updateCursor();
});
