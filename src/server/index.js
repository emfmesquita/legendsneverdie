const express = require('express');
require('dotenv').config();

const DataDragonHelper = require('leaguejs/lib/DataDragon/DataDragonHelper');
const LeagueJs = require('leaguejs');
const MatchBuilder = require('./MatchBuilder.js');

const staticPromises = [
    DataDragonHelper.gettingLatestVersion(),
    DataDragonHelper.gettingItemList(),
    DataDragonHelper.gettingChampionsList(),
    DataDragonHelper.gettingSummonerSpellsList(),
    DataDragonHelper.gettingReforgedRunesList(),
];

Promise.all(staticPromises).then(staticData => {
    const [version, items, champions, spells, runes] = staticData;
    const leagueJs = new LeagueJs(process.env.LEAGUE_API_KEY);
    const matchBuilder = new MatchBuilder(leagueJs, version, items, champions, spells, runes);
    
    const app = express();
    
    app.use(express.static('dist'));
    app.get('/api/getSummonerMatches', (req, res) => {
        const summonerName = req.query.summoner;
        let summonerId = null;
        const page = '1';
        leagueJs.Summoner
            .gettingByName(summonerName)
            .then(summonerData =>  {
                summonerId = summonerData.id;
                return leagueJs.Match.gettingListByAccount(summonerData.accountId);
            })
            .then(matchList => {
                const matchesToFetch = matchList.totalGames < 10 ? matchList.totalGames : 10;
                const matchPromises = [];
                for(let i = 0; i < matchesToFetch; i++){
                    const matchIndex = (page - 1) * 10 + i;
                    const game1Id = matchList.matches[matchIndex].gameId;
                    matchPromises[i] = matchBuilder.buildMatch(game1Id, summonerId);
                }
                return Promise.all(matchPromises);
            })
            .then(matches => {
                res.send({ matches });
            })
            .catch(err => {
                let msg = err.message;
                if(err.statusCode === 404){
                    msg = "Summoner not found."
                }
                res.send({ err: {
                    message: msg
                }});
            });
    });
    app.listen(8080, () => console.log('Listening on port 8080!'));
});
