const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../interactive/index.html'), 'utf8');

describe('Interactive SVM Page', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    });

    it('should have radio buttons for selecting point class', () => {
        const radioX = document.getElementById('radio-x');
        const radioO = document.getElementById('radio-o');
        expect(radioX).not.toBeNull();
        expect(radioO).not.toBeNull();
    });

    it('should place a point with the correct class when canvas is clicked', () => {
        // Load main.js to attach event listeners
        require('../interactive/main.js');

        const radioO = document.getElementById('radio-o');
        radioO.checked = true;

        const canvas = document.getElementById('svm-canvas');
        const clickEvent = new MouseEvent('click', {
            clientX: 100,
            clientY: 150,
        });
        canvas.dispatchEvent(clickEvent);

        // Access points from the window object for testing
        const points = window.points;
        expect(points.length).toBe(1);
        expect(points[0].label).toBe(-1);
    });
});
