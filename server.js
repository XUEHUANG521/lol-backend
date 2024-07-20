import 'dotenv/config';
import express from 'express';
import summonerRouter from './routes/summoner.js';

const app = express();
const port = 3001;

app.use(express.json());

app.use('/api/summoner', summonerRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
