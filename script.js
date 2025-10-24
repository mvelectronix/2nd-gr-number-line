// Generate the number line dynamically
const numberLineContainer = document.getElementById("numberLineContainer");
const min = -10, max = 10;
const lineWidth = numberLineContainer.clientWidth;
const stepWidth = lineWidth / (max - min);

for (let i = min; i <= max; i++) {
  const x = ((i - min) / (max - min)) * 100;
  const tick = document.createElement("div");
  tick.classList.add("marker");
  tick.style.left = `${x}%`;

  const label = document.createElement("div");
  label.classList.add("label");
  label.style.left = `${x}%`;
  label.textContent = i;

  numberLineContainer.appendChild(tick);
  numberLineContainer.appendChild(label);
}

document.getElementById("calculateBtn").addEventListener("click", () => {
  const num1 = parseInt(document.getElementById("num1").value);
  const num2 = parseInt(document.getElementById("num2").value);
  const operation = document.getElementById("operation").value;
  const resultDisplay = document.getElementById("result");

  if (isNaN(num1) || isNaN(num2)) {
    resultDisplay.textContent = "Please enter both numbers!";
    return;
  }

  let result = operation === "add" ? num1 + num2 : num1 - num2;
  resultDisplay.textContent = `${num1} ${operation === "add" ? "+" : "−"} ${num2} = ${result}`;

  drawJump(num1, num2, operation);
});

function drawJump(start, value, op) {
  // Remove any existing jumps
  document.querySelectorAll(".jump").forEach(el => el.remove());

  const containerWidth = numberLineContainer.clientWidth;
  const startX = ((start - min) / (max - min)) * containerWidth;
  const direction = op === "add" ? 1 : -1;
  const endX = ((start + direction * value - min) / (max - min)) * containerWidth;

  const jump = document.createElement("div");
  jump.classList.add("jump");
  jump.style.left = `${startX}px`;
  jump.style.width = "0px";
  numberLineContainer.appendChild(jump);

  setTimeout(() => {
    jump.style.width = `${Math.abs(endX - startX)}px`;
    if (direction === -1) jump.style.left = `${endX}px`;
  }, 100);
}
