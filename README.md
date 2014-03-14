overloading
======================
Define complex overloads for functions!  Errors are thrown if no matching overload
is found.

##Example
````javascript
var overloading = require('overloading');
var fooOverloads = overloading([
  [Function],
  [String, String]
]); 

function foo(one, two){
  switch(fooOverloads.find(arguments)){
    case 0:one();break;
    case 1:console.log(one + ' ' + two);break;
  }
}

foo('hello', 'world!');
//prints "hello world!"
foo(foo.bind(null, 'say', 'what?'));
//prints "say what?"
````
