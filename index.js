'use strict';
module.exports = opts => {
	opts = opts || {};

	return ctx => {
		if (!ctx.path && ctx.req.Records && ctx.req.Records.length > 0 && ctx.req.Records[0].eventSource === 'aws:kinesis') {
			const first = ctx.req.Records[0];
			const streamName = first.eventSourceARN.split('/').pop();

			const messages = ctx.req.Records.map(record => {
				if (first.eventSourceARN !== record.eventSourceARN) {
					ctx.throw(400, 'Can not process different stream names');
				}

				const data = Buffer.from(record.kinesis.data, 'base64').toString('utf8');

				try {
					return JSON.parse(data);
				} catch (err) {
					return data;
				}
			});

			ctx.request.body = messages;
			Object.defineProperty(ctx, 'path', {enumerable: true, value: `kinesis:${(opts[streamName] || streamName)}`});
			Object.defineProperty(ctx, 'method', {enumerable: true, value: 'post'});
		}
	};
};
