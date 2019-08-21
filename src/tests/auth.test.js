const request = require('supertest');
const Routes = require('../routes');

let server

describe('auth middleware', () => {
    beforeEach(() => {
        server = require('../app');
    });

    afterEach(() => {
        server.close();
    });

    

    it('should return 401 if no token is provided', async () => {
        
    });
})