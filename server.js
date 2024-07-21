import 'dotenv/config';
import bodyParser from 'body-parser';
import cacheMiddleware from './middleware/cacheMiddleware.js';
import express from 'express';
import redisClient from './utils/redisClient.js';
import summonerRouter from './routes/summoner.js';

const app = express();
const port = 3001;

app.use(express.json());
// Cache middleware
app.use(cacheMiddleware);
app.use('/api/summoner', summonerRouter);
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Connect to Redis
(async () => {
	try {
	  await redisClient.connect();
	  console.log('Connected to Redis');
	} catch (err) {
	  console.error('Redis connection error:', err);
	}
})();
