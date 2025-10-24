const min = 0, max = 100;
const container = document.getElementById("numberLineContainer");
const currentPositionDisplay = document.getElementById("currentPosition");
let currentValue = 0;

/* Convert a number (0–100) into a % position on the line */
function toPercent(value) {
  return ((value - min) / (max - min)) * 100;
}

/* Draw number line, ticks every 1, labels every 1 (0–100) */
function drawNumberLine() {
  // Reset content and re-insert baseline
  container.innerHTML = '<div id="numberLine" class="absolute left-0 right-0 h-1 bg-black"></div>';

  // Ticks + labels
  for (let i = min; i <= max; i++) {
    const x = toPercent(i);

    // Tick
    const tick = document.createElement("div");
    tick.className = "marker";
    tick.style.left = `${x}%`;
    // Make every 10th tick slightly thicker/taller to anchor the eye
    if (i % 10 === 0) {
      tick.style.height = "34px";
      tick.style.top = "calc(50% - 17px)";
      tick.style.width = "3px";
    }
    container.appendChild(tick);

    // Label every 1 (requested)
    const label = document.createElement("div");
    label.className = "label";
    label.style.left = `${x}%`;
    label.textContent = i.toString();
    container.appendChild(label);
  }

  // Cursor
  const cursor = document.createElement("div");
  cursor.id = "cursor";
  cursor.className = "cursor";
  container.appendChild(cursor);

  updateCursor();
}

/* Update the blue cursor position and the readout */
function updateCursor() {
  const cursor = document.getElementById("cursor");
  if (!cursor) return;
  cursor.style.left = `${toPercent(currentValue)}%`;
  currentPositionDisplay.textContent = `Current number: ${currentValue}`;
}

/* Leave a green dot at current position */
function leaveFootprint() {
  const footprint = document.createElement("div");
  footprint.className = "footprint";
  footprint.style.left = `${toPercent(currentValue)}%`;
  container.appendChild(footprint);
}

/* Controls */
document.getElementById("setStartBtn").addEventListener("click", () => {
  const val = parseInt(document.getElementById("startNum").value, 10);
  if (Number.isNaN(val) || val < min || val > max) {
    alert(`Please choose a number between ${min} and ${max}`);
    return;
  }
  currentValue = val;
  updateCursor();
});
document.getElementById("stepForwardBtn").addEventListener("click", () => {
  if (currentValue < max) {
    leaveFootprint();
    currentValue += 1;
    updateCursor();
  }
});
document.getElementById("stepBackBtn").addEventListener("click", () => {
  if (currentValue > min) {
    leaveFootprint();
    currentValue -= 1;
    updateCursor();
  }
});
document.getElementById("resetBtn").addEventListener("click", () => {
  container.querySelectorAll(".footprint").forEach(f => f.remove());
  currentValue = 0;
  updateCursor();
});

/* Draw/Redraw */
window.addEventListener("load", drawNumberLine);
window.addEventListener("resize", drawNumberLine);
