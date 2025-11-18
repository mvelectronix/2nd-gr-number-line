document.addEventListener("DOMContentLoaded", () => {
  const lineTop = document.getElementById("lineTop");
  const lineBottom = document.getElementById("lineBottom");

  const startInput = document.getElementById("startNumber");
  const setStartBtn = document.getElementById("setStart");
  const resetBtn = document.getElementById("resetBtn");

  const currentNumberSpan = document.getElementById("currentNumber");
  const stepsCountSpan = document.getElementById("stepsCount");

  const startMarker = document.createElement("div");
  startMarker.className = "marker";

  const currentMarker = document.createElement("div");
  currentMarker.className = "marker";

  const connector = document.createElement("div");
  connector.className = "connector";

  let currentNumber = 0;
  let startNumber = 0;

  const getLine = (num) => (num <= 50 ? lineTop : lineBottom);

  const toPercent = (num, line) => {
    const min = +line.dataset.min;
    const max = +line.dataset.max;
    return ((num - min) / (max - min)) * 100;
  };

  function createLine(line) {
    const min = +line.dataset.min;
    const max = +line.dataset.max;
    line.innerHTML = "";
    for (let i = min; i <= max; i++) {
      const pos = `calc(${toPercent(i, line)}% + 5%)`;
      const tick = document.createElement("div");
      tick.className = "tick";
      tick.style.left = pos;
      line.appendChild(tick);
      if (i % 5 === 0) {
        const label = document.createElement("div");
        label.className = "tick-label";
        label.textContent = i;
        label.style.left = pos;
        line.appendChild(label);
      }
    }
  }

  function addFootprint(num) {
    const line = getLine(num);
    const fp = document.createElement("div");
    fp.className = "footprint";
    fp.textContent = "🦶";
    fp.style.left = `calc(${toPercent(num, line)}% + 5%)`;
    line.appendChild(fp);
  }

  function clearFootprints() {
    document.querySelectorAll(".footprint").forEach((fp) => fp.remove());
  }

  function updateMarkers(leaveTrail = false, prev = null) {
    currentNumber = Math.max(0, Math.min(100, currentNumber));

    const line = getLine(currentNumber);
    const startLine = getLine(startNumber);

    if (leaveTrail && prev !== null) addFootprint(prev);

    if (startMarker.parentElement !== startLine) startLine.appendChild(startMarker);
    if (currentMarker.parentElement !== line) line.appendChild(currentMarker);
    if (connector.parentElement !== line) line.appendChild(connector);

    startMarker.style.left = `calc(${toPercent(startNumber, startLine)}% + 5%)`;
    startMarker.textContent = startNumber;

    currentMarker.style.left = `calc(${toPercent(currentNumber, line)}% + 5%)`;
    currentMarker.textContent = currentNumber;

    connector.style.left = `calc(${toPercent(currentNumber, line)}% + 5%)`;

    currentNumberSpan.textContent = currentNumber;
    stepsCountSpan.textContent = Math.abs(currentNumber - startNumber);
  }

  function move(direction) {
    const prev = currentNumber;

    switch (direction) {
      case "back1":
        currentNumber -= 1;
        break;
      case "forward1":
        currentNumber += 1;
        break;
      case "back10":
        currentNumber -= 10;
        break;
      case "forward10":
        currentNumber += 10;
        break;
    }

    updateMarkers(true, prev); // always drop footprints
  }

  function setStart() {
    const val = parseInt(startInput.value, 10);
    if (isNaN(val) || val < 0 || val > 100) {
      alert("Enter a number between 0 and 100!");
      return;
    }

    clearFootprints();
    startNumber = val;
    currentNumber = val;
    updateMarkers(false);
  }

  function reset() {
    currentNumber = startNumber;
    clearFootprints();
    updateMarkers(false);
  }

  document.querySelectorAll(".control-btn").forEach((btn) =>
    btn.addEventListener("click", () => move(btn.dataset.direction))
  );

  setStartBtn.addEventListener("click", setStart);
  resetBtn.addEventListener("click", reset);

  createLine(lineTop);
  createLine(lineBottom);

  lineTop.appendChild(startMarker);
  lineTop.appendChild(currentMarker);
  lineTop.appendChild(connector);

  updateMarkers();
});
