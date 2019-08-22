const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
require('./db')();

const Routes = require('./routes');
const teamControler = require('./controllers/team-controller');
const fixtureController = require('./controllers/fixture-controller');
const userController = require('./controllers/user-controller');
const authController = require('./controllers/auth-controller');

const app = express();

if (process.env.NODE_ENV === 'production') {
    require('./middleware/production-middleware')(app);
}

app.use(Routes.getTeamRoute(), teamControler);
app.use(Routes.getFixtureRoute(), fixtureController);
app.use(Routes.getUserRoute(), userController);
app.use(Routes.getAuthRoute(), authController);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`server started at ${port}...`));

console.log("Fixture Route", Routes.getFixtureRoute());

module.exports = server;