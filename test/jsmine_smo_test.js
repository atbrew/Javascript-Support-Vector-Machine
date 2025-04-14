QUnit.test("JSSMOTrainer Constructor", function(assert) {
      assert.expect(4);

      assert.ok(JSSMOTrainer, "JSSmo constructor function should exists");
      assert.throws(function(){new JSSMOTrainer();}, Error, "It should accept exactly two parameter");
      assert.throws(function(){new JSSMOTrainer(1.9, "Brew");}, TypeError, "The parameter should be a number");
      assert.ok(new JSSMOTrainer(1.2, 100), "Should accept a valid argument");
    }
);


QUnit.test("JSSMOTrainer.train", function(assert) {
      assert.expect(3);

      assert.ok(JSSMOTrainer.prototype.train, "JSSmo trainer function should exists");

      var jssmo = new JSSMOTrainer(1.9, 100);

      // Argument count mismatch throws generic Error
      assert.throws(function(){jssmo.train(1,1)}, Error, "Should throw Error for argument count mismatch");

      var training = [
        new JSMineSimpleData([0, 0, 0], true),   // +1
        new JSMineSimpleData([1, 1, 1], false)   // -1
      ];

      // Call with all required arguments
      var ok = true;
      try {
        jssmo.train(training, jsmine_simple_label, jsmine_linear_kernel);
      } catch (e) {
        ok = false;
        assert.ok(false, e && e.message ? e.message : e);
      }
      assert.ok(ok, "Should pass");
    }
);


QUnit.test("JSSMOTrainer on linearly separable toy data", function(assert) {
      assert.expect(9);

      assert.ok(JSSMOTrainer, "JSSmo constructor function should exists");
      assert.throws(function(){new JSSMOTrainer();}, Error, "It should accept exactly two parameter");
      assert.throws(function(){new JSSMOTrainer(1.9, "Brew");}, TypeError, "The parameter should be a number");
      assert.ok(JSSMOTrainer.prototype.train, "JSSmo trainer function should exists");

      var jssmo = new JSSMOTrainer(1.9, 100);

      // Argument count mismatch throws generic Error
      assert.throws(function(){jssmo.train(1,1)}, Error, "Should throw Error for argument count mismatch");

      // Simple 2D dataset: at least 3 points, both classes present
      var toyData = [
        new JSMineSimpleData([2, 3], true),   // +1
        new JSMineSimpleData([1, 0], false),  // -1
        new JSMineSimpleData([4, 5], true),   // +1
        new JSMineSimpleData([0, 2], false),  // -1
      ];

      var trainer = new JSSMOTrainer(10, 100); // Large C for hard margin
      var model = trainer.train(toyData, jsmine_simple_label, jsmine_linear_kernel);

      // All points should be correctly classified
      for (var i = 0; i < toyData.length; ++i) {
        var pred = Math.sign(trainer.SVMOutput(model, i));
        var label = jsmine_simple_label(toyData[i]) ? 1 : -1;
        assert.strictEqual(pred, label, "Point " + i + " classified correctly");
      }
    }
);
