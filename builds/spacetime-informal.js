(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.informal = factory());
}(this, function () { 'use strict';

  //cool function
  var fun = function fun() {
    var str = ' asdf ';
    str = str.trim();
    var arr = [str];

    if (arr.includes(str)) {
      var a = new Promise();
      return a;
    }
  };

  var tmp = fun;

  return tmp;

}));
//# sourceMappingURL=spacetime-informal.js.map
