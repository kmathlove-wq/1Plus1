const display = document.getElementById('display');
const themeBtn = document.getElementById('theme-btn');
let currentTheme = 'dark';
let afterResult = false;

const OPERATORS = ['+', '-', '×', '÷'];

function toggleTheme() {
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeBtn.innerText = "다크 모드로 전환";
        currentTheme = 'light';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeBtn.innerText = "화이트 모드로 전환";
        currentTheme = 'dark';
    }
}

function updateFontSize() {
    const length = display.value.length;
    if (length > 16) {
        display.style.fontSize = "1.2rem";
    } else if (length > 12) {
        display.style.fontSize = "1.6rem";
    } else if (length > 8) {
        display.style.fontSize = "2.0rem";
    } else {
        display.style.fontSize = "2.5rem";
    }
}

function appendToDisplay(input) {
    const current = display.value;
    const lastChar = current.slice(-1);

    if (afterResult) {
        if (!isNaN(input) || input === '.') {
            display.value = input;
            afterResult = false;
            updateFontSize();
            return;
        }
        afterResult = false;
    }

    if (OPERATORS.includes(input) && OPERATORS.includes(lastChar)) {
        display.value = current.slice(0, -1) + input;
        updateFontSize();
        return;
    }

    if (display.value === "0" && !isNaN(input) && input !== '.') {
        display.value = input;
    } else {
        display.value += input;
    }
    updateFontSize();
}

function backspace() {
    display.value = display.value.length > 1 ? display.value.slice(0, -1) : '0';
    afterResult = false;
    updateFontSize();
}

function clearDisplay() {
    display.value = "0";
    afterResult = false;
    updateFontSize();
}

function calculate() {
    if (display.value.replace(/\s/g, '') === '1+1') {
        display.value = '1';
        afterResult = true;
        updateFontSize();
        openEasterEgg();
        return;
    }
    try {
        const expr = display.value.replace(/×/g, '*').replace(/÷/g, '/');
        if (!/^[\d\s+\-*/.]+$/.test(expr)) throw new Error('Invalid');
        let result = Function('"use strict"; return (' + expr + ')')();
        if (!Number.isInteger(result)) {
            result = Number(result.toFixed(8));
        }
        display.value = result;
        afterResult = true;
        updateFontSize();
    } catch (error) {
        display.value = "Error";
        setTimeout(clearDisplay, 1500);
    }
}

function openEasterEgg() {
    const overlay = document.getElementById('easter-overlay');
    const frame = document.getElementById('easter-frame');
    frame.src = 'https://www.youtube.com/embed/LagZIs5NxTQ?autoplay=1';
    overlay.style.display = 'flex';
    const req = overlay.requestFullscreen || overlay.webkitRequestFullscreen || overlay.mozRequestFullScreen;
    if (req) req.call(overlay);
}

document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement) {
        const overlay = document.getElementById('easter-overlay');
        overlay.style.display = 'none';
        document.getElementById('easter-frame').src = '';
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key >= '0' && e.key <= '9') appendToDisplay(e.key);
    else if (['+', '-'].includes(e.key)) appendToDisplay(e.key);
    else if (e.key === '*') appendToDisplay('×');
    else if (e.key === '/') { e.preventDefault(); appendToDisplay('÷'); }
    else if (e.key === '.') appendToDisplay('.');
    else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Escape') clearDisplay();
    else if (e.key === 'Backspace') backspace();
});
