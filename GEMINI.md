# GEMINI.md

## Project Overview

This project is a "toy" implementation of a Support Vector Machine (SVM) in JavaScript, created for educational purposes. It implements the Sequential Minimal Optimization (SMO) algorithm for binary classification. The code is written in a modular way, with separate components for the SMO trainer, the SVM model, and kernel functions.

The main technologies used are:

*   **JavaScript (ES5)**: The core logic is written in plain JavaScript.
*   **QUnit**: Used for unit testing.

The project is structured as follows:

*   `src/`: Contains the core source code.
    *   `jsmine_smo.js`: The SMO algorithm implementation.
    *   `jsmine_kernels.js`: Kernel functions and data structures.
*   `test/`: Contains the QUnit tests.
    *   `jsmine_smo_test.js`: Tests for the SMO trainer.
    *   `jsmine_kernels_test.js`: Tests for the kernel functions.
*   `lib/`: Contains third-party libraries (QUnit).
*   `tests.html`: An HTML file to run the QUnit tests in a browser.

## Building and Running

### Running Tests

To run the tests, open the `tests.html` file in a web browser. The test results will be displayed on the page.

```bash
# No build process is required.
# To run the tests, open tests.html in your browser.
open tests.html
```

## Development Conventions

*   **Coding Style**: The code follows a consistent style with clear variable names and inline comments. JSDoc comments are used for major classes and methods.
*   **Testing**: The project uses QUnit for unit testing. Tests are located in the `test/` directory and cover both the SMO trainer and the kernel functions.
*   **Argument Validation**: Functions include validation for the number and types of arguments, throwing errors with descriptive messages when invalid arguments are provided.
*   **Modularity**: The code is designed to be modular, with the `JSSMOTrainer`, `JSSMOModel`, and kernel functions separated into different files. This allows for easy extension with new kernel functions or other modifications.
