import test from 'ava';
import loadJsonFile from 'load-json-file';
import m from './';

const fixture1 = loadJsonFile.sync('./fixtures/multi-source.json');
const fixture2 = loadJsonFile.sync('./fixtures/dynamodb-event.json');
const fixture3 = loadJsonFile.sync('./fixtures/event.json');
const fixture4 = loadJsonFile.sync('./fixtures/json-event.json');

function fn(t, event, opts) {
	const ctx = Object.assign({}, {req: event}, t.context.ctx);
	m(opts)(ctx);
	return ctx;
}

test.beforeEach(t => {
	t.context.ctx = {
		request: {},
		throw: (code, msg) => {
			throw new Error(`${code} - ${msg}`);
		}
	};
});

test('error', t => {
	t.throws(() => fn(t, fixture1), '400 - Can not process different stream names');
});

test('do nothing if it\'s not a Kinesis event', t => {
	const result = fn(t, fixture2);
	t.falsy(result.request.body);
	t.falsy(result.path);
	t.falsy(result.method);
});

test('result', t => {
	const result = fn(t, fixture3);
	t.is(result.path, 'kinesis:FooStream');
	t.is(result.method, 'post');
	t.deepEqual(result.request.body, ['Hello, this is a test 123.']);
});

test('json result', t => {
	const result = fn(t, fixture4);
	t.deepEqual(result.request.body, [
		{
			foo: 'bar'
		},
		{
			unicorn: 'rainbow'
		}
	]);
});

test('path mapping', t => {
	t.is(fn(t, fixture3, {FooStream: 'Foo'}).path, 'kinesis:Foo');
});
