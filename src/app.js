const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

const Routes = require('./routes');
const teamControler = require('./controllers/team-controller');
const fixtureController = require('./controllers/fixture-controller');
const userController = require('./controllers/user-controller');
const authController = require('./controllers/auth-controller');

const app = express();

app.use(Routes.getTeamRoute(), teamControler);
app.use(Routes.getFixtureRoute(), fixtureController);
app.use(Routes.getUserRoute(), userController);
app.use(Routes.getAuthRoute(), authController);

const port = process.env.PORT;
app.listen(port, () => console.log(`server started at ${port}...`));

console.log("Fixture Route", Routes.getFixtureRoute());

mongoose.connect(config.get('dbConnection'), {useNewUrlParser: true, useCreateIndex: true})
    .then(() => console.log('MongoDB connection established...'))
    .catch(err => console.log(err));