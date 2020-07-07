const request = require('supertest');

const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../utils/factories');

describe('Authentication', () => {
    beforeEach(async () => {
        await truncate();
    });

    it('should authenticate with valid credentials', async () => {
        const user = await factory.create('User');

        const response = await request(app)
            .post('/login')
            .send({
                email: user.email,
                password: user.password,
            });

        expect(response.status).toBe(200);
    });

    it('should not authenticate with invalid credentials', async () => {
        const user = await factory.create('User');

        const response = await request(app)
            .post('/login')
            .send({
                email: user.email,
                password: 'lorem',
            });

        expect(response.status).toBe(401);
    });

    it('should return JWT token when authenticated', async () => {
        const user = await factory.create('User');

        const response = await request(app)
            .post('/login')
            .send({
                email: user.email,
                password: user.password,
            });

        expect(response.body).toHaveProperty('token');
    });

    it('should be able to access private routes when authenticated', async () => {
        const user = await factory.create('User');

        const response = await request(app)
            .get('/products')
            .set('Authorization', `Bearer ${user.generateToken()}`);

        expect(response.status).toBe(200);
    });

    it('should not be able to access private routes when not authenticated', async () => {
        const response = await request(app)
            .get('/products');

        expect(response.status).toBe(401);
    });

    it('should not be able to access private routes when authenticated with invalid tokens', async () => {
        const response = await request(app)
            .get('/products')
            .set('Authorization', `Bearer Lorem Ipsum`);

        expect(response.status).toBe(401);
    });

    it('should not authenticate with missing credentials', async () => {
        const user = await factory.create('User');

        const response = await request(app)
            .post('/login')
            .send({
                email: user.email
            });

        expect(response.status).toBe(422);
    });
});