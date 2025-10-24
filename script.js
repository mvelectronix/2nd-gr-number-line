// Define two independent ranges
const ranges = [
  { min: 0, max: 50, container: document.getElementById("line1") },
  { min: 51, max: 100, container: document.getElementById("line2") }
];

const currentPositionDisplay = document.getElementById("currentPosition");
let currentValue = 0;
let startValue = null;

/* Convert a value to % position for that specific range */
function toPercent(value, range) {
  return ((value - range.min) / (range.max - range.min)) * 100;
}

/* Draw one number line for its range */
function drawLine(range) {
  const { container, min, max } = range;
  container.innerHTML = "";

  // baseline
  const baseline = document.createElement("div");
  baseline.className = "absolute left-0 right-0 h-1 bg-black";
  baseline.style.top = "50%";
  baseline.style.transform = "translateY(-50%)";
  container.appendChild(baseline);

  // ticks + labels
  for (let i = min; i <= max; i++) {
    const x = toPercent(i, range);

    const tick = document.createElement("div");
    tick.className = "marker";
    tick.style.left = `${x}%`;
    if (i % 5 === 0) {
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
  ranges.forEach(drawLine);
  updateCursors();
}

/* Update all cursors based on current value */
function updateCursors() {
  ranges.forEach(range => {
    const cursor = range.container.querySelector(".cursor");

    // Only show cursor if the value falls within this line’s range
    if (currentValue >= range.min && currentValue <= range.max) {
      cursor.style.display = "block";
      cursor.style.left = `${toPercent(currentValue, range)}%`;
    } else {
      cursor.style.display = "none";
    }
  });

  currentPositionDisplay.textContent = `Current number: ${currentValue}`;
}

/* Drop footprints if within visible line */
function leaveFootprints() {
  ranges.forEach(range => {
    if (currentValue >= range.min && currentValue <= range.max) {
      const footprint = document.createElement("div");
      footprint.className = "footprint";
      footprint.style.left = `${toPercent(currentValue, range)}%`;
      range.container.appendChild(footprint);
    }
  });
}

/* Mark start label on appropriate line */
function markStartPosition(value) {
  ranges.forEach(range => {
    range.container.querySelectorAll(".start-label").forEach(l => l.remove());
    if (value >= range.min && value <= range.max) {
      const label = document.createElement("div");
      label.className = "start-label";
      label.style.left = `${toPercent(value, range)}%`;
      label.textContent = `Start: ${value}`;
      range.container.appendChild(label);
    }
  });
}

/* Move step-by-step */
function moveBy(amount) {
  const step = amount > 0 ? 1 : -1;
  const steps = Math.abs(amount);

  for (let i = 0; i < steps; i++) {
    let next = currentValue + step;
    if (next < ranges[0].min) next = ranges[0].min;
    if (next > ranges[1].max) next = ranges[1].max;
    currentValue = next;
    if (startValue !== null && currentValue !== startValue) {
      leaveFootprints();
    }
  }
  updateCursors();
}

/* Controls */
document.getElementById("setStartBtn").addEventListener("click", () => {
  const val = parseInt(document.getElementById("startNum").value, 10);
  const overallMin = ranges[0].min;
  const overallMax = ranges[ranges.length - 1].max;

  if (Number.isNaN(val) || val < overallMin || val > overallMax) {
    alert(`Please choose a number between ${overallMin} and ${overallMax}`);
    return;
  }

  ranges.forEach(r =>
    r.container.querySelectorAll(".footprint, .start-label").forEach(f => f.remove())
  );
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
  ranges.forEach(r =>
    r.container.querySelectorAll(".footprint, .start-label").forEach(f => f.remove())
  );
  currentValue = 0;
  startValue = null;
  updateCursors();
});

/* Initialize */
window.addEventListener("load", drawAll);
