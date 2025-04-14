load("../lib/qunit/qunit.js");

function doesntThrow(block, message) {
  ok = true;
  try {
    block();
  } catch (e) {
    ok = false;
  }
  QUnit.ok(ok, message);
}

QUnit.init();
QUnit.config.blocking = false;
QUnit.config.autorun = true;
QUnit.config.updateRate = 0;
QUnit.log = function(result) {
  var message = result.result ? "PASS" : "FAIL";
  message += ":"  + result.message;
  if (result.expected && result.actual) {
    message += " (expected " + result.expected + "; got " + result.actual + ")";
  }
  print(message);
};

QUnit.testStart = function(test){
  print("..........................................................................");
  print("Started:>> " + test.name);
};

QUnit.testDone = function(test){
  print("Finished:>> " + test.name);
  print("Passed:" + (test.passed?test.passed:0) + " Failed:"+ (test.bad?test.bad:0) + " Total:" + (test.total?test.total:0));

};



load("../src/jsmine_kernels.js");
load("./jsmine_kernels_test.js");

load("../src/jsmine_smo.js");
load("./jsmine_smo_test.js");

