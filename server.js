import 'dotenv/config';
import bodyParser from 'body-parser';
import cacheMiddleware from './middleware/cacheMiddleware.js';
import cors from 'cors';
import express from 'express';
import redisClient from './utils/redisClient.js';
import summonerRouter from './routes/summoner.js';

const app = express();
const port = 3001;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
// Cache middleware
app.use(cacheMiddleware);
app.use('/api/summoner', summonerRouter);

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
