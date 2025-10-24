const min = -20, max = 120;
const lines = [document.getElementById("topLine"), document.getElementById("bottomLine")];
const currentPositionDisplay = document.getElementById("currentPosition");
let currentValue = 0;
let startValue = null;

/* Convert number → % position */
function toPercent(value) {
  return ((value - min) / (max - min)) * 100;
}

/* Draw each number line */
function drawLines() {
  lines.forEach(line => {
    line.innerHTML = ''; // clear it before drawing

    // baseline
    const baseline = document.createElement("div");
    baseline.className = "absolute left-0 right-0 h-1 bg-black";
    baseline.style.top = "50%";
    baseline.style.transform = "translateY(-50%)";
    line.appendChild(baseline);

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
      line.appendChild(tick);

      const label = document.createElement("div");
      label.className = "label";
      label.style.left = `${x}%`;
      label.textContent = i;
      line.appendChild(label);
    }

    // cursor
    const cursor = document.createElement("div");
    cursor.className = "cursor";
    cursor.id = "cursor-" + line.id;
    line.appendChild(cursor);
  });

  updateCursors();
}

/* Update all cursors */
function updateCursors() {
  lines.forEach(line => {
    const cursor = line.querySelector(".cursor");
    if (!cursor) return;
    cursor.style.left = `${toPercent(currentValue)}%`;
  });
  currentPositionDisplay.textContent = `Current number: ${currentValue}`;
}

/* Leave green footprints on both lines */
function leaveFootprints() {
  lines.forEach(line => {
    const footprint = document.createElement("div");
    footprint.className = "footprint";
    footprint.style.left = `${toPercent(currentValue)}%`;
    line.appendChild(footprint);
  });
}

/* Mark red Start label */
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

/* Move step-by-step */
function moveBy(amount) {
  const step = amount > 0 ? 1 : -1;
  const steps = Math.abs(amount);

  for (let i = 0; i < steps; i++) {
    const next = currentValue + step;
    if (next < min || next > max) break;
    currentValue = next;
    if (startValue !== null && currentValue !== startValue) leaveFootprints();
  }
  updateCursors();
}

/* Controls */
document.getElementById("setStartBtn").addEventListener("click", () => {
  const val = parseInt(document.getElementById("startNum").value, 10);
  if (Number.isNaN(val) || val < min || val > max) {
    alert(`Please choose a number between ${min} and ${max}`);
    return;
  }

  lines.forEach(line => line.querySelectorAll(".footprint, .start-label").forEach(f => f.remove()));
  startValue = val;
  currentValue = val;
  markStartPosition(val);
  updateCursors();
});

document.getElementById("stepForwardBtn"
