const request = require('supertest');
const Routes = require('../routes');
const User = require('../models/user');
const db = require('../db');
const Fixture = require('../models/fixture');
const Team = require('../models/Team');
const _ = require('lodash');

describe('/api/fixtures', () => {
    let teams;
    let fixture;
    let server;

    beforeEach(async () => {
        server = require('../app');
        //seed teams
        teams = await Team.insertMany([{
            name: 'TestTeam 1',
            manager: 'TestManager 1',
            createdAt: Date.now()
        }, {
            name: 'TestTeam 2',
            manager: 'TestManager 2',
            createdAt: Date.now()
        }, {
            name: 'TestTeam 3',
            manager: 'TestManager 3',
            createdAt: Date.now()
        }]);

        //seed fixtures
        let homeTeam = await Team.findOne({
            name: 'TestTeam 1'
        });
        let awayTeam = await Team.findOne({
            name: "TestTeam 2"
        });

        fixture = await new Fixture({
            homeTeam: homeTeam._id,
            awayTeam: awayTeam._id,
            createdAt: Date.now()
        }).save();
    });

    afterEach(async () => {
        server.close();
        await Team.remove({});
        await Fixture.remove({});
        await Team.db.dropDatabase();
        await Fixture.db.dropDatabase();
    });

    describe('GET /', () => {
        it('Should return 401 if client is not authenticated', async () => {
            const res = await request(server).get(Routes.getFixtureRoute());
            expect(res.status).toBe(401);
        });

        it('should return status 200 with all fixtures', async () => {
            const token = new User({
                role: 'user'
            }).generateAuthToken();
            const res = await request(server)
                .get(Routes.getFixtureRoute())
                .set('authorization', `bearer ${token}`);
            expect(res.status).toBe(200);
            expect(_.size(res.body.fixtures)).toBe(1);
        });
    });

    describe('GET /:id', () => {
        it('Should return 401 if client is not authenticated', async () => {
            const res = await request(server).get(`${Routes.getTeamRoute()}/1`);
            expect(res.status).toBe(401);
        });

        it('should return status 400 on passing invalid id parameter', async () => {
            const token = new User({
                role: 'user'
            }).generateAuthToken();

            const res = await request(server)
                .get(Routes.getFixtureRoute() + '/acd')
                .set('authorization', `bearer ${token}`);
            expect(res.status).toBe(400);
        });

        it('should return a single fixture', async () => {
            const token = new User({
                role: 'user'
            }).generateAuthToken();

            let url = `${Routes.getFixtureRoute()}/${fixture._id}`;
            const res = await request(server).get(url).set('authorization', `bearer ${token}`);
            expect(res.status).toBe(200);
        });
    });

    describe('POST /', () => {
        it('Should return 401 if client is not authenticated', async () => {
            const res = await request(server).post(Routes.getTeamRoute());
            expect(res.status).toBe(401);
        });

        it('should return status 403 for user whose not an admin', async () => {
            const token = new User({
                role: 'user'
            }).generateAuthToken();

            const res = await request(server)
                .post(Routes.getFixtureRoute())
                .set('authorization', `bearer ${token}`)
                .send({});
            expect(res.status).toBe(403);
        });

        it('should return status 201 with created fixture', async () => {
            const token = new User({
                role: 'admin'
            }).generateAuthToken();
            const res = await request(server)
                .post(Routes.getFixtureRoute())
                .set('authorization', `bearer ${token}`)
                .send({
                    homeTeam: teams[0]._id,
                    awayTeam: teams[2]._id,
                    createdAt: Date.now()
                });
            expect(res.status).toBe(201);
        });
    });

    describe('PUT /:id', () => {
        it('Should return 401 if client is not authenticated', async () => {
            const res = await request(server)
                .put(Routes.getTeamRoute() + '/1')
                .send({});
            expect(res.status).toBe(401);
        });

        it('should return status 403 for user whose not an admin', async () => {
            const token = new User({
                role: 'user'
            }).generateAuthToken();

            let url = `${Routes.getFixtureRoute()}/${fixture._id}`;
            const res = await request(server)
                .put(url)
                .set('authorization', `bearer ${token}`)
                .send({});
            expect(res.status).toBe(403);
        });

        it('should return status 400 on passing invalid id parameter', async () => {
            const token = new User({
                role: 'admin'
            }).generateAuthToken();

            const res = await request(server)
                .put(Routes.getFixtureRoute() + '/acd')
                .set('authorization', `bearer ${token}`)
                .send({});
            expect(res.status).toBe(400);
        });

        it('should return 200 with the edited fixture', async () => {
            const token = new User({
                role: 'admin'
            }).generateAuthToken();

            let requestObject = {
                homeTeam: teams[0]._id,
                awayTeam: teams[2]._id,
                homeTeamScore: 2,
                awayTeamScore: 0,
                homeTeamPosession: 70,
                awayTeamPosession: 30,
                isCompleted: true
            }
            let url = `${Routes.getFixtureRoute()}/${fixture._id}`;
            const res = await request(server)
                .put(url)
                .set('authorization', `bearer ${token}`)
                .send(requestObject);
            expect(res.status).toBe(200);
        });
    });

    describe('DELETE /:id', () => {
        it('Should return 401 if client is not authenticated', async () => {
            let url = `${Routes.getFixtureRoute()}/${fixture._id}`;
            const res = await request(server)
                .delete(url)
                .send({});
            expect(res.status).toBe(401);
        });

        it('should return status 400 on passing invalid id parameter', async () => {
            const token = new User({
                role: 'admin'
            }).generateAuthToken();

            const res = await request(server)
                .delete(Routes.getFixtureRoute() + '/acd')
                .set('authorization', `bearer ${token}`);
            expect(res.status).toBe(400);
        });

        it('should return status 403 for user whose not an admin', async () => {
            const token = new User({
                role: 'user'
            }).generateAuthToken();

            let url = `${Routes.getFixtureRoute()}/${fixture._id}`;
            const res = await request(server)
                .delete(url)
                .set('authorization', `bearer ${token}`)
                .send({});
            expect(res.status).toBe(403);
        });

        it('should return 200 with the edited fixture', async () => {
            const token = new User({
                role: 'admin'
            }).generateAuthToken();
            let url = `${Routes.getFixtureRoute()}/${fixture._id}`;
            const res = await request(server)
                .delete(url)
                .set('authorization', `bearer ${token}`);
            expect(res.status).toBe(200);
        });
    });
});