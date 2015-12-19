(function (ng) {
  'use strict';

  ng.module('ngPromiseWaterfall')
    .factory('PromiseWaterfall', PromiseWaterfall);

  /* @ngInject */
  function PromiseWaterfall ($q) {
    function PromiseWaterfallFunc (list) {
      var self = this,
        _reducedList;

      // malformed argument
      list = Array.prototype.slice.call(list);

      if (!ng.isArray(list) || !ng.isFunction(list.reduce) || list.length < 1) {
        return $q.reject("Array with reduce function is needed.");
      }

      if (list.length === 1) {
        if (!ng.isFunction(list[0])) {
          return $q.reject("First element of the array should be a function, got " + typeof list[0]);
        }

        return $q.resolve(list[0]());
      }

      return list.reduce(function(l, r) {
        var lret,
          isFirst = (l === list[0]);

        // first round
        // execute function and return promise
        if (isFirst) {
          if (!ng.isFunction(l)) {
            return $q.reject("List elements should be function to call.");
          }

          lret = l();

          if (!_isPromise(lret)) {
            return $q.reject("Function return value should be a promise.");
          } else {
            return lret.then(r);
          }
        } else {
          // other rounds
          // l is a promise now
          // priviousPromiseList.then(nextFunction)
          if (!_isPromise(l)) {
            $q.reject("Function return value should be a promise.");
          } else {
            return l.then(r);
          }
        }
      });

      function _isPromise(obj) {
        return obj && ng.isFunction(obj.then);
      }
    }

    return (PromiseWaterfallFunc);
  }
})(angular);
