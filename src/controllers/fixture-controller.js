const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fixture = require('../models/fixture');

router.use(express.json());

router.post('/', async (req, res, next) => {
    let fixture = new Fixture({
        _id: new mongoose.Types.ObjectId(),
        homeTeam: req.body.homeTeam,
        awayTeam: req.body.awayTeam,
        homeTeamScore: req.body.homeTeamScore,
        awayTeamScore: req.body.awayTeamScore,
        homeTeaamPosession: req.body.homeTeaamPosession,
        awayTeamPossession: req.body.homeTeaamPosession,
        isCompleted: req.body.isCompleted,
        createdAt: Date.now()
    });
    try {
        fixture = await fixture.save();
    } catch (error) {
        console.log(error);
        res.status(500).send({
            "message": "error creating fixture",
            error: {
                code: error.code,
                msg: error.message
            }
        });
    }
    return res.status(201).send({
        message: "fixture created successfully",
        fixture: fixture
    });
});

router.get('/', async (req, res, next) => {
    let fixtures = null;
    try {
        fixtures = await Fixture.find().populate('homeTeam awayTeam');
    } catch (error) {
        console.log(error);
        res.status(500).send({
            "message": "error fetching teams",
            error: {
                code: error.code,
                msg: error.message
            }
        });
    }
    return res.status(200).send({
        message: "fixtures fetched successfully",
        fixtures: fixtures
    });
});

router.get('/:id', async (req, res, next) => {
    let fixture = null;
    try {
        fixture = await Fixture.findById(req.params.id).populate('homeTeam awayTeam');
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "error getting fixture by id",
            error: {
                code: error.code,
                msg: error.message
            }
        });
    }
    if (fixture === null)
        return res.status(404).send({
            message: `can't find fixture with id ${req.params.id}`
        });
    return res.status(200).send({
        message: "fixture fetched successfully¸",
        fixture: fixture
    });
});

router.put('/:id', async (req, res, next) => {
    let updatedFixture = null
    try {
        let fixture = await Fixture.findById(req.params.id);
        if (!fixture) return res.status(404).send({
            message: `can't find fixture with id ${req.params.id}`
        });
        fixture.homeTeamScore = req.body.homeTeamScore;
        fixture.awayTeamScore = req.body.awayTeamScore;
        fixture.homeTeamPosession = req.body.homeTeamPosession;
        fixture.awayTeamPosession = req.body.awayTeamPosession;
        fixture.homeTeam = req.body.homeTeam;
        fixture.awayTeam = req.body.awayTeam;

        updatedFixture = await fixture.save();
        console.log(updatedFixture.populate('homeTeam awayTeam'));
        updatedFixture = updatedFixture.populate('homeTeam awayTeam');
    } catch (error) {
        console.log(error)
        res.status(500).send({
            "message": "error updating fixture",
            error: {
                code: error.code,
                msg: error.message
            }
        });
    }
    return res.status(200).send({
        message: "fixture updated successfully",
        fixture: updatedFixture
    });
});

router.delete('/:id', async (req, res, next) => {
    let team = null;
    console.log(req.params.id);
    try {
        team = await Team.findByIdAndDelete(req.params.id);
        console.log(team);
        if (!team || team.ok < 1) return res.status(404).send({
            message: `can't find team with id ${req.params.id}`
        });
    } catch (error) {
        console.log(error);
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