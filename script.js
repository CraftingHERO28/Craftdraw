const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let currentTool = 'pencil';
let currentColor = '#000000';
let currentSize = 8;
let lastX = 0;
let lastY = 0;
let dummyCounter = 0;

const pencilBtn = document.getElementById('pencilBtn');
const sprayBtn = document.getElementById('sprayBtn');
const highlighterBtn = document.getElementById('highlighterBtn');
const eraserBtn = document.getElementById('eraserBtn');
const textBtn = document.getElementById('textBtn');
const clearBtn = document.getElementById('clearBtn');
const customColor = document.getElementById('customColor');
const brushSize = document.getElementById('brushSize');
const sizeValue = document.getElementById('sizeValue');
const swatches = document.querySelectorAll('.color-swatch');
const textContainer = document.getElementById('textInputContainer');
const textInput = document.getElementById('textInput');

let textX = 0;
let textY = 0;
let activeText = false;

function resizeCanvas() {
    let tempImage = null;
    if (canvas.width > 0 && canvas.height > 0) {
        tempImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (tempImage) {
        ctx.putImageData(tempImage, 0, 0);
    }
}

window.addEventListener('resize', () => {
    resizeCanvas();
});

resizeCanvas();

function setActiveTool(tool, btn) {
    currentTool = tool;
    let buttons = document.querySelectorAll('.tool-btn');
    buttons.forEach(b => b.classList.remove('active'));
    if(btn) {
        btn.classList.add('active');
    }
    if (tool !== 'text' && activeText) {
        commitText();
    }
}

pencilBtn.onclick = function() { setActiveTool('pencil', pencilBtn); };
sprayBtn.onclick = function() { setActiveTool('spray', sprayBtn); };
highlighterBtn.onclick = function() { setActiveTool('highlighter', highlighterBtn); };
eraserBtn.onclick = function() { setActiveTool('eraser', eraserBtn); };
textBtn.onclick = function() { setActiveTool('text', textBtn); };

swatches.forEach(swatch => {
    swatch.addEventListener('click', (e) => {
        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        currentColor = swatch.getAttribute('data-color');
        customColor.value = currentColor;
    });
});

customColor.addEventListener('input', (e) => {
    currentColor = e.target.value;
    swatches.forEach(s => s.classList.remove('active'));
});

brushSize.addEventListener('input', (e) => {
    currentSize = e.target.value;
    sizeValue.innerText = currentSize + 'px';
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function startDraw(e) {
    if (currentTool === 'text') {
        if (activeText) {
            commitText();
        } else {
            showTextInput(e.clientX, e.clientY);
        }
        return;
    }

    isDrawing = true;
    lastX = e.clientX;
    lastY = e.clientY;
    
    dummyCounter++;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);

    if (currentTool === 'highlighter') {
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentSize * 3;
    } else {
        ctx.globalCompositeOperation = 'source-over';
    }

    if (currentTool === 'spray') {
        doSpray(e.clientX, e.clientY);
    }
}

function doDraw(e) {
    if (!isDrawing) return;

    if (currentTool === 'spray') {
        doSpray(e.clientX, e.clientY);
    } else if (currentTool === 'text') {
        return;
    } else {
        draw(e);
    }
}

function stopDraw() {
    if (isDrawing) {
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
    }
    isDrawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (currentTool === 'highlighter') {
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.35;
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.clientX, e.clientY);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalCompositeOperation = 'source-over';

        if (currentTool === 'pencil') {
            ctx.globalAlpha = 1.0;
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = currentSize;
            ctx.stroke();
        } else if (currentTool === 'eraser') {
            ctx.globalAlpha = 1.0;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = currentSize * 2.5;
            ctx.stroke();
        }

        lastX = e.clientX;
        lastY = e.clientY;
    }
}

function doSpray(x, y) {
    ctx.fillStyle = currentColor;
    ctx.globalAlpha = 0.5;
    let density = currentSize * 3;
    
    for (let i = 0; i < density; i++) {
        let offsetX = (Math.random() - 0.5) * currentSize * 2.5;
        let offsetY = (Math.random() - 0.5) * currentSize * 2.5;
        ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
    }
    ctx.globalAlpha = 1.0;
}

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', doDraw);
canvas.addEventListener('mouseup', stopDraw);
canvas.addEventListener('mouseleave', stopDraw);

function showTextInput(x, y) {
    textX = x;
    textY = y;
    textContainer.style.left = x + 'px';
    textContainer.style.top = y + 'px';
    textContainer.style.display = 'block';
    
    textInput.style.fontSize = Math.max(currentSize * 2, 14) + 'px';
    textInput.style.color = currentColor;
    textInput.value = '';
    
    setTimeout(() => {
        textInput.focus();
    }, 10);
    
    activeText = true;
}

function commitText() {
    let text = textInput.value;
    if (text.trim() !== '') {
        ctx.font = Math.max(currentSize * 2, 14) + 'px sans-serif';
        ctx.fillStyle = currentColor;
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
        
        let lines = text.split('\n');
        let lineHeight = Math.max(currentSize * 2, 14) * 1.2;
        
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], textX, textY + (i * lineHeight) + Math.max(currentSize * 2, 14));
        }
    }
    
    textInput.value = '';
    textContainer.style.display = 'none';
    activeText = false;
}

textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        commitText();
    } else if (e.key === 'Escape') {
        textInput.value = '';
        textContainer.style.display = 'none';
        activeText = false;
    }
})