const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

router.use(express.json());

router.post("/", async (req, res, next) => {
    let token;
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findOne({
            email: req.body.email
        });
        if (!user) return res.status(400).send({
            message: "Invalid email or password"
        });
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) return res.status(400).send({
            message: "Invalid email or password"
        });
        token = user.generateAuthToken();
    } catch (error) {
        res.status(500).send({
            message: "error authenticating user",
            error: {
                code: error.code,
                msg: error.message
            }
        });
    }
    return res.header('X-Auth-Token', token).status(200).send({
        message: "authentication successfull",
        token: token
    });
});

function validate(req) {
    const schema = {
        email: joi.string().required().email(),
        password: joi.string().min(6).required()
    }
    return joi.validate(req, schema);
}

module.exports = router;