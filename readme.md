# bragg-kinesis [![Build Status](https://travis-ci.org/SamVerschueren/bragg-kinesis.svg?branch=master)](https://travis-ci.org/SamVerschueren/bragg-kinesis)

> Kinesis stream middleware for [bragg](https://github.com/SamVerschueren/bragg).

This little piece of middleware makes it possible to handle Kinesis stream events as if they where normal requests.


## Install

```
$ npm install bragg-kinesis
```


## Usage

```js
const app = require('bragg')();
const router = require('bragg-router')();
const kinesis = require('bragg-kinesis');

// Listen for events in the `StreamName` and `StreamNameDev` topic
router.post('kinesis:StreamName', ctx => {
	console.log(ctx.request.body);
	//=> ['foo', 'bar']
});

app.use(kinesis({StreamNameDev: 'StreamName'}));
app.use(router.routes());

exports.handler = app.listen();
```

The `kinesis:` prefix is attached by this module and is followed by the name of the stream that originated the event. The messages of the event is provided in the `body` property of the `request` object.


## API

### kinesis([options])

#### options

Type: `object`

Map a stream name to another name.


## License

MIT © [Sam Verschueren](http://github.com/SamVerschueren)
