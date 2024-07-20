import axios from 'axios';
import regionClusterMap from '../utils/regionClusterMap.js';

const apiKey = process.env.RIOT_API_KEY;

/**
 * Retrieves the league information for a given summoner ID in a specific region.
 *
 * @param {string} summonerId - The ID of the summoner.
 * @param {string} region - The region in which the summoner is playing.
 * @return {Promise<Object>} The league information for the summoner.
 */
async function getLeagueBySummonerId(summonerId, region) {
	const leagueUrl = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${apiKey}`;
	const leagueResponse = await axios.get(leagueUrl);
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
  const cluster = regionClusterMap[region.toLowerCase()];
  const riotIdUrl = `https://${cluster}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${apiKey}`;
  const riotIdResponse = await axios.get(riotIdUrl);
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
  const summonerUrl = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`;
  const summonerResponse = await axios.get(summonerUrl);
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
async function getMatchHistory(puuid, cluster, count) {
  const matchUrl = `https://${cluster}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}&api_key=${apiKey}`;
  const matchResponse = await axios.get(matchUrl);
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
  const matchDetailsUrl = `https://${cluster}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}`;
  const matchDetailsResponse = await axios.get(matchDetailsUrl);
  return matchDetailsResponse.data;
}

export {
  getSummonerByRiotId,
  getSummonerByPuuid,
  getLeagueBySummonerId,
  getMatchHistory,
  getMatchDetails
};
