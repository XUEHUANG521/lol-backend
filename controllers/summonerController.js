import { getLeagueBySummonerId, getMatchDetails, getMatchHistory, getSummonerByPuuid, getSummonerByRiotId } from '../services/riotApiService.js';
import regionClusterMap from '../utils/regionClusterMap.js';
import extractMatchData from '../utils/matchDataExtractor.js';

/**
 * Retrieves summoner data by ID and fetches associated match details for a given region.
 *
 * @param {Object} req - The request object containing gameName, tagLine, and region.
 * @param {Object} res - The response object.
 * @return {Promise} The summoner data, league entries, and match data in the response.
 */
export async function getSummonerById(req, res) {
  const { gameName, tagLine, region } = req.body;

  if (!gameName || !tagLine || !region) {
    return res.status(400).json({ error: "Game name, tag line, and region are required" });
  }

  try {
    const riotIdData = await getSummonerByRiotId(gameName, tagLine, region);
    const summonerData = await getSummonerByPuuid(riotIdData.puuid, region);
    const leagueEntries = await getLeagueBySummonerId(summonerData.id, region);
    const cluster = regionClusterMap[region.toLowerCase()];
    const matchHistory = await getMatchHistory(riotIdData.puuid, cluster, 1);
    const matchDetailsPromises = matchHistory.map(matchId => getMatchDetails(matchId, cluster));
    const matchDetailsResponses = await Promise.all(matchDetailsPromises);
    const matchDetails = matchDetailsResponses.map(response => response);

    const uiData = matchDetails.map(matchData => extractMatchData(matchData));
    res.json({
      summonerData,
      leagueEntries,
      matchData: uiData
    });

  } catch (error) {
    console.error('Error fetching data:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
