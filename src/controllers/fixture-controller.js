const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fixture = require('../models/fixture');
const _ = require('lodash');
const Auth = require('../middleware/auth-middleware');

router.use(express.json());

router.post('/', Auth.authoriseAdmin, async (req, res, next) => {
    let fixture = new Fixture({
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

router.get('/', Auth.authoriseAll, async (req, res, next) => {
    let fixtures = null;
    try {
        fixtures = await Fixture.find().populate('homeTeam awayTeam');
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
        message: "fixtures fetched successfully",
        fixtures: fixtures
    });
});

router.get('/:id', Auth.authoriseAll, async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send({
            message: "invalid id"
        });
    let fixture = null;
    try {
        fixture = await Fixture.findById(req.params.id).populate('homeTeam awayTeam');
    } catch (error) {
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

router.put('/:id', Auth.authoriseAdmin, async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send({
            message: "invalid id"
        });
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
        fixture.isCompleted = req.body.isCompleted;
        fixture.updatedAt = Date.now();

        updatedFixture = await fixture.save();
    } catch (error) {
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
        fixture: _.pick(updatedFixture,
            [
                'homeTeam',
                'awayTeam',
                'homeTeamScore',
                'awayTeamScore',
                'homeTeamPosession',
                'awayTeamPosession',
                'isCompleted',
                'updatedAt'
            ])
    });
});

router.delete('/:id',Auth.authoriseAdmin, async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send({
            message: "invalid id"
        });
    let team = null;
    try {
        fixture = await Fixture.findByIdAndDelete(req.params.id);
        if (!fixture) return res.status(404).send({
            message: `can't find team with id ${req.params.id}`
        });
    } catch (error) {
        return res.status(500).send({
            "message": "error deleting fixture",
            error: {
                code: error.code,
                msg: error.message
            }
        });
    }
    return res.status(200).send({
        message: "fixture deleted successfully",
        deletedFixture: fixture
    });
});

module.exports = router;