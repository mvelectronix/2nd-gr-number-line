document.addEventListener('DOMContentLoaded', () => {
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

    const toPercent = (value) => (value / 100) * 100;

    // Create number line with labeled ticks every 10 units
    function createNumberLine() {
        numberLine.innerHTML = '';

        for (let i = 0; i <= 100; i++) {
            const tick = document.createElement('div');
            tick.className = 'tick';
            tick.style.left = toPercent(i) + '%';
            numberLine.appendChild(tick);

            if (i % 10 === 0) {
                const numberSpan = document.createElement('span');
                numberSpan.className = 'tick-label';
                numberSpan.textContent = i;
                numberSpan.style.left = toPercent(i) + '%';
                numberLine.appendChild(numberSpan);
            }
        }
    }

    // Update positions of markers
    function updateMarkers() {
        const position = toPercent(currentNumber);
        currentMarker.style.left = position + '%';
        currentMarker.textContent = currentNumber;
        currentNumberSpan.textContent = currentNumber;

        const startPosition = toPercent(startNumber);
        startMarker.style.left = startPosition + '%';
        startMarker.textContent = startNumber;
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
        const value = parseInt(startNumberInput.value, 10);
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
});
