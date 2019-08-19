class Routes{
    constructor(){
        this.team = '/api/teams';
        this.fixture = '/api/fixtures';
        this.user = '/api/users';
        this.auth = '/api/auth'
    }

    getTeamRoute(){
        return this.team;
    }

    getFixtureRoute(){
        return this.fixture;
    }

    getUserRoute(){
        return this.user;
    }

    getAuthRoute(){
        return this.auth;
    }
}

module.exports = new Routes();