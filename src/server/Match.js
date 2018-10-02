class Entity {
    contructor(id){
        this.id = id;
        this.name = "";
        this.image = "";
    }
}

module.exports = class Match {
    constructor(gameId){
        this.gameId = gameId;

        this.victory = false;
        this.gameLength = 0;
        this.summonnerName = "";

        this.champion = new Entity(0);
        this.championId = 0;
        this.championName = "";

        this.kills = 0;
        this.deaths = 0;
        this.assists = 0;

        this.championLvl = 0;
        this.creepScore = 0;

        this.spells = [new Entity(0), new Entity(0)];

        this.items = [];
        for (let i = 0; i <= 6; i++) {
            this.items[i] = new Entity(0);
        }

        this.runes = {
            primary: {
                style: new Entity(0),
                keystone: new Entity(0),
                runes: [new Entity(0), new Entity(0), new Entity(0)]
            },
            secondary: {
                style: new Entity(0),
                runes: [new Entity(0), new Entity(0)]
            }
        }
    }
}