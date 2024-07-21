import httpClient from '../utils/httpClient.js';
import regionClusterMap from '../utils/regionClusterMap.js';
import redisClient from '../utils/redisClient.js';

/**
 * Retrieves the league information for a given summoner ID in a specific region.
 *
 * @param {string} summonerId - The ID of the summoner.
 * @param {string} region - The region in which the summoner is playing.
 * @return {Promise<Object>} The league information for the summoner.
 */
async function getLeagueBySummonerId(summonerId, region) {
  const redisKey = `league-${region}-${summonerId}`;
  let leagueData = await redisClient.get(redisKey);
  if (leagueData) {
    return JSON.parse(leagueData);
  }
	const leagueUrl = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;
	const leagueResponse = await httpClient.get(leagueUrl);
  await redisClient.set(redisKey, JSON.stringify(leagueResponse.data), 'EX', 3600);
	return leagueResponse.data;
}

/**
 * Retrieves summoner information by Riot ID.
 *
 * @param {string} gameName - The game name of the summoner.
 * @param {string} tagLine - The tag line of the summoner.
 * @param {string} region - The region of the summoner.
 * @return {Promise} The summoner data retrieved from the API.
 */
async function getSummonerByRiotId(gameName, tagLine, region) {
  const redisKey = `summoner-${region}-${gameName}-${tagLine}`;
  let summonerData = await redisClient.get(redisKey);
  if (summonerData) {
    return JSON.parse(summonerData);
  }

  const cluster = regionClusterMap[region.toLowerCase()];
  const riotIdUrl = `https://${cluster}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
  const riotIdResponse = await httpClient.get(riotIdUrl);
  await redisClient.set(redisKey, JSON.stringify(riotIdResponse.data), 'EX', 3600);
  return riotIdResponse.data;
}

/**
 * Retrieves summoner information by puuid.
 *
 * @param {string} puuid - The puuid of the summoner.
 * @param {string} region - The region of the summoner.
 * @return {Promise} The summoner data retrieved from the API.
 */
async function getSummonerByPuuid(puuid, region) {
  const redisKey = `summoner-${region}-${puuid}`;
  let summonerData = await redisClient.get(redisKey);
  if (summonerData) {
    return JSON.parse(summonerData);
  }

  const summonerUrl = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
  const summonerResponse = await httpClient.get(summonerUrl);
  await redisClient.set(redisKey, JSON.stringify(summonerResponse.data), 'EX', 3600);
  return summonerResponse.data;
}

/**
 * Retrieves match history for a player identified by their puuid.
 *
 * @param {string} puuid - The unique identifier of the player.
 * @param {string} cluster - The server cluster where the player's data is located.
 * @param {number} count - The number of matches to retrieve.
 * @param {number} [count=1] - The number of matches to retrieve (default is 1).
 * @return {Promise} The match history data retrieved from the API.
 */
async function getMatchHistory(puuid, cluster, count = 1) {
  const redisKey = `matchHistory-${cluster}-${puuid}-${count}`;
  let matchHistory = await redisClient.get(redisKey);
  if (matchHistory) {
    return JSON.parse(matchHistory);
  }

  const matchUrl = `https://${cluster}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`;
  const matchResponse = await httpClient.get(matchUrl);
  await redisClient.set(redisKey, JSON.stringify(matchResponse.data), 'EX', 3600);
  return matchResponse.data;
}

/**
 * Retrieves the details of a match from the Riot API.
 *
 * @param {string} matchId - The ID of the match to retrieve.
 * @param {string} cluster - The server cluster where the match data is located.
 * @return {Promise<Object>} A Promise that resolves to the match details data.
 */
async function getMatchDetails(matchId, cluster) {
  const redisKey = `matchDetails-${cluster}-${matchId}`;
  let matchDetails = await redisClient.get(redisKey);
  if (matchDetails) {
    return JSON.parse(matchDetails);
  }

  const matchDetailsUrl = `https://${cluster}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
  const matchDetailsResponse = await httpClient.get(matchDetailsUrl);
  await redisClient.set(redisKey, JSON.stringify(matchDetailsResponse.data), 'EX', 3600);
  return matchDetailsResponse.data;
}

export {
  getSummonerByRiotId,
  getSummonerByPuuid,
  getLeagueBySummonerId,
  getMatchHistory,
  getMatchDetails
};
