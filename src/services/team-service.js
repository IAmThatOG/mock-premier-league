const Team = require('../models/team');

class TeamService {

    async createTeam(team) {
        let createdTeam = null;
        try {
            createdTeam = await team.save();
        } catch (error) {
            console.log(error);
        }
        return createdTeam;
    }
}

module.exports = new TeamService();