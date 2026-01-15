const canvas = document.getElementById('svm-canvas');
const ctx = canvas.getContext('2d');
const trainBtn = document.getElementById('train-btn');
const clearBtn = document.getElementById('clear-btn');

let points = [];
let svmModel = null;

// Expose points for testing
if (typeof window !== 'undefined') {
    window.points = points;
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = p.label === 1 ? 'blue' : 'red';
        ctx.fill();
    }

    if (svmModel) {
        const w = { x: 0, y: 0 };
        const b = svmModel.threshold;

        for (let i = 0; i < svmModel.examples.length; i++) {
            if (svmModel.alpha[i] > 0) {
                const x_i = svmModel.examples[i].data;
                const y_i = svmModel.labeller(svmModel.examples[i]) ? 1 : -1;
                w.x += svmModel.alpha[i] * y_i * x_i[0];
                w.y += svmModel.alpha[i] * y_i * x_i[1];

                // Highlight support vectors
                ctx.beginPath();
                ctx.arc(x_i[0], x_i[1], 10, 0, 2 * Math.PI);
                ctx.strokeStyle = 'green';
                ctx.stroke();
            }
        }

        const x1 = 0;
        const y1 = (-w.x * x1 + b) / w.y;
        const x2 = canvas.width;
        const y2 = (-w.x * x2 + b) / w.y;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }
}

function addPoint(x, y) {
    const label = parseInt(document.querySelector('input[name="point-class"]:checked').value);
    points.push({ x, y, label });

    const hasPositive = points.some(p => p.label === 1);
    const hasNegative = points.some(p => p.label === -1);
    trainBtn.style.display = hasPositive && hasNegative ? 'inline-block' : 'none';

    redraw();
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addPoint(x, y);
});

// prevent context menu on right-click
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

function trainSVM() {
    const data = points.map(p => new JSMineSimpleData([p.x, p.y], p.label === 1));
    const trainer = new JSSMOTrainer(1.0, 100);
    svmModel = trainer.train(data, jsmine_simple_label, jsmine_linear_kernel);
    redraw();
}

trainBtn.addEventListener('click', () => {
    trainSVM();
});

clearBtn.addEventListener('click', () => {
    points = [];
    svmModel = null;
    trainBtn.style.display = 'none';
    redraw();
});
