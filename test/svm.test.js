const fs = require('fs');
const kernelCode = fs.readFileSync('src/jsmine_kernels.js', 'utf8');
const smoCode = fs.readFileSync('src/jsmine_smo.js', 'utf8');

eval(kernelCode);
eval(smoCode);

describe('JSSMOTrainer', () => {
  test('should correctly classify a linearly separable dataset', () => {
    const toyData = [
      new JSMineSimpleData([2, 3], true),   // +1
      new JSMineSimpleData([1, 0], false),  // -1
      new JSMineSimpleData([4, 5], true),   // +1
      new JSMineSimpleData([0, 2], false),  // -1
    ];

    const trainer = new JSSMOTrainer(10, 100); // Large C for hard margin
    const model = trainer.train(toyData, jsmine_simple_label, jsmine_linear_kernel);

    console.log('Alphas:', model.alpha);
    console.log('Threshold:', model.threshold);

    // Check that at least one alpha is non-zero
    const nonZeroAlphas = model.alpha.filter(a => a > 0);
    expect(nonZeroAlphas.length).toBeGreaterThan(0);

    // All points should be correctly classified with a margin of at least 1
    for (let i = 0; i < toyData.length; ++i) {
      const output = trainer.SVMOutput(model, i);
      const label = jsmine_simple_label(toyData[i]) ? 1 : -1;
      console.log(`Point ${i}: SVMOutput = ${output}, Label = ${label}`);
      expect(label * output).toBeGreaterThanOrEqual(0.99999);
    }
  });

  test('should correctly predict the class of new examples', () => {
    const toyData = [
      new JSMineSimpleData([2, 3], true),   // +1
      new JSMineSimpleData([1, 0], false),  // -1
      new JSMineSimpleData([4, 5], true),   // +1
      new JSMineSimpleData([0, 2], false),  // -1
    ];

    const trainer = new JSSMOTrainer(10, 100);
    const model = trainer.train(toyData, jsmine_simple_label, jsmine_linear_kernel);

    // Test new examples
    const newExample1 = new JSMineSimpleData([2.5, 3.5], true); // Should be +1
    const newExample2 = new JSMineSimpleData([0.5, 1.5], false); // Should be -1
    const newExample3 = new JSMineSimpleData([10, 10], true); // Should be +1
    const newExample4 = new JSMineSimpleData([-1, -1], false); // Should be -1

    expect(trainer.predict(model, newExample1)).toBe(1);
    expect(trainer.predict(model, newExample2)).toBe(-1);
    expect(trainer.predict(model, newExample3)).toBe(1);
    expect(trainer.predict(model, newExample4)).toBe(-1);
  });
});
