import { createClient } from 'redis';

const redis = createClient();

redis.on('error', (err: any) => console.log('Redis Client Error', err));

(async function startRedis() {
	await redis.connect();
})()

export { redis }