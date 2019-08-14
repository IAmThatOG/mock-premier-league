const mongoose = require('mongoose');

const fixtureSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
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
    createdAt: {type: Date, required: true},
    updatedAt: {type: Date, required: true, default: Date.now()}
});

const Fixture = mongoose.model('Fixture', fixtureSchema);
module.exports = Fixture;
