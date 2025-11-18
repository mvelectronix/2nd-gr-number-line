// Kid-friendly number line controls and visuals
// Enhanced for "Number Line Playground" with footprints, pop cursor, confetti, and keyboard shortcuts.

// Define two independent ranges
const ranges = [
  { min: 0, max: 50, container: document.getElementById("line1") },
  { min: 51, max: 100, container: document.getElementById("line2") }
];

// UI displays (kidNum is primary; fallback to currentPosition if needed)
const kidNumDisplay = document.getElementById("kidNum");
const currentPositionDisplay = document.getElementById("currentPosition");
let currentValue = 0;
let startValue = null;

/* % position with padding to avoid edge cutoff */
function toPercent(value, range) {
  const padding = 3; // percent padding on each side
  const usable = 100 - padding * 2;
  // Guard against division by zero if range sizes are invalid
  const span = Math.max(range.max - range.min, 1);
  return ((value - range.min) / span) * usable + padding;
}

/* Draw one number line for its range */
function drawLine(range) {
  const { container, min, max } = range;
  if (!container) return;
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
      tick.style.width = "3px";
      tick.style.top = "calc(50% - 17px)";
    } else {
      tick.style.height = "18px";
      // small ticks are centered on baseline (CSS default)
    }
    container.appendChild(tick);

    const label = document.createElement("div");
    label.className = "label";
    label.style.left = `${x}%`;
    label.textContent = i.toString();
    container.appendChild(label);
  }

  // cursor (hidden until a number in this range is active)
  const cursor = document.createElement("div");
  cursor.className = "cursor";
  cursor.id = `cursor-${container.id}`;
  container.appendChild(cursor);
}

/* Draw both lines */
function drawAll() {
  ranges.forEach(drawLine);
  updateCursors(false); // no pop on initial draw
}

/* Create a tiny burst of confetti for celebration */
function confettiBurst(x, y, parent = document.body) {
  const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#B388EB"];
  for (let i = 0; i < 12; i++) {
    const c = document.createElement("div");
    c.className = "confetti-piece";
    c.style.left = `${x}px`;
    c.style.top = `${y}px`;
    c.style.background = colors[i % colors.length];
    // give each confetti piece a random horizontal spread
    c.style.transform = `translateX(${(Math.random() - 0.5) * 140}px) rotate(${Math.random() * 360}deg)`;
    parent.appendChild(c);
    // remove after animation completes
    setTimeout(() => c.remove(), 1100);
  }
}

/* Update all cursors based on current value */
function updateCursors(pop = true) {
  ranges.forEach(range => {
    if (!range.container) return;
    const cursor = range.container.querySelector(".cursor");
    if (!cursor) return;
    if (currentValue >= range.min && currentValue <= range.max) {
      cursor.style.display = "block";
      cursor.style.left = `${toPercent(currentValue, range)}%`;
      if (pop) {
        cursor.classList.add("pop");
        setTimeout(() => cursor.classList.remove("pop"), 220);
      }
    } else {
      cursor.style.display = "none";
    }
  });

  // Update visible number for kids
  if (kidNumDisplay) {
    kidNumDisplay.textContent = currentValue;
  } else if (currentPositionDisplay) {
    currentPositionDisplay.textContent = `Current number: ${currentValue}`;
  }
}

/* Drop footprints if within visible line */
function leaveFootprints() {
  ranges.forEach(range => {
    if (!range.container) return;
    if (currentValue >= range.min && currentValue <= range.max) {
      const footprint = document.createElement("div");
      footprint.className = "footprint";
      footprint.style.left = `${toPercent(currentValue, range)}%`;
      range.container.appendChild(footprint);
      // gently fade and remove footprint
      setTimeout(() => (footprint.style.opacity = "0"), 1400);
      setTimeout(() => footprint.remove(), 2200);
    }
  });
}

/* Mark start label on appropriate line */
function markStartPosition(value) {
  ranges.forEach(range => {
    if (!range.container) return;
    range.container.querySelectorAll(".start-label").forEach(l => l.remove());
    if (value >= range.min && value <= range.max) {
      const label = document.createElement("div");
      label.className = "start-label";
      label.style.left = `${toPercent(value, range)}%`;
      label.textContent = `Start: ${value} 🟢`;
      range.container.appendChild(label);

      // small confetti around the start label to celebrate setting the start
      const rect = range.container.getBoundingClientRect();
      const confX = rect.left + (toPercent(value, range) / 100) * rect.width;
      const confY = rect.top + 16;
      confettiBurst(confX, confY, document.body);
    }
  });
}

/* Move step-by-step */
function moveBy(amount) {
  const step = amount > 0 ? 1 : -1;
  const steps = Math.abs(amount);
  const overallMin = ranges[0].min;
  const overallMax = ranges[ranges.length - 1].max;

  for (let i = 0; i < steps; i++) {
    let next = currentValue + step;
    if (next < overallMin) next = overallMin;
    if (next > overallMax) next = overallMax;
    currentValue = next;
    if (startValue !== null && currentValue !== startValue) leaveFootprints();
  }

  // Always pop the cursor to show movement; celebrate large jumps
  updateCursors(true);

  if (Math.abs(amount) >= 10) {
    // show confetti at the current cursor position
    ranges.forEach(range => {
      if (!range.container) return;
      if (currentValue >= range.min && currentValue <= range.max) {
        const rect = range.container.getBoundingClientRect();
        const confX = rect.left + (toPercent(currentValue, range) / 100) * rect.width;
        const confY = rect.top + 10;
        confettiBurst(confX, confY, document.body);
      }
    });
  }
}

/* Controls */
const setStartBtn = document.getElementById("setStartBtn");
const startNumInput = document.getElementById("startNum");
const stepForwardBtn = document.getElementById("stepForwardBtn");
const stepBackBtn = document.getElementById("stepBackBtn");
const stepForward10Btn = document.getElementById("stepForward10Btn");
const stepBack10Btn = document.getElementById("stepBack10Btn");
const resetBtn = document.getElementById("resetBtn");

if (setStartBtn) {
  setStartBtn.addEventListener("click", () => {
    const raw = startNumInput ? startNumInput.value : "";
    const val = parseInt(raw, 10);
    const overallMin = ranges[0].min;
    const overallMax = ranges[ranges.length - 1].max;
    if (Number.isNaN(val) || val < overallMin || val > overallMax) {
      alert(`Pick a number between ${overallMin} and ${overallMax} 😊`);
      return;
    }
    // clear previous footprints/starts
    ranges.forEach(r =>
      r.container.querySelectorAll(".footprint, .start-label").forEach(f => f.remove())
    );
    startValue = val;
    currentValue = val;
    markStartPosition(val);
    updateCursors(true);
  });
}

if (stepForwardBtn) stepForwardBtn.addEventListener("click", () => moveBy(1));
if (stepBackBtn) stepBackBtn.addEventListener("click", () => moveBy(-1));
if (stepForward10Btn) stepForward10Btn.addEventListener("click", () => moveBy(10));
if (stepBack10Btn) stepBack10Btn.addEventListener("click", () => moveBy(-10));

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    ranges.forEach(r =>
      r.container.querySelectorAll(".footprint, .start-label").forEach(f => f.remove())
    );
    currentValue = 0;
    startValue = null;
    updateCursors(true);
  });
}

// Keyboard shortcuts for quick play: Left/Right = -1/+1, Up = +10, Down = -10,
// Enter to set start, R to reset — great for quick, playful exploration
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") moveBy(1);
  if (e.key === "ArrowLeft") moveBy(-1);
  if (e.key === "ArrowUp") moveBy(10);
  if (e.key === "ArrowDown") moveBy(-10);
  if (e.key === "Enter") {
    // only set start if input is visible
    if (setStartBtn) setStartBtn.click();
  }
  if (e.key.toLowerCase() === "r") {
    if (resetBtn) resetBtn.click();
  }
});

/* Initialize */
window.addEventListener("load", drawAll);
