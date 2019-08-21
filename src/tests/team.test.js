const request = require('supertest');
const Routes = require('../routes');
const User = require('../models/user');
const db = require('../db');
const Teamaa = require('../models/team');
const _ = require('lodash');

let server;

describe('/api/teams', () => {
    beforeEach(async () => {
        server = require('../app');
        //seed teams
        await Team.collection.insertMany([{
            name: 'TestTeam 1',
            manager: 'TestManager 1'
        }, {
            name: 'TestTeam 2',
            manager: 'TestManager 2'
        }]);
    });

    afterEach(async () => {
        server.close();
        await Team.remove({});
    });

    describe('GET /', () => {
        it('Should return 401 if client is not authenticated', async () => {
            const res = await request(server).post(Routes.getTeamRoute());
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
            expect(_.size(res.body)).toBe(2);
        });

        it('should return status 201 with created team', async () => {
            const token = new User({
                role: 'admin'
            }).generateAuthToken();
            const res = await request(server)
                .post(Routes.getTeamRoute())
                .set('authorization', `bearer ${token}`)
                .send({
                    "name": "TestTeam",
                    "manager": "TestManager"
                });
            expect(res.status).toBe(201);
            expect(_.size(res.body)).toBe(2);
        });

        it('should return 200 with the edited team', async () => {
            const team = new Team({
                "name": "TestTeam",
                "manager": "TestManager"
            });
            await team.save();

            request(server).put(Routes.getTeamRoute())
                .set('authorization', `bearer ${token}`)
                .send({
                    name: 'Another Team',
                    manager: 'Another Manager'
                });
            expect(res.status).toBe(200);
        });
    });
});