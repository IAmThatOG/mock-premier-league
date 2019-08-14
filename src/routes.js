class Routes{
    constructor(){
        this.team = '/api/teams';
        this.fixture = '/api/fixtures';
    }

    getTeamRoute(){
        return this.team;
    }

    getFixtureRoute(){
        return this.fixture;
    }
}

module.exports = new Routes();