# Javascript Support Vector Machine (SVM) — Toy Project

## ⚠️ Warning
This is a **toy project** to implement a Support Vector Machine (SVM) from scratch in JavaScript. It is intended for educational purposes, experimentation, and learning. **Do not use this code for production or critical applications.**

---

## What Has Been Implemented
- **Core SVM (SMO) Algorithm:**
  - Sequential Minimal Optimization (SMO) for binary classification, implemented in pure JavaScript.
  - Explicit, readable variable names and detailed inline documentation.
  - Modular design: `JSSMOTrainer`, `JSSMOModel`, and supporting kernel/labeller utilities.
  - Pluggable kernel and labeller functions (e.g., linear kernel, boolean label extractor).
- **Testing:**
  - Unit tests using QUnit (2.x syntax).
  - Tests for kernel functions and SMO trainer.
  - A toy, linearly separable dataset is used to verify the SVM can perfectly separate two classes.
- **Argument Validation:**
  - All major functions validate argument count and types, with clear error messages.
- **Documentation:**
  - JSDoc comments for main classes and methods.
  - Inline explanations for key SMO steps, including KKT conditions.

---

## What Remains To Be Implemented
- **Multiclass Support:**
  - Only binary classification is supported. No one-vs-rest or one-vs-one multiclass strategies.
- **Nonlinear Kernels:**
  - Only a linear kernel is provided. Polynomial, RBF, or custom kernels could be added.
- **Prediction API:**
  - No high-level `predict()` method for new/unseen data. Only internal SVM output is exposed.
- **Model Serialization:**
  - No save/load functionality for trained models.
- **Performance Optimization:**
  - No optimizations for large datasets; this is not suitable for big data or real-time use.
- **Error Cache:**
  - The error cache for SMO is not implemented (could improve performance).
- **Web Demo / UI:**
  - No interactive web demo or visualization (could be added for educational value).
- **Robustness:**
  - Limited input validation for edge cases and malformed data.

---

## Contributing / Learning
Feel free to fork, experiment, or use this as a reference for your own SVM implementations. PRs are welcome for fixes, features, or documentation improvements!