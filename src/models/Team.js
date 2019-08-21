const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    manager: {type: String, required: true, unique: true},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;