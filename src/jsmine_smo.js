//target = desired output vector
//point = training point matrix

//procedure takeStep(i1,i2)
//if (i1 == i2) return 0
//alph1 = Lagrange multiplier for i1
//y1 = target[i1]
//E1 = SVM output on point[i1] - y1 (check in error cache)
//s = y1*y2
//Compute L, H
//if (L == H)
//return 0
//k11 = kernel(point[i1],point[i1])
//k12 = kernel(point[i1],point[i2])
//k22 = kernel(point[i2],point[i2])
//eta = 2*k12-k11-k22
//if (eta < 0)
//{
//a2 = alph2 - y2*(E1-E2)/eta
//if (a2 < L) a2 = L
//else if (a2 > H) a2 = H
//}
//else
//{
//Lobj = objective function at a2=L
//Hobj = objective function at a2=H
//if (Lobj > Hobj+eps)
//a2 = L
//else if (Lobj < Hobj-eps)
//a2 = H
//else
//a2 = alph2
//}
//if (a2 < 1e-8)
//a2 = 0
//else if (a2 > C-1e-8)
//a2 = C
//if (|a2-alph2| < eps*(a2+alph2+eps))
//return 0
//a1 = alph1+s*(alph2-a2)
//Update threshold to reflect change in Lagrange multipliers
//Update weight vector to reflect change in a1 & a2, if linear SVM
//Update error cache using new Lagrange multipliers
//Store a1 in the alpha array
//Store a2 in the alpha array
//return 1
//endprocedure

//
//procedure examineExample(i2)
//y2 = target[i2]
//alph2 = Lagrange multiplier for i2
//E2 = SVM output on point[i2] - y2 (check in error cache)
//r2 = E2*y2
//if ((r2 < -tol && alph2 < C) || (r2 > tol && alph2 > 0))
//{
//if (number of non-zero & non-C alpha > 1)
//{
//i1 = result of second choice heuristic
//if takeStep(i1,i2)
//return 1
//}
//loop over all non-zero and non-C alpha, starting at random point
//{
//i1 = identity of current alpha
//if takeStep(i1,i2)
//return 1
//}
//loop over all possible i1, starting at a random point
//{
//i1 = loop variable
//if takeStep(i1,i2)
//return 1
//}
//}
//return 0
//endprocedure


//main routine:
//initialize alpha array to all zero
//initialize threshold to zero
//numChanged = 0;
//examineAll = 1;
//while (numChanged > 0 | examineAll)
//{
//numChanged = 0;
//if (examineAll)
//loop I over all training examples
//numChanged += examineExample(I)
//else
//loop I over examples where alpha is not 0 & not C
//numChanged += examineExample(I)
//if (examineAll == 1)
//examineAll = 0
//else if (numChanged == 0)
//examineAll = 1
//}



function JSSMOTrainer(cvalue, max_iterations){
  validArgs(2, ['number','number']);
  this.c = cvalue;
  this.max_iterations = max_iterations;
  this.tolerance = undefined;
}

function JSSMOModel(examples, binary_labeller, kernel){
  validArgs(3, ['array','function','function']);
  this.alpha = new Array();
  this.labeller = binary_labeller;
  this.kernel = kernel;
  this.threshold = 0;
  this.examples = examples;
  // initialize alpha to zero
  for(var i = 0; i < examples.length; i++){
    this.alpha[i] = 0;
  }
}

JSSMOTrainer.prototype.train = function(training_examples, binary_labeller, kernel_function) {
  validArgs(3, ['array','function','function']);
  var tolerance = this.tolerance || 1e-3;
  var C = this.c;
  var max_passes = this.max_iterations;
  var passes = 0;
  var num_changed = 0;
  var examine_all = true;
  var model = new JSSMOModel(training_examples, binary_labeller, kernel_function);
  var N = training_examples.length;

  // Main SMO loop
  while (passes < max_passes && (num_changed > 0 || examine_all)) {
    num_changed = 0;
    if (examine_all) {
      // Loop over all training examples
      for (var i = 0; i < N; i++) {
        num_changed += this.examineExample(i, model, C, tolerance);
      }
    } else {
      // Loop over examples where alpha is not 0 & not C
      for (var i = 0; i < N; i++) {
        if (model.alpha[i] !== 0 && model.alpha[i] !== C) {
          num_changed += this.examineExample(i, model, C, tolerance);
        }
      }
    }
    if (examine_all) {
      examine_all = false;
    } else if (num_changed === 0) {
      examine_all = true;
    }
    passes++;
  }
  // Return the trained model
  return model;
};

/**
 * Examine one example (right_index) and decide whether to optimize its alpha.
 * @param {number} right_index - Index of the candidate (right) alpha to optimize.
 * @param {JSSMOModel} model - The current SVM model (contains alphas, labeller, kernel, etc).
 * @param {number} C - Regularization parameter.
 * @param {number} tolerance - Numerical tolerance for KKT violation.
 * @returns {number} 1 if optimization happened, 0 otherwise.
 */
JSSMOTrainer.prototype.examineExample = function(j, model, C, tolerance) {
  var label_j = model.labeller(model.examples[j]) ? 1 : -1;
  var alpha_j = model.alpha[j];
  var error_j = this.SVMOutput(model, j) - label_j;
  var error_times_label_j = error_j * label_j;

  /**
   * KKT (Karush-Kuhn-Tucker) conditions:
   * For each training example, the following must hold at optimality:
   *   - If alpha == 0: label * f(x) >= 1 - tolerance
   *   - If 0 < alpha < C: label * f(x) == 1 (within tolerance)
   *   - If alpha == C: label * f(x) <= 1 + tolerance
   * In SMO, we check for KKT violation to decide if an example is eligible for optimization.
   */
  if ((error_times_label_j < -tolerance && alpha_j < C) || (error_times_label_j > tolerance && alpha_j > 0)) {
    var N = model.examples.length;
    // Try heuristic: choose i to maximize |error_i - error_j|
    var i = -1, maxDelta = 0;
    for (var k = 0; k < N; k++) {
      if (model.alpha[k] > 0 && model.alpha[k] < C) {
        var label_i = model.labeller(model.examples[k]) ? 1 : -1;
        var error_i = this.SVMOutput(model, k) - label_i;
        var delta = Math.abs(error_i - error_j);
        if (delta > maxDelta) {
          maxDelta = delta;
          i = k;
        }
      }
    }
    if (i >= 0 && this.takeStep(i, j, model, C, tolerance)) {
      return 1;
    }
    // Try all non-zero and non-C alpha, starting at random
    for (var k = 0; k < N; k++) {
      if (model.alpha[k] > 0 && model.alpha[k] < C && this.takeStep(k, j, model, C, tolerance)) {
        return 1;
      }
    }
    // Try all possible i
    for (var k = 0; k < N; k++) {
      if (this.takeStep(k, j, model, C, tolerance)) {
        return 1;
      }
    }
  }
  return 0;
};

/**
 * Attempt to jointly optimize the pair (i, j) of alphas.
 * @param {number} i - Index of the first alpha (alpha_i).
 * @param {number} j - Index of the second alpha (alpha_j).
 * @param {JSSMOModel} model - The current SVM model.
 * @param {number} C - Regularization parameter.
 * @param {number} tolerance - Numerical tolerance for step acceptance.
 * @returns {number} 1 if step taken, 0 otherwise.
 */
JSSMOTrainer.prototype.takeStep = function(i, j, model, C, tolerance) {
  if (i === j) return 0;
  var x_i = model.examples[i];
  var x_j = model.examples[j];
  var label_i = model.labeller(x_i) ? 1 : -1;
  var label_j = model.labeller(x_j) ? 1 : -1;
  var alpha_i = model.alpha[i];
  var alpha_j = model.alpha[j];
  var error_i = this.SVMOutput(model, i) - label_i;
  var error_j = this.SVMOutput(model, j) - label_j;
  var label_product = label_i * label_j;

  // Compute upper and lower bounds for alpha_j
  var lower_bound_alpha_j, upper_bound_alpha_j;
  if (label_i !== label_j) {
    lower_bound_alpha_j = Math.max(0, alpha_j - alpha_i);
    upper_bound_alpha_j = Math.min(C, C + alpha_j - alpha_i);
  } else {
    lower_bound_alpha_j = Math.max(0, alpha_j + alpha_i - C);
    upper_bound_alpha_j = Math.min(C, alpha_j + alpha_i);
  }
  if (lower_bound_alpha_j === upper_bound_alpha_j) return 0;

  // Compute kernel values
  var k_ii = model.kernel(x_i, x_i);
  var k_ij = model.kernel(x_i, x_j);
  var k_jj = model.kernel(x_j, x_j);
  var eta = 2 * k_ij - k_ii - k_jj;

  var new_alpha_j;
  if (eta < 0) {
    new_alpha_j = alpha_j - label_j * (error_i - error_j) / eta;
    if (new_alpha_j < lower_bound_alpha_j) new_alpha_j = lower_bound_alpha_j;
    else if (new_alpha_j > upper_bound_alpha_j) new_alpha_j = upper_bound_alpha_j;
  } else {
    // Compute objective at lower and upper bounds
    var f_i = label_i * (error_i + model.threshold) - alpha_i * k_ii - label_product * alpha_j * k_ij;
    var f_j = label_j * (error_j + model.threshold) - label_product * alpha_i * k_ij - alpha_j * k_jj;
    var L_i = alpha_i + label_product * (alpha_j - lower_bound_alpha_j);
    var H_i = alpha_i + label_product * (alpha_j - upper_bound_alpha_j);
    var objL = L_i * f_i + lower_bound_alpha_j * f_j + 0.5 * L_i * L_i * k_ii + 0.5 * lower_bound_alpha_j * lower_bound_alpha_j * k_jj + label_product * lower_bound_alpha_j * L_i * k_ij;
    var objH = H_i * f_i + upper_bound_alpha_j * f_j + 0.5 * H_i * H_i * k_ii + 0.5 * upper_bound_alpha_j * upper_bound_alpha_j * k_jj + label_product * upper_bound_alpha_j * H_i * k_ij;
    if (objL > objH + tolerance) new_alpha_j = lower_bound_alpha_j;
    else if (objL < objH - tolerance) new_alpha_j = upper_bound_alpha_j;
    else new_alpha_j = alpha_j;
  }

  if (Math.abs(new_alpha_j - alpha_j) < tolerance * (new_alpha_j + alpha_j + tolerance)) return 0;
  var new_alpha_i = alpha_i + label_product * (alpha_j - new_alpha_j);

  // Update threshold (bias)
  var b_i = model.threshold + error_i + label_i * (new_alpha_i - alpha_i) * k_ii + label_j * (new_alpha_j - alpha_j) * k_ij;
  var b_j = model.threshold + error_j + label_i * (new_alpha_i - alpha_i) * k_ij + label_j * (new_alpha_j - alpha_j) * k_jj;
  if (0 < new_alpha_i && new_alpha_i < C) model.threshold = b_i;
  else if (0 < new_alpha_j && new_alpha_j < C) model.threshold = b_j;
  else model.threshold = (b_i + b_j) / 2;

  // Update alpha values
  model.alpha[i] = new_alpha_i;
  model.alpha[j] = new_alpha_j;

  // (Optional) Update error cache here if implemented

  return 1;
};

/**
 * Compute SVM output (decision value) for a given example index.
 * @param {JSSMOModel} model - The SVM model (contains alphas, labeller, kernel, etc).
 * @param {number} idx - Index of the example to evaluate.
 * @returns {number} The SVM output (real-valued decision function).
 */
JSSMOTrainer.prototype.SVMOutput = function(model, idx) {
  var result = 0;
  var N = model.examples.length;
  var x = model.examples[idx];
  for (var i = 0; i < N; i++) {
    var y = model.labeller(model.examples[i]) ? 1 : -1;
    result += model.alpha[i] * y * model.kernel(model.examples[i], x);
  }
  return result - model.threshold;
};