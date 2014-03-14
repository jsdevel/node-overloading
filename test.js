'use strict';

describe('overloading', function(){
  var sut = require('./');
  var assert = require('assert');

  it('it is a function', function(){
    sut([]);
  });

  it('expects an array', function(){
    assert.throws(function(){
      sut(); 
    });
  });

  it('expects an array of arrays', function(){
    assert.throws(function(){
      sut([4]);
    });
  });


  it('allows all types', function(){
    var overloaded = sut([
      [function(){}, 'asdf', null, 5, void 0, {}, []]
    ]);
  });

  it('returns an Overload object', function(){
    var overload = sut([['asdf', function(){}]]);
    overload.describe().should.equal('[["string","function"]]');
    overload.handle.should.be.type('function');
  });

  describe('Overload', function(){
    var overload;
    beforeEach(function(){
      overload = sut([
        [String, Function],
        [String],
        [RegExp, Function],
        [Number, Array],
        [Date],
        []
      ]);
    });

    it('can be called multiple times with the same arguments', function(){
      sut([]);
      sut([]);
    });

    describe('#handle', function(){
      it('fails if the arguments have no description', function(){
        assert.throws(function(){
          overload.handle();
        });
      });

      it('can succeed', function(){
        overload.handle({0:'asdf', 1:setTimeout, length: 2}).should.equal(0);
        overload.handle(['asdf', new Function()]).should.equal(0);
        overload.handle(['asdf']).should.equal(1);
        overload.handle([new String(5)]).should.equal(1);
        overload.handle([/asdf/, function(){}]).should.equal(2);
        overload.handle([3, []]).should.equal(3);
        overload.handle([new Date()]).should.equal(4);
        overload.handle([]).should.equal(5);
      });
    });
  });
});
