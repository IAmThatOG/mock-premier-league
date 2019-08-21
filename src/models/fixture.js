const mongoose = require('mongoose');

const fixtureSchema = new mongoose.Schema({
    homeTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    awayTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    homeTeamScore: {type: Number, default: 0},
    awayTeamScore: {type: Number, default: 0},
    homeTeamPosession: {type: Number, default: 50},
    awayTeamPosession: {type: Number, default: 50},
    isCompleted: {type:Boolean, default: false},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

const Fixture = mongoose.model('Fixture', fixtureSchema);
module.exports = Fixture;
