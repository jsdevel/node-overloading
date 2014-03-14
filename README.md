overloading
======================
Define overloads for any function!  Errors are thrown if no matching overload is
found for arguments.

##Example
````javascript
var overload = require('overload');
var fooOverloads = overload([
  [Function],
  [String, String]
]); 

function foo(one, two){
  var strategy = fooOverloads.handle(arguments);
  switch(strategy){
    case 0:one();break;
    case 1:console.log(one + two);break;
  }
}
````
