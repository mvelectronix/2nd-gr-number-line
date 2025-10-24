const min = 0, max = 100;
const container = document.getElementById("numberLineContainer");
const currentPositionDisplay = document.getElementById("currentPosition");
let containerWidth, stepWidth, currentValue = 0;

// Draw number line (with labels every 5)
function drawNumberLine() {
  container.innerHTML = '<div id="numberLine" class="absolute inset-x-0 top-1/2 h-1 bg-white"></div>';
  containerWidth = container.clientWidth;
  stepWidth = containerWidth / (max - min);

  for (let i = min; i <= max; i++) {
    const x = ((i - min) / (max - min)) * 100;

    // Small ticks every 1, big labels every 5
    const tick = document.createElement("div");
    tick.classList.add("marker");
    tick.style.left = `${x}%`;
    tick.style.height = i % 5 === 0 ? "20px" : "10px";
    tick.style.backgroundColor = i % 10 === 0 ? "#facc15" : "#6b7280";

    if (i % 10 === 0) {
      const label = document.createElement("div");
      label.classList.add("label");
      label.style.left = `${x}%`;
      label.textContent = i;
      container.appendChild(label);
    }

    container.appendChild(tick);
  }

  // Blue marker (cursor)
  const cursor = document.createElement("div");
  cursor.classList.add("cursor");
  cursor.id = "cursor";
  container.appendChild(cursor);
  updateCursor();
}

function updateCursor() {
  const cursor = document.getElementById("cursor");
  if (!cursor) return;
  const x = ((currentValue - min) / (max - min)) * containerWidth;
  cursor.style.left = `${x}px`;
  currentPositionDisplay.textContent = `Current number: ${currentValue}`;
}

function leaveFootprint() {
  const footprint = document.createElement("div");
  footprint.classList.add("footprint");
  const x = ((currentValue - min) / (max - min)) * containerWidth;
  footprint.style.left = `${x}px`;
  container.appendChild(footprint);
}

// Button listeners
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

// Redraw when loaded or resized
window.addEventListener("load", drawNumberLine);
window.addEventListener("resize", drawNumberLine);
