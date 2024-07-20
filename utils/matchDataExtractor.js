function extractMatchData(matchData) {
	const matchSummary = {
	  gameMode: matchData.info.gameMode,
	  duration: matchData.info.gameDuration,
	  result: matchData.info.teams[0].win ? 'Win' : 'Loss'
	};
  
	const playerStats = matchData.info.participants.map(participant => ({
	summonerName: participant.summonerName,
	champion: participant.championName,
	kda: `${participant.kills}/${participant.deaths}/${participant.assists}`,
	cs: participant.totalMinionsKilled + participant.neutralMinionsKilled,
	csPerMinute: (participant.totalMinionsKilled + participant.neutralMinionsKilled) / (matchData.info.gameDuration / 60),
	goldEarned: participant.goldEarned,
	items: [
		participant.item0,
		participant.item1,
		participant.item2,
		participant.item3,
		participant.item4,
		participant.item5,
		participant.item6
	],
	runes: participant.perks.styles,
	spells: [participant.summoner1Id, participant.summoner2Id],
	damageDealt: participant.totalDamageDealtToChampions,
	damageTaken: participant.totalDamageTaken
	}));
	return { matchSummary, playerStats };
}

export default extractMatchData;
  