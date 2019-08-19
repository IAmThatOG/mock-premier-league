const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');

getToken = (req) => _.split(req.header('authorization'), " ")[1];

function authoriseAll(req, res, next) {
    const token = getToken(req);
    if (!token) return res.status(401).send({
        message: 'Access Denied. No token provided'
    });
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
    } catch (error) {
        return res.status(400).send({
            message: 'Invalid auth token'
        });
    }
    next();
}

function authoriseAdmin(req, res, next) {
    const token = getToken(req);
    if (!token) return res.status(401).send({
        message: 'Access Denied. No token provided'
    });
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        if (!(req.user.role.toLowerCase() === 'admin'))
            return res.status(403).send({
                message: "Access denied"
            });
    } catch (error) {
        return res.status(400).send({
            message: 'Invalid auth token'
        });
    }
    next();
}

function authoriseUser(req, res, next) {
    const token = getToken(req);
    if (!token) return res.status(401).send({
        message: 'Access Denied. No token provided'
    });
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        if (!(req.user.role.toLowerCase() === 'user'))
            return res.status(403).send({
                message: "Access denied"
            });
    } catch (error) {
        return res.status(400).send({
            message: 'Invalid auth token'
        });
    }
    next();
}

module.exports = {authoriseAll, authoriseAdmin, authoriseUser};