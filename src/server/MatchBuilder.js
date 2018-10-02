const MatchData = require('./MatchData.js');

const getParticipantId = function (matchData, summonerId) {
    const identity = matchData.participantIdentities.find(identity => {
        const player = identity.player;
        return player.summonerId === summonerId;
    });
    return identity.participantId;
}

const getParticipant = function (matchData, participantId) {
    return matchData.participants.find(participant => participant.participantId === participantId);
}

const getRune = function(matchRune, runes) {
    return runes.find(rune => rune.id === matchRune.id);
}

const setRuneData = function(matchRune, rune){
    matchRune.name = rune.name;
    matchRune.image = rune.icon;
    return rune;
}

const processRune = function(matchRune, runes) {
    return setRuneData(matchRune, getRune(matchRune, runes));
}

const processSecondaryRune = function(matchRune, secondaryStyle){
    let rune = getRune(matchRune, secondaryStyle.slots[1].runes);
    if(rune) return setRuneData(matchRune, rune);
    rune =  getRune(matchRune, secondaryStyle.slots[2].runes);
    if(rune) return setRuneData(matchRune, rune);
    rune =  getRune(matchRune, secondaryStyle.slots[3].runes);
    if(rune) return setRuneData(matchRune, rune);
}

module.exports = class MatchBuilder {
    constructor(leagueJs, version, items, champions, spells, runes){
        this.leagueJs = leagueJs;
        this.version = version;
        this.items = items;
        this.champions = champions;
        this.spells = spells;
        this.runes = runes;
    }

    buildMatch(gameId, summonerId) {
        const match = new MatchData(gameId);
        let matchData = null;
        return this.leagueJs.Match.gettingById(gameId).then(data => {
            matchData = data;
            const participantId = getParticipantId(matchData, summonerId);
            const participant = getParticipant(matchData, participantId);
            const stats = participant.stats;

            match.version = this.version;

            match.victory = stats.win;
            match.gameLength = matchData.gameDuration;

            // champion
            match.champion.id = participant.championId;
            const key = Object.keys(this.champions.data).find(key => this.champions.data[key].id === match.champion.id);
            const champion = this.champions.data[key];
            match.champion.name = champion.name;
            match.champion.image = champion.image.full;

            match.kills = stats.kills;
            match.deaths = stats.deaths;
            match.assists = stats.assists;

            match.championLvl = stats.champLevel;
            match.creepScore = stats.totalMinionsKilled + stats.neutralMinionsKilled;

            // spells
            match.spells[0].id = participant.spell1Id;
            match.spells[1].id = participant.spell2Id;
            match.spells.forEach(matchSpell => {
                const key = Object.keys(this.spells.data).find(key => this.spells.data[key].id === matchSpell.id);
                const spell = this.spells.data[key];
                matchSpell.name = spell.name;
                matchSpell.image = spell.image.full;
            });

            // items
            for (let i = 0; i <= 6; i++) {
                const id = stats["item" + i];
                if(!id) continue;
                const item = this.items.data[id];
                const matchItem = match.items[i];
                matchItem.id = id;
                matchItem.name = item.name
                matchItem.image = item.image.full;
            }

            // primary path runes
            match.runes.primary.style.id = stats.perkPrimaryStyle;
            match.runes.primary.keystone.id = stats.perk0;
            match.runes.primary.runes[0].id = stats.perk1;
            match.runes.primary.runes[1].id = stats.perk2;
            match.runes.primary.runes[2].id = stats.perk3;

            const primaryStyle = processRune(match.runes.primary.style, this.runes);
            processRune(match.runes.primary.keystone, primaryStyle.slots[0].runes);
            processRune(match.runes.primary.runes[0], primaryStyle.slots[1].runes);
            processRune(match.runes.primary.runes[1], primaryStyle.slots[2].runes);
            processRune(match.runes.primary.runes[2], primaryStyle.slots[3].runes);

            // secondary path runes

            match.runes.secondary.style.id = stats.perkSubStyle;
            match.runes.secondary.runes[0].id = stats.perk4;
            match.runes.secondary.runes[1].id = stats.perk5;

            const secondaryStyle = processRune(match.runes.secondary.style, this.runes);
            processSecondaryRune(match.runes.secondary.runes[0], secondaryStyle);
            processSecondaryRune(match.runes.secondary.runes[1], secondaryStyle);

            return match;
        });
    }
}