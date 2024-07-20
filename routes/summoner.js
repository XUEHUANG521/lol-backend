import express from 'express';
import { getSummonerById } from '../controllers/summonerController.js';

const router = express.Router();

router.post("/by-riot-id", getSummonerById);

export default router;
