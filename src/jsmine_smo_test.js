test("JSSMOTrainier Constructor", function() {
      expect(4);

      ok(JSSMOTrainer, "JSSmo constructor function should exists");
      raises(function(){new JSSMOTrainer();}, Error, "It should accept exactly two parameter");
      raises(function(){new JSSMOTrainer(1.9, "Brew");}, TypeError, "The parameter should be a number");
      ok(new JSSMOTrainer(1.2, 100), "Should accept a valid argument");
    }
);


test("JSSMOTrainier.train", function() {
      expect(3);

      ok(JSSMOTrainer.prototype.train, "JSSmo trainer function should exists");

      var jssmo = new JSSMOTrainer(1.9, 100);

      raises(function(){jssmo.train(1,1)}, TypeError, "Should throw TypeError parameter should be a function");

      var training = new Array();
      training[0] = new JSMineSimpleData([0,0,0], true);

      doesntThrow(function(){jssmo.train(training, jsmine_linear_kernel)}, "Should pass");
    }
);

