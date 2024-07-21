import redisClient from '../utils/redisClient.js';

const cacheMiddleware = async (req, res, next) => {
  const cacheKey = req.originalUrl;
  try {
    const cachedResponse = await redisClient.get(cacheKey);

    if (cachedResponse) {
      return res.json(JSON.parse(cachedResponse));
    } else {
      const originalSend = res.send.bind(res);

      res.send = (body) => {
        const responseBody = typeof body === 'object' ? JSON.stringify(body) : body;
        redisClient.set(cacheKey, responseBody, 'EX', 3600);
        originalSend(body);
      };

      next();
    }
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    next();
  }
};

export default cacheMiddleware;
