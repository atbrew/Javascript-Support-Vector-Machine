# Specification: Interactive SVM Canvas

## 1. Overview

This document outlines the specification for a static HTML page that provides an interactive canvas for testing and visualizing the JavaScript Support Vector Machine (SVM).

## 2. User Interface (UI)

The UI will consist of the following elements:

*   **Point Selection:** Radio buttons to select the class of the point to be placed ('x' or 'o').
*   **HTML Canvas:** A canvas element will be the main interactive area.
*   **Train Button:** A button labeled "Train SVM" will initiate the training process. This button should be initially hidden and only become visible after at least one 'x' and one 'o' have been placed on the canvas.
*   **Clear Button:** A button labeled "Clear" will clear the canvas and reset the SVM.

## 3. User Interaction

*   **Placing Points:**
    *   The user will first select the class of the point ('x' or 'o') using the radio buttons.
    *   A click on the canvas will place a point of the selected class at the click coordinates.
*   **Training:**
    *   Clicking the "Train SVM" button will take all the points placed on the canvas and use them to train the linear SVM.
*   **Decision Boundary:**
    *   After the SVM is trained, the linear decision boundary will be drawn on the canvas. The decision boundary is the line that separates the two classes.
    *   The two support vectors should also be highlighted.

## 4. Implementation Details

*   **Canvas:** The HTML5 canvas API will be used to draw the points and the decision boundary.
*   **SVM Integration:** The existing `JSSMOTrainer` will be used to train the SVM. The data points will be represented as `JSMineSimpleData` objects.
*   **Decision Boundary Calculation:**
    *   The decision boundary for a linear SVM is given by the equation `w.x - b = 0`, where `w` is the weight vector and `b` is the threshold (bias).
    *   The weight vector `w` can be calculated from the alphas and the support vectors: `w = sum(alpha_i * y_i * x_i)`.
    *   Once `w` and `b` are known, the line can be drawn on the canvas. For a 2D space `(x1, x2)`, the line equation is `w1*x1 + w2*x2 - b = 0`. We can find two points on this line to draw it. For example, we can set `x1 = 0` and solve for `x2`, and then set `x2 = canvas.height` and solve for `x1`.

## 5. File Structure

*   The new files will be:
    *   `specs/svm-interactive-canvas.md` (this file)
    *   `interactive/index.html`
    *   `interactive/main.js`
    *   `interactive/style.css`
