test("Two Non Arrays should complain", function() {
      expect(5);
      ok(jsmine_linear_kernel, "function exists");
      var a = new JSMineSimpleData([1,2,3], true);
      raises(function(){
            jsmine_linear_kernel("a",a);
          },TypeError, "It should raise a type error"
      );

      raises(function(){
            jsmine_linear_kernel(a,"a");
          },TypeError, "It should raise a type error"
      );

      raises(function(){
            jsmine_linear_kernel(a);
          },Error, "It should raise a wrong parameters length error"
      );

      equals(jsmine_linear_kernel(a,a),14, "Dot product should have been 14");//, TypeError(String), "must throw type error to pass");
    }
);

test("Can get raises to fail", function() {
      expect(1);
      raises(function(){throw new Error("An Err");}, Error, "It should throw and Error");
    }
);