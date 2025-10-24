const min = -20;
const max = 120;

const lines = [
  document.getElementById("line1"),
  document.getElementById("line2")
];

const currentPositionDisplay = document.getElementById("currentPosition");
let currentValue = 0;
let startValue = null;

/* Convert number → % position */
function toPercent(value) {
  return ((value - min) / (max - min)) * 100;
}

/* Draw one number line */
function drawLine(container) {
  container.innerHTML = "";

  // baseline
  const baseline = document.createElement("div");
  baseline.className = "absolute left-0 right-0 h-1 bg-black";
  baseline.style.top = "50%";
  baseline.style.transform = "translateY(-50%)";
  container.appendChild(baseline);

  // ticks + labels
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

  // cursor
  const cursor = document.createElement("div");
  cursor.className = "cursor";
  cursor.id = `cursor-${container.id}`;
  container.appendChild(cursor);
}

/* Draw both lines */
function drawAll() {
  lines.forEach(line => drawLine(line));
  updateCursors();
}

/* Update cursors */
function updateCursors() {
  lines.forEach(line => {
    const cursor = line.querySelector(".cursor");
    if (cursor) {
      cursor.style.left = `${toPercent(currentValue)}%`;
    }
  });
  currentPositionDisplay.textContent = `Current number: ${currentValue}`;
}

/* Leave a footprint on each line */
function leaveFootprints() {
  lines.forEach(line => {
    const footprint = document.createElement("div");
    footprint.className = "footprint";
    footprint.style.left = `${toPercent(currentValue)}%`;
    line.appendChild(footprint);
  });
}

/* Mark starting position */
function markStartPosition(value) {
  lines.forEach(line => {
    line.querySelectorAll(".start-label").forEach(l => l.remove());
    const label = document.createElement("div");
    label.className = "start-label";
    label.style.left = `${toPercent(value)}%`;
    label.textContent = `Start: ${value}`;
    line.appendChild(label);
  });
}

/* Move by a given amount (±1 or ±10) */
function moveBy(amount) {
  const step = amount > 0 ? 1 : -1;
  const steps = Math.abs(amount);

  for (let i = 0; i < steps; i++) {
    const next = currentValue + step;
    if (next < min || next > max) break;
    currentValue = next;
    if (startValue !== null && currentValue !== startValue) {
      leaveFootprints();
    }
  }
  updateCursors();
}

/* --- Buttons --- */
document.getElementById("setStartBtn").addEventListener("click", () => {
  const val = parseInt(document.getElementById("startNum").value, 10);
  if (Number.isNaN(val) || val < min || val > max) {
    alert(`Please choose a number between ${min} and ${max}`);
    return;
  }
  lines.forEach(line => {
    line.querySelectorAll(".footprint, .start-label").forEach(f => f.remove());
  });
  startValue = val;
  currentValue = val;
  markStartPosition(val);
  updateCursors();
});

document.getElementById("stepForwardBtn").addEventListener("click", () => moveBy(1));
document.getElementById("stepBackBtn").addEventListener("click", () => moveBy(-1));
document.getElementById("stepForward10Btn").addEventListener("click", () => moveBy(10));
document.getElementById("stepBack10Btn").addEventListener("click", () => moveBy(-10));

document.getElementById("resetBtn").addEventListener("click", () => {
  lines.forEach(line => {
    line.querySelectorAll(".footprint, .start-label").forEach(f => f.remove());
  });
  currentValue = 0;
  startValue = null;
  updateCursors();
});

/* Initialize */
window.addEventListener("load", drawAll);
