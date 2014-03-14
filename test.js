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
    overload.find.should.be.type('function');
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

    describe('#find', function(){
      it('fails if the arguments have no description', function(){
        assert.throws(function(){
          overload.find();
        });
      });

      it('can succeed', function(){
        overload.find({0:'asdf', 1:setTimeout, length: 2}).should.equal(0);
        overload.find(['asdf', new Function()]).should.equal(0);
        overload.find(['asdf']).should.equal(1);
        overload.find([new String(5)]).should.equal(1);
        overload.find([/asdf/, function(){}]).should.equal(2);
        overload.find([3, []]).should.equal(3);
        overload.find([new Date()]).should.equal(4);
        overload.find([]).should.equal(5);
      });
    });
  });
});
