const min = -10, max = 10;
const container = document.getElementById("numberLineContainer");
const containerWidth = container.clientWidth;
const stepWidth = containerWidth / (max - min);
const currentPositionDisplay = document.getElementById("currentPosition");

// Draw number line
for (let i = min; i <= max; i++) {
  const x = ((i - min) / (max - min)) * 100;
  const tick = document.createElement("div");
  tick.classList.add("marker");
  tick.style.left = `${x}%`;

  const label = document.createElement("div");
  label.classList.add("label");
  label.style.left = `${x}%`;
  label.textContent = i;

  container.appendChild(tick);
  container.appendChild(label);
}

// Add cursor (movable marker)
const cursor = document.createElement("div");
cursor.classList.add("cursor");
container.appendChild(cursor);

let currentValue = 0;

function updateCursor() {
  const x = ((currentValue - min) / (max - min)) * containerWidth;
  cursor.style.left = `${x}px`;
  currentPositionDisplay.textContent = `Current number: ${currentValue}`;
}

// Create footprint
function leaveFootprint() {
  const footprint = document.createElement("div");
  footprint.classList.add("footprint");
  const x = ((currentValue - min) / (max - min)) * containerWidth;
  footprint.style.left = `${x}px`;
  container.appendChild(footprint);
}

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

updateCursor(); // Initialize
