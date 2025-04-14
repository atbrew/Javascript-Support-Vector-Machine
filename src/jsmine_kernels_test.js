QUnit.test("Two Non Arrays should complain", function(assert) {
      assert.expect(5);
      assert.ok(jsmine_linear_kernel, "function exists");
      var a = new JSMineSimpleData([1,2,3], true);
      assert.throws(function(){
            jsmine_linear_kernel("a",a);
          },TypeError, "It should raise a type error"
      );

      assert.throws(function(){
            jsmine_linear_kernel(a,"a");
          },TypeError, "It should raise a type error"
      );

      assert.throws(function(){
            jsmine_linear_kernel(a);
          },Error, "It should raise a wrong parameters length error"
      );

      assert.equal(jsmine_linear_kernel(a,a),14, "Dot product should have been 14");//, TypeError(String), "must throw type error to pass");
    }
);

QUnit.test("Can get raises to fail", function(assert) {
      assert.expect(1);
      assert.throws(function(){throw new Error("An Err");}, Error, "It should throw and Error");
    }
);