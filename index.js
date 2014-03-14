'use strict';

module.exports = overloading;

var assert = require('assert');
var overloaded = {};

function overloading(array){
  var description;
  ensureArray(array);
  array.forEach(ensureArray);
  description = JSON.stringify(array, friendlyJSONReplacer);

  if(description in overloaded)return overloaded[description];
  else return overloaded[description] = new Overload(array, description);
}



function friendlyJSONReplacer(key, value){
  if(typeof value === void 0){
    return 'undefined';
  } else if(value === null){
    return 'null';
  } else if(typeof value === 'function'){
    if(/[A-Z]/.test(value.name))return value.name;
    else return 'function';
  } else if(typeof value === 'object'){
    return value;
  } else {
    return typeof value;
  }
}


function ensureArray(array){
  assert(Array.isArray(array));  
}

function Overload(array, description){
  this.strategySets = {};
  this.description = description;
  this.strategies = array;
  array.forEach(fill.bind(null, this.strategySets));
}
Overload.prototype.describe = function(){
  return this.description;
};
Overload.prototype.find = function(array){
  var length = array.length;
  array = [].slice.call(array);

  if(length in this.strategySets){
    return this.strategySets[length].find(array);
  }

  throw new Error('No strategy set was found for '+length+' argument[s].');
};

//helpers
function fill(strategySets, strategy, index){
  var length = strategy.length;
  var set;

  if(length in strategySets)
    set = strategySets[length];
  else
    set = strategySets[length] = new StrategySet(length);

  set.add(new Strategy(strategy, index));
}

function StrategySet(length){
  this.length = length;
  this.strategies = [];
}
StrategySet.prototype.find = function(args){
  var index;
  this.strategies.forEach(function(strategy){
    if(strategy.test(args))index = strategy.index;
  });
  if(index === void 0)throw new Error(
    'No matching overload was found for: '
    + JSON.stringify(args, friendlyJSONReplacer)
  );
  return index;
};
StrategySet.prototype.add = function(strategy){
  this.strategies.push(strategy);
};


function Strategy(strategy, index){
  this.assertions = [];
  this.index = index;
  convert(strategy, this.assertions);
}
Strategy.prototype.test = function(args){
  return args.length === args.filter(this.hasMatching.bind(this)).length;
};
Strategy.prototype.hasMatching = function(val){
  return !!this.assertions.filter(doAssert.bind(null, val)).length;
};

function doAssert(val, assertion){
  return assertion(val);
}

function convert(strategy, tests){
  strategy.forEach(function(val){
    var t;
    if     (val === null     )t = nullAssertion;
    else if(val === undefined)t = undefinedAssertion;
    else if(val === String   )t = stringAssertion;
    else if(val === Number   )t = numberAssertion;
    else if(val === Object   )t = numberAssertion;
    else switch(typeof val){
      case 'string':t = stringAssertion;break;
      case 'number':t = numberAssertion;break;
      case 'object':
        if (Array.isArray(val))   t = Array.isArray;
        else if (val instanceof RegExp)t = instanceofAssertion.bind(null, RegExp);
        else if (val instanceof Object)t = instanceofAssertion.bind(null, Object);
        break;
      case 'function':
        if(/[A-Z]/.test(val.name))t = instanceofAssertion.bind(null, val);
        else t = functionAssertion;
        break;
    }
    if(!t)throw new Error('Unknown type for '+val);
    tests.push(t);
  });
}

//assertions
function functionAssertion(val){
  return typeof val === 'function';
}
function instanceofAssertion(Clazz, instance){
  return instance instanceof Clazz;
}
function nullAssertion(val){
  return val === null;
}
function numberAssertion(val){
  return typeof val === 'number' || val instanceof Number;
}
function stringAssertion(val){
  return typeof val === 'string' || val instanceof String;
}
function undefinedAssertion(val){
  return val === void 0;
}
