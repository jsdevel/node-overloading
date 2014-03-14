overloading
======================
Define overloads for any function!  Errors are thrown if no matching overload is
found for arguments.

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
    case 1:console.log(one + two);break;
  }
}
````
