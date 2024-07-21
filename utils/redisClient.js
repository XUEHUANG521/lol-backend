import redis from 'redis';

//setup redis
const redisClient = redis.createClient(
  process.env.REDIS_URL || 'redis://127.0.0.1:6379'
);

redisClient.on('error', (err) => {
  console.log('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis connected');
});

export default redisClient;
