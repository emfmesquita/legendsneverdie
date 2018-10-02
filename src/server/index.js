const express = require('express');
require('dotenv').config();

const DataDragonHelper = require('leaguejs/lib/DataDragon/DataDragonHelper');
const LeagueJs = require('leaguejs');
const MatchBuilder = require('./MatchBuilder.js');

const staticPromises = [
    DataDragonHelper.gettingItemList(),
    DataDragonHelper.gettingChampionsList(),
    DataDragonHelper.gettingSummonerSpellsList(),
    DataDragonHelper.gettingReforgedRunesList(),
];

Promise.all(staticPromises).then(staticData => {
    const [items, champions, spells, runes] = staticData;
    const leagueJs = new LeagueJs(process.env.LEAGUE_API_KEY);
    const matchBuilder = new MatchBuilder(leagueJs, items, champions, spells, runes);
    
    const app = express();
    
    app.use(express.static('dist'));
    app.get('/api/getApiKey', (req, res) => res.send({ key: process.env.LEAGUE_API_KEY }));
    app.get('/api/getSummonerMatches', (req, res) => {
        const summonerName = 'Voyboy'.trim();
        const page = '1';
        leagueJs.Summoner
            .gettingByName(summonerName)
            .then(summonerData =>  {
                return leagueJs.Match.gettingListByAccount(summonerData.accountId);
            })
            .then(matchList => {
                const promises = [0,1,2,3,4].map(index => {
                    const matchIndex = (page - 1) * 5 + index;
                    const game1Id = matchList.matches[matchIndex].gameId;
                    return matchBuilder.buildMatch(game1Id, summonerName);
                });
                return Promise.all(promises);
            })
            .then(matches => {
                res.send(matches);
            })
            .catch(err => {
                'use strict';
                console.log(err);
            });
    });
    app.listen(8080, () => console.log('Listening on port 8080!'));
});
