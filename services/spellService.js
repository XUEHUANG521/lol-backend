import fetch from 'node-fetch';

async function getSummonerSpells() {
  const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/14.14.1/data/en_US/summoner.json`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

async function getSpellsDetails(spellIds) {
  try {
    const allSpells = await getSummonerSpells();
    const spellDetails = spellIds.map(id => {
      for (let key in allSpells.data) {
        if (allSpells.data[key].key == id) {
          return {
            id,
            name: allSpells.data[key].name,
            description: allSpells.data[key].description,
            imageUrl: `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/spell/${allSpells.data[key].image.full}`
          };
        }
      }
    });
    return spellDetails;
  } catch (error) {
    console.error('Error fetching spell details:', error);
  }
}

export default { getSpellsDetails };
