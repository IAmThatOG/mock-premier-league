const express = require('express');
const router = express.Router();
const Team = require('../models/team');
const mongoose = require('mongoose');
const Auth = require('../middleware/auth-middleware');

router.use(express.json());

router.get('/', Auth.authoriseAll, async (req, res, next) => {
    let teams;
    try {
        teams = await Team.find().sort({
            'name': 1
        });
    } catch (error) {
        res.status(500).send({
            "message": "error fetching teams",
            error: {
                code: error.code,
                msg: error.message
            }
        });
    }
    return res.status(200).send({
        message: "teams fetched successfully",
        teams: teams
    });
});

router.get('/:id', Auth.authoriseAll, async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send({
            message: "invalid id"
        });
    let team = null;
    try {
        team = await Team.findById(req.params.id);
    } catch (error) {
        res.status(500).send({
            message: "error getting team by id",
            error: {
                code: error.code,
                msg: error.message
            }
        });
    }
    if (team === null)
        return res.status(404).send({
            message: `can't find team with id ${req.params.id}`
        });
    return res.status(200).send({
        message: "team fetched successfully¸",
        team: team
    });
});

router.post('/', Auth.authoriseAdmin, async (req, res, next) => {
    let team = new Team({
        name: req.body.name,
        manager: req.body.manager,
        createdAt: Date.now()
    });
    try {
        team = await team.save();
    } catch (error) {
        return res.status(500).send({
            message: "error creating team",
            error: {
                code: error.code,
                msg: error.message
            }
        });
    }
    return res.status(201).send({
        message: "team created successfully",
        team: team
    });
});

router.put('/:id', Auth.authoriseAdmin, async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send({
            message: "invalid id"
        });
    let updatedTeam = null
    try {
        let team = await Team.findById(req.params.id);
        if (!team) return res.status(404).send({
            message: `can't find team with id ${req.params.id}`
        });
        team.name = req.body.name;
        team.manager = req.body.manager;
        updatedTeam = await team.save();
    } catch (error) {
        res.status(500).send({
            "message": "error updating team",
            error: {
                code: error.code,
                msg: error.message
            }
        });
    }
    return res.status(200).send({
        message: "team updated successfully",
        team: updatedTeam
    });
});

router.delete('/:id', Auth.authoriseAdmin, async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send({
            message: "invalid id"
        });
    let team = null;
    try {
        team = await Team.findByIdAndDelete(req.params.id);
        if (!team) return res.status(404).send({
            message: `can't find team with id ${req.params.id}`
        });
    } catch (error) {
        return res.status(500).send({
            "message": "error deleting team",
            error: {
                code: error.code,
                msg: error.message
            }
        });
    }
    return res.status(200).send({
        message: "team deleted successfully",
        deletedTeam: team
    });
});

module.exports = router;