const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {type: String, required: true, unique: true},
    manager: {type: String, required: true, unique: true},
    createdAt: {type: Date, required: true},
    updatedAt: {type: Date, default: Date.now()}
});

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;