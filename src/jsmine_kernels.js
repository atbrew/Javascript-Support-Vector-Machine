// Utility function live here

function validArgs(num, arrayType){
  //get the parameters of the function that is executing validArgs
  var args = validArgs.caller.arguments,
      len = args.length;
  //Check if the function get the number of parameter you are expecting. If not throw an error.
  //If the parameter declared is 0 then do not perform this check
  if(num){
    if(num !== len){
      var err = new Error();
      err.description = 'The amount of parameters allow it is ' + num + ', received '+ len
      throw err;
    }
  }
  //Verify the type of each of the parameters. If one is wrong throw an error.
  if(arrayType){
    for(var i = 0; i < len; i++){
      if(typeOf(args[i]) !== arrayType[i]){
        var err =  new TypeError();
        err.description = 'In parameter no. ' + (i+1)  + ' the type should be ' + arrayType[i] + ', received ' + typeOf(args[i]);
        throw err;
      }
    }
  }
}

function typeOf(o){
	var type = typeof o;
         //If typeof return something different than object then returns it.
	if (type !== 'object') {
		return type;
         //If it is an instance of the Array then return "array"
	} else if (Object.prototype.toString.call(o) === '[object Array]') {
		return 'array';
         //If it is null then return "null"
	} else if (o === null) {
		return 'null';
       //if it gets here then it is an "object"
	} else {
		return 'object';
	}
}


// this is an example of a linear kernel between tow arrays
function jsmine_linear_kernel(a /* jsmine_simple_data*/, b /* jsmine_simple_data*/){
  validArgs(2, ['object','object']);
  var value = 0;
  for(var i = 0; i < a.data.length; i++){
    value += (a.data[i] * b.data[i]);
  }
  return value;
}

function jsmine_simple_label(a /** jsmine_simple_data **/){
  return a.label;
}

function JSMineSimpleData(a, label){
  validArgs(2, ['array','boolean']);
  this.data = a;
  this.label = label;
}

