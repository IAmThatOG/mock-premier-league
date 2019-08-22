const request = require('supertest');
const Routes = require('../routes');
const User = require('../models/user');
const db = require('../db');
const mongoose = require('mongoose')
const Team = require('../models/Team');
const _ = require('lodash');



describe('/api/teams', () => {
    let server;
    let team;
    
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
        }]);
    });

    afterEach(async () => {
        server.close();
        await Team.remove({});
        await Team.db.dropDatabase();
    });

    describe('GET /', () => {
        it('Should return 401 if client is not authenticated', async () => {
            const res = await request(server).get(Routes.getTeamRoute());
            expect(res.status).toBe(401);
        });

        it('should return all teams', async () => {
            const token = new User({
                role: 'admin'
            }).generateAuthToken();
            const res = await request(server)
                .get(Routes.getTeamRoute())
                .set('authorization', `bearer ${token}`);
            expect(res.status).toBe(200);
            expect(_.size(res.body.teams)).toBe(2);
        });
    });

    describe('GET /:id', () => {
        it('Should return 401 if client is not authenticated', async () => {
            const res = await request(server).get(`${Routes.getTeamRoute()}/1`);
            expect(res.status).toBe(401);
        });

        it('should return status 400 on passing invalid id parameter', async () => {
            const token = new User({
                role: 'admin'
            }).generateAuthToken();

            const res = await request(server)
                .get(Routes.getTeamRoute() + '/acd')
                .set('authorization', `bearer ${token}`)
                .send({});
            expect(res.status).toBe(400);
        });

        it('should return a single team', async () => {
            const token = new User({
                role: 'user'
            }).generateAuthToken();

            let url = `${Routes.getTeamRoute()}/${teams[0]._id}`;
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
                .post(Routes.getTeamRoute())
                .set('authorization', `bearer ${token}`)
                .send({});
            expect(res.status).toBe(403);
        });

        it('should return status 201 with created team', async () => {
            const token = new User({
                role: 'admin'
            }).generateAuthToken();
            const res = await request(server)
                .post(Routes.getTeamRoute())
                .set('authorization', `bearer ${token}`)
                .send({
                    name: "TestTeam",
                    manager: "TestManager",
                    createdAt: Date.now()
                });
            expect(res.status).toBe(201);
            expect(_.size(res.body)).toBe(2);
        });
    });

    describe('PUT /:id', () => {
        it('Should return 401 if client is not authenticated', async () => {
            let url = `${Routes.getTeamRoute()}/${teams[0]._id}`;
            const res = await request(server)
                .put(url)
                .send({});
            expect(res.status).toBe(401);
        });

        it('should return status 400 on passing invalid id parameter', async () => {
            const token = new User({
                role: 'admin'
            }).generateAuthToken();

            const res = await request(server)
                .put(Routes.getTeamRoute() + '/acd')
                .set('authorization', `bearer ${token}`)
                .send({});
            expect(res.status).toBe(400);
        });

        it('should return status 403 for user who is not an admin', async () => {
            const token = new User({
                role: 'user'
            }).generateAuthToken();

            let url = `${Routes.getTeamRoute()}/${teams[0]._id}`;
            const res = await request(server)
                .put(url)
                .set('authorization', `bearer ${token}`)
                .send({});
            expect(res.status).toBe(403);
        });

        it('should return 200 with the edited team', async () => {

            const requestObject = {
                name: 'New Team',
                manager: 'New manager',
                createdAt: Date.now()
            };

            const token = new User({
                role: 'admin'
            }).generateAuthToken();

            let url = `${Routes.getTeamRoute()}/${teams[0]._id}`;
            const res = await request(server)
                .put(url)
                .set('authorization', `bearer ${token}`)
                .send(requestObject);
            expect(res.status).toBe(200);
        });
    });

    describe('DELETE /:id', () => {
        it('Should return 401 if client is not authenticated', async () => {
            let url = `${Routes.getTeamRoute()}/${teams[0]._id}`;
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
                .delete(Routes.getTeamRoute() + '/acd')
                .set('authorization', `bearer ${token}`)
                .send({});
            expect(res.status).toBe(400);
        });

        it('should return status 403 for user who is not an admin', async () => {
            const token = new User({
                role: 'user'
            }).generateAuthToken();

            let url = `${Routes.getTeamRoute()}/${teams[0]._id}`;
            const res = await request(server)
                .delete(url)
                .set('authorization', `bearer ${token}`)
                .send({});
            expect(res.status).toBe(403);
        });

        it('should return 200 with the edited team', async () => {
            const token = new User({
                role: 'admin'
            }).generateAuthToken();

            let url = `${Routes.getTeamRoute()}/${teams[0]._id}`;
            const res = await request(server)
                .delete(url)
                .set('authorization', `bearer ${token}`)
            expect(res.status).toBe(200);
        });
    });
});