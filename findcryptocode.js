const crypto = require('crypto');

const secret = 'QOEleBBfS9mOqyITsN6M6w';
const timestamp = '1759468460'; // 11:41 AM UTC, October 02, 2025
const payload = '{"event":"meeting.started","payload":{"account_id":"account123","object":{"uuid":"meeting-uuid-123456","id":123456789,"host_id":"host123","topic":"Test Meeting","type":2,"start_time":"2025-10-02T16:41:00Z","duration":60,"timezone":"UTC"},"event_ts":1759468460000}';
const message = `v0:${timestamp}:${payload}`;
const hash = crypto.createHmac('sha256', secret).update(message).digest('hex');
console.log(`v0=${hash}`);