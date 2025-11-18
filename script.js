document.addEventListener('DOMContentLoaded', () => {
    const lines = Array.from(document.querySelectorAll('.number-line')).map((element) => ({
        element,
        min: Number(element.dataset.min),
        max: Number(element.dataset.max),
        startMarker: null,
        currentMarker: null,
    }));

    const startNumberInput = document.getElementById('startNumber');
    const setStartBtn = document.getElementById('setStart');
    const resetBtn = document.getElementById('resetBtn');
    const currentNumberSpan = document.getElementById('currentNumber');
    const stepsCountSpan = document.getElementById('stepsCount');

    let currentNumber = 0;
    let startNumber = 0;

    const toPercent = (value, min, max) => ((value - min) / (max - min)) * 100;
    const isWithin = (value, range) => value >= range.min && value <= range.max;

    function createMarker(className) {
        const marker = document.createElement('div');
        marker.className = `marker ${className}`;
        marker.textContent = '0';
        return marker;
    }

    function buildLine(line) {
        const { element, min, max } = line;
        element.innerHTML = '';

        for (let i = min; i <= max; i++) {
            const tick = document.createElement('div');
            tick.className = 'tick';
            tick.style.left = `${toPercent(i, min, max)}%`;
            element.appendChild(tick);

            if (i === min || i === max || i % 10 === 0) {
                const numberSpan = document.createElement('span');
                numberSpan.className = 'tick-label';
                numberSpan.textContent = i;
                numberSpan.style.left = `${toPercent(i, min, max)}%`;
                element.appendChild(numberSpan);
            }
        }

        line.startMarker = createMarker('start-marker');
        line.currentMarker = createMarker('current-marker');
        element.appendChild(line.startMarker);
        element.appendChild(line.currentMarker);
    }

    function placeMarker(marker, line, value) {
        marker.style.left = `${toPercent(value, line.min, line.max)}%`;
        marker.textContent = value;
    }

    function updateMarkers() {
        lines.forEach((line) => {
            const showStart = isWithin(startNumber, line);
            const showCurrent = isWithin(currentNumber, line);

            line.startMarker.style.display = showStart ? 'flex' : 'none';
            line.currentMarker.style.display = showCurrent ? 'flex' : 'none';

            if (showStart) {
                placeMarker(line.startMarker, line, startNumber);
            }

            if (showCurrent) {
                placeMarker(line.currentMarker, line, currentNumber);
            }
        });

        currentNumberSpan.textContent = currentNumber;
        stepsCountSpan.textContent = Math.abs(currentNumber - startNumber);
    }

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

    function reset() {
        currentNumber = startNumber;
        updateMarkers();
    }

    function setStartNumber() {
        const value = parseInt(startNumberInput.value, 10);

        if (value >= 0 && value <= 100) {
            startNumber = value;
            currentNumber = value;
            updateMarkers();
        } else {
            alert('Please enter a number between 0 and 100.');
        }
    }

    document.querySelectorAll('.control-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
            const direction = e.target.dataset.direction;
            move(direction);
        });
    });

    setStartBtn.addEventListener('click', setStartNumber);
    resetBtn.addEventListener('click', reset);

    lines.forEach(buildLine);
    updateMarkers();
});
