const min = 0, max = 100;
const container = document.getElementById("numberLineContainer");
const currentPositionDisplay = document.getElementById("currentPosition");
let currentValue = 0;

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
    label.textContent = i.toString();
    container.appendChild(label);
  }

  const cursor = document.createElement("div");
  cursor.id = "cursor";
  cursor.className = "cursor";
  container.appendChild(cursor);

  updateCursor();
}

/* Update cursor position and text */
function updateCursor() {
  const cursor = document.getElementById("cursor");
  if (!cursor) return;
  cursor.style.left = `${toPercent(currentValue)}%`;
  currentPositionDisplay.textContent = `Current number: ${currentValue}`;
}

/* Add a footprint (green dot) */
function leaveFootprint() {
  const footprint = document.createElement("div");
  footprint.className = "footprint";
  footprint.style.left = `${toPercent(currentValue)}%`;
  container.appendChild(footprint);
}

/* Add a permanent red label for starting position */
function markStartPosition(value) {
  // Remove any existing start label
  container.querySelectorAll(".start-label").forEach(l => l.remove());
  const label = document.createElement("div");
  label.className = "start-label";
  label.style.left = `${toPercent(value)}%`;
  label.textContent = `Start: ${value}`;
  container.appendChild(label);
}

/* Button actions */
document.getElementById("setStartBtn").addEventListener("click", () => {
  const val = parseInt(document.getElementById("startNum").value, 10);
  if (Number.isNaN(val) || val < min || val > max) {
    alert(`Please choose a number between ${min} and ${max}`);
    return;
  }
  // Clear footprints and mark start
  container.querySelectorAll(".footprint").forEach(f => f.remove());
  markStartPosition(val);
  currentValue = val;
  updateCursor();
});

document.getElementById("stepForwardBtn").addEventListener("click", () => {
  if (currentValue < max) {
    currentValue += 1;
    leaveFootprint(); // leave dot *after* move
    updateCursor();
  }
});

document.getElementById("stepBackBtn").addEventListener("click", () => {
  if (currentValue > min) {
    currentValue -= 1;
    leaveFootprint(); // leave dot *after* move
    updateCursor();
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  container.querySelectorAll(".footprint, .start-label").forEach(f => f.remove());
  currentValue = 0;
  updateCursor();
});

window.addEventListener("load", drawNumberLine);
window.addEventListener("resize", drawNumberLine);
