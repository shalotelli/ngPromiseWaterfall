# Angular PromiseWaterfall

This Angular PromiseWaterfall service is a wrapper for the great [npm package Promise Waterfall](https://github.com/dotSlashLu/promise-waterfall) by [@dotslashlu](https://twitter.com/dotslashlu). It accepts an array of promises, running them in sequence by passing the resolved data to the next promise in the sequence. The return value is the last promise in the sequence.

This is different to Angulars `$q.all()` method as it resolves the promises sequentially rather than concurrently.

## Usage

```javascript
new PromiseWaterfall([
  firstMethod,
  secondMethod
])
.then(onWaterfallSuccess)
.catch(onWaterfallError);

function firstMethod () {
  return $q.when();
}

function secondMethod () {
  return $q.when();
}

function onWaterfallSuccess (result) {
  // do something
}

function onWaterfallError (error) {
  $log.error(error);
}
```

## Development

### Installation

1. Run `npm install`
2. Run `bower install`

### Test

- Run `npm test` or `gulp test`

### Build

- Run `gulp build`
