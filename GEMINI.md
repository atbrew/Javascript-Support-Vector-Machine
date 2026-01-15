# GEMINI.md

## Project Overview

This project is a "toy" implementation of a Support Vector Machine (SVM) in JavaScript, created for educational purposes. It implements the Sequential Minimal Optimization (SMO) algorithm for binary classification. The code is written in a modular way, with separate components for the SMO trainer, the SVM model, and kernel functions.

The main technologies used are:

*   **JavaScript (ES5)**: The core logic is written in plain JavaScript.
*   **Jest**: Used for unit testing.

The project is structured as follows:

*   `src/`: Contains the core source code.
    *   `jsmine_smo.js`: The SMO algorithm implementation, including the `predict` method.
    *   `jsmine_kernels.js`: Kernel functions and data structures.
*   `test/`: Contains the Jest tests.
    *   `svm.test.js`: Tests for the SVM trainer and prediction.
*   `package.json`: Manages project dependencies and defines test scripts.

## Building and Running

### Running Tests

To run the tests, use the following command in your terminal:

```bash
npm test
```

## Development Conventions

*   **Test-Driven Development (TDD)**: We focus on Test-Driven Development. This means we write tests first, then add the code necessary to make those tests pass.
*   **Coding Style**: The code follows a consistent style with clear variable names and inline comments. JSDoc comments are used for major classes and methods.
*   **Testing**: The project uses Jest for unit testing. Tests are located in the `test/` directory and cover both the SMO trainer and the prediction functionality.
*   **Argument Validation**: Functions include validation for the number and types of arguments, throwing errors with descriptive messages when invalid arguments are provided.
*   **Modularity**: The code is designed to be modular, with the `JSSMOTrainer`, `JSSMOModel`, and kernel functions separated into different files. This allows for easy extension with new kernel functions or other modifications.