const min = 0, max = 100;
const container = document.getElementById("numberLineContainer");
const currentPositionDisplay = document.getElementById("currentPosition");
let currentValue = 0;

// Convert a number (0–100) into a % position on the line
function toPercent(value) {
  return ((value - min) / (max - min)) * 100;
}

// Draw number line with consistent percent-based positions
function drawNumberLine() {
  container.innerHTML = '<div id="numberLine" class="absolute inset-x-0 top-1/2 h-1 bg-white"></div>';

  for (let i = min; i <= max; i++) {
    const x = toPercent(i);

    // Create tick
    const tick = document.createElement("div");
    tick.classList.add("marker");
    tick.style.left = `${x}%`;
    tick.style.height = i % 10 === 0 ? "20px" : "10px";
    tick.style.backgroundColor = i % 10 === 0 ? "#facc15" : "#6b7280";
    container.appendChild(tick);

    // Label every 10
    if (i % 10 === 0) {
      const label = document.createElement("div");
      label.classList.add("label");
      label.style.left = `${x}%`;
      label.textContent = i;
      container.appendChild(label);
    }
  }

  // Cursor
  const cursor = document.createElement("div");
  cursor.classList.add("cursor");
  cursor.id = "cursor";
  container.appendChild(cursor);
  updateCursor();
}

function updateCursor() {
  const cursor = document.getElementById("cursor");
  if (!cursor) return;
  const x = toPercent(currentValue);
  cursor.style.left = `${x}%`;
  currentPositionDisplay.textContent = `Current number: ${currentValue}`;
}

function leaveFootprint() {
  const footprint = document.createElement("div");
  footprint.classList.add("footprint");
  footprint.style.left = `${toPercent(currentValue)}%`;
  container.appendChild(footprint);
}

// Controls
document.getElementById("setStartBtn").addEventListener("click", () => {
  const val = parseInt(document.getElementById("startNum").value);
  if (isNaN(val) || val < min || val > max) {
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

window.addEventListener("load", drawNumberLine);
window.addEventListener("resize", drawNumberLine);
