// DOM Elements
const numberLine = document.getElementById('numberLine');
const startMarker = document.getElementById('startMarker');
const currentMarker = document.getElementById('currentMarker');
const startNumberInput = document.getElementById('startNumber');
const setStartBtn = document.getElementById('setStart');
const resetBtn = document.getElementById('resetBtn');
const currentNumberSpan = document.getElementById('currentNumber');

// Variables
let currentNumber = 0;
let startNumber = 0;

// Create number line
function createNumberLine() {
    numberLine.innerHTML = '';
    
    // Create 101 numbers from 0 to 100
    for (let i = 0; i <= 100; i++) {
        const numberSpan = document.createElement('span');
        numberSpan.textContent = i;
        numberSpan.style.left = (i * 100 / 100) + '%';
        numberLine.appendChild(numberSpan);
    }
}

// Update positions of markers
function updateMarkers() {
    // Calculate position as percentage of total width
    const position = (currentNumber / 100) * 100;
    
    // Update current marker position
    currentMarker.style.left = position + '%';
    
    // Update the displayed number
    currentNumberSpan.textContent = currentNumber;
    
    // Update start marker if needed
    if (startNumber !== currentNumber) {
        const startPosition = (startNumber / 100) * 100;
        startMarker.style.left = startPosition + '%';
    }
}

// Function to handle movement
function move(direction) {
    if (direction === 'back1') {
        currentNumber = Math.max(0, currentNumber - 1);
    } else if (direction === 'forward1') {
        currentNumber = Math.min(100, currentNumber + 1);
    } else if (direction === 'back10') {
        currentNumber = Math.max(0, currentNumber - 10);
    } else if (direction === 'forward10') {
        currentNumber = Math.min(100, currentNumber + 10);
    }
    
    updateMarkers();
}

// Reset to starting position
function reset() {
    currentNumber = startNumber;
    updateMarkers();
}

// Set the starting number
function setStartNumber() {
    const value = parseInt(startNumberInput.value);
    if (value >= 0 && value <= 100) {
        startNumber = value;
        currentNumber = value;
        updateMarkers();
    } else {
        alert('Please enter a number between 0 and 100');
    }
}

// Event Listeners
document.querySelectorAll('.control-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const direction = e.target.dataset.direction;
        move(direction);
    });
});

setStartBtn.addEventListener('click', setStartNumber);
resetBtn.addEventListener('click', reset);

// Initialize
createNumberLine();
updateMarkers();
