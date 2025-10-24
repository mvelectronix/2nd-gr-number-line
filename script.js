const min = 0, max = 100;
const container = document.getElementById("numberLineContainer");
const currentPositionDisplay = document.getElementById("currentPosition");
let currentValue = 0;
let startValue = null;

/* Convert a number (0–100) into a % position */
function toPercent(value) {
  return ((value - min) / (max - min)) * 100;
}

/* Draw number line */
function drawNumberLine() {
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

/* Update cursor */
function updateCursor() {
  const cursor = document.getElementById("cursor");
  if (!cursor) return;
  cursor.style.left = `${toPercent(currentValue)}%`;
  currentPositionDisplay.textContent = `Current number: ${currentValue}`;
}

/* Leave a green footprint */
function leaveFootprint() {
  const footprint = document.createElement("div");
  footprint.className = "footprint";
  footprint.style.left = `${toPercent(currentValue)}%`;
  container.appendChild(footprint);
}

/* Mark the starting position */
function markStartPosition(value) {
  // Remove any existing start label
  container.querySelectorAll(".start-label").forEach(l => l.remove());
  // Add start label
  const label = document.createElement("div");
  label.className =
