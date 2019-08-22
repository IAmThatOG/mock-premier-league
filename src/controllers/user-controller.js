const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.use(express.json());

router.post('/', async (req, res, next) => {
    let user = new User(_.pick(req.body, ['username', 'email', 'password', 'role']));
    try {
        //TODO: check if user exists
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.createdAt = Date.now();
        user = await user.save();
    } catch (error) {
        return res.status(500).send({
            message: "error creating user",
            error: {
                code: error.code,
                msg: error.message
            }
        });
    }
    return res.status(201).send({
        message: "user created successfully",
        user: _.pick(user, ['_id', 'username', 'email', 'role'])
    });
});

module.exports = router;