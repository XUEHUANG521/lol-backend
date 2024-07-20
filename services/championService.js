import fetch from 'node-fetch';

/**
 * Retrieves the champion data for a specific champion based on the champion name.
 *
 * @param {string} championName - The name of the champion to fetch data for.
 * @return {object} The data object for the specified champion.
 */
async function getChampionData(championName) {
  const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/12.18.1/data/en_US/champion/${championName}.json`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  return data.data[championName];
}

/**
 * Retrieves the image URL for a specific champion based on the champion name.
 *
 * @param {string} championName - The name of the champion to fetch the image for.
 * @return {string} The URL of the champion's image.
 */
async function getChampionImage(championName) {
  try {
    const championData = await getChampionData(championName);
    const imageUrl = `https://ddragon.leagueoflegends.com/cdn/12.18.1/img/champion/${championData.image.full}`;
    return imageUrl;
  } catch (error) {
    console.error('Error fetching champion data:', error);
  }
}

export default { getChampionData, getChampionImage };
