describe('Service: PromiseWaterfall', function () {
  var $rootScope,
      $q,
      PromiseWaterfall;

  beforeEach(function () {
    module('ngPromiseWaterfall');

    inject(function (_$rootScope_, _$q_, _PromiseWaterfall_) {
      $rootScope = _$rootScope_;
      $q = _$q_;
      PromiseWaterfall = _PromiseWaterfall_;
    });
  });
  
  it('Should call each method in sequence as each promise resolves, then call onWaterfallSuccess', function () {
    var promises = [],
        firstMethod,
        secondMethod,
        onWaterfallSuccess,
        onWaterfallError;

    for (var promiseCount=0;promiseCount<2;promiseCount++) {
      promises.push($q.defer());
    }

    firstMethod = jasmine.createSpy('firstMethod').and.returnValue(promises[0].promise);
    secondMethod = jasmine.createSpy('secondMethod').and.returnValue(promises[1].promise);

    onWaterfallSuccess = jasmine.createSpy('onWaterfallSuccess');
    onWaterfallError = jasmine.createSpy('onWaterfallError');

    new PromiseWaterfall([
      firstMethod,
      secondMethod
    ])
    .then(onWaterfallSuccess)
    .catch(onWaterfallError);

    expect(firstMethod).toHaveBeenCalled();
    expect(secondMethod).not.toHaveBeenCalled();
    expect(onWaterfallSuccess).not.toHaveBeenCalled();
    expect(onWaterfallError).not.toHaveBeenCalled();

    promises[0].resolve();
    $rootScope.$apply();

    expect(firstMethod).toHaveBeenCalled();
    expect(secondMethod).toHaveBeenCalled();
    expect(onWaterfallSuccess).not.toHaveBeenCalled();
    expect(onWaterfallError).not.toHaveBeenCalled();

    promises[1].resolve();
    $rootScope.$apply();

    expect(firstMethod).toHaveBeenCalled();
    expect(secondMethod).toHaveBeenCalled();
    expect(onWaterfallSuccess).toHaveBeenCalled();
    expect(onWaterfallError).not.toHaveBeenCalled();
  });

  it('Should reject the first promise and fallback to onWaterfallError', function () {
    var promises = [],
        firstMethod,
        secondMethod,
        onWaterfallSuccess,
        onWaterfallError;

    for (var promiseCount=0;promiseCount<2;promiseCount++) {
      promises.push($q.defer());
    }

    firstMethod = jasmine.createSpy('firstMethod').and.returnValue(promises[0].promise);
    secondMethod = jasmine.createSpy('secondMethod').and.returnValue(promises[1].promise);

    onWaterfallSuccess = jasmine.createSpy('onWaterfallSuccess');
    onWaterfallError = jasmine.createSpy('onWaterfallError');

    new PromiseWaterfall([
      firstMethod,
      secondMethod
    ])
    .then(onWaterfallSuccess)
    .catch(onWaterfallError);

    expect(firstMethod).toHaveBeenCalled();
    expect(secondMethod).not.toHaveBeenCalled();
    expect(onWaterfallSuccess).not.toHaveBeenCalled();
    expect(onWaterfallError).not.toHaveBeenCalled();

    promises[0].reject();
    $rootScope.$apply();

    expect(firstMethod).toHaveBeenCalled();
    expect(secondMethod).not.toHaveBeenCalled();
    expect(onWaterfallSuccess).not.toHaveBeenCalled();
    expect(onWaterfallError).toHaveBeenCalled();
  });

it('Should resolve the first promise and reject the second, then fallback to onWaterfallError', function () {
    var promises = [],
        firstMethod,
        secondMethod,
        onWaterfallSuccess,
        onWaterfallError;

    for (var promiseCount=0;promiseCount<2;promiseCount++) {
      promises.push($q.defer());
    }

    firstMethod = jasmine.createSpy('firstMethod').and.returnValue(promises[0].promise);
    secondMethod = jasmine.createSpy('secondMethod').and.returnValue(promises[1].promise);

    onWaterfallSuccess = jasmine.createSpy('onWaterfallSuccess');
    onWaterfallError = jasmine.createSpy('onWaterfallError');

    new PromiseWaterfall([
      firstMethod,
      secondMethod
    ])
    .then(onWaterfallSuccess)
    .catch(onWaterfallError);

    expect(firstMethod).toHaveBeenCalled();
    expect(secondMethod).not.toHaveBeenCalled();
    expect(onWaterfallSuccess).not.toHaveBeenCalled();
    expect(onWaterfallError).not.toHaveBeenCalled();

    promises[0].resolve();
    $rootScope.$apply();

    expect(firstMethod).toHaveBeenCalled();
    expect(secondMethod).toHaveBeenCalled();
    expect(onWaterfallSuccess).not.toHaveBeenCalled();
    expect(onWaterfallError).not.toHaveBeenCalled();

    promises[1].reject();
    $rootScope.$apply();

    expect(firstMethod).toHaveBeenCalled();
    expect(secondMethod).toHaveBeenCalled();
    expect(onWaterfallSuccess).not.toHaveBeenCalled();
    expect(onWaterfallError).toHaveBeenCalled();
  });

  it('Should return a rejected promise if an array is not passed', function () {
    var promises = [],
        firstMethod,
        secondMethod,
        onWaterfallSuccess,
        onWaterfallError;

    for (var promiseCount=0;promiseCount<2;promiseCount++) {
      promises.push($q.defer());
    }

    firstMethod = jasmine.createSpy('firstMethod').and.returnValue(promises[0].promise);
    secondMethod = jasmine.createSpy('secondMethod').and.returnValue(promises[1].promise);

    onWaterfallSuccess = jasmine.createSpy('onWaterfallSuccess');
    onWaterfallError = jasmine.createSpy('onWaterfallError');

    new PromiseWaterfall(firstMethod, secondMethod)
      .then(onWaterfallSuccess)
      .catch(onWaterfallError);

    $rootScope.$apply();

    expect(onWaterfallSuccess).not.toHaveBeenCalled();
    expect(onWaterfallError).toHaveBeenCalled();
  });

  it('Should return a rejected promise if the first element of the array is not a function', function () {
    var onWaterfallSuccess,
        onWaterfallError;

    onWaterfallSuccess = jasmine.createSpy('onWaterfallSuccess');
    onWaterfallError = jasmine.createSpy('onWaterfallError');

    new PromiseWaterfall([ 1, 2 ])
      .then(onWaterfallSuccess)
      .catch(onWaterfallError);

    $rootScope.$apply();

    expect(onWaterfallSuccess).not.toHaveBeenCalled();
    expect(onWaterfallError).toHaveBeenCalled();
  });

  it('Should return a resolved promise ther array only has one element', function () {
    var deferred,
        firstMethod,
        onWaterfallSuccess,
        onWaterfallError;

    deferred = $q.defer();

    firstMethod = jasmine.createSpy('firstMethod').and.returnValue(deferred.promise);

    onWaterfallSuccess = jasmine.createSpy('onWaterfallSuccess');
    onWaterfallError = jasmine.createSpy('onWaterfallError');

    new PromiseWaterfall([ firstMethod ])
      .then(onWaterfallSuccess)
      .catch(onWaterfallError);

    deferred.resolve();
    $rootScope.$apply();

    expect(onWaterfallSuccess).toHaveBeenCalled();
    expect(onWaterfallError).not.toHaveBeenCalled();
  });

  it('Should return a rejected promise if the only element of the array is not a function', function () {
    var onWaterfallSuccess,
        onWaterfallError;

    onWaterfallSuccess = jasmine.createSpy('onWaterfallSuccess');
    onWaterfallError = jasmine.createSpy('onWaterfallError');

    new PromiseWaterfall([ 1 ])
      .then(onWaterfallSuccess)
      .catch(onWaterfallError);

    $rootScope.$apply();

    expect(onWaterfallSuccess).not.toHaveBeenCalled();
    expect(onWaterfallError).toHaveBeenCalled();
  });

  fit('Should return a return promise if first function does not return a promise', function () {
    var firstMethod,
        onWaterfallSuccess,
        onWaterfallError;

    firstMethod = jasmine.createSpy('firstMethod').and.returnValue('not a promise');

    onWaterfallSuccess = jasmine.createSpy('onWaterfallSuccess');
    onWaterfallError = jasmine.createSpy('onWaterfallError');

    new PromiseWaterfall([ firstMethod ])
      .then(onWaterfallSuccess)
      .catch(onWaterfallError);

    $rootScope.$apply();

    expect(onWaterfallSuccess).toHaveBeenCalled();
    expect(onWaterfallError).not.toHaveBeenCalled();
  });
  
  it('Should return a rejected promise if a function does not return a promise', function () {
    var deferred,
        firstMethod,
        secondMethod,
        onWaterfallSuccess,
        onWaterfallError;

    deferred = $q.defer();

    firstMethod = jasmine.createSpy('firstMethod').and.returnValue(deferred.promise);
    secondMethod = jasmine.createSpy('secondMethod').and.returnValue(true);

    onWaterfallSuccess = jasmine.createSpy('onWaterfallSuccess');
    onWaterfallError = jasmine.createSpy('onWaterfallError');

    new PromiseWaterfall(firstMethod, secondMethod)
      .then(onWaterfallSuccess)
      .catch(onWaterfallError);

    deferred.resolve();
    $rootScope.$apply();

    expect(onWaterfallSuccess).not.toHaveBeenCalled();
    expect(onWaterfallError).toHaveBeenCalled();
  });
});
