
const faker = require('../utils/faker');
const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../utils/factories');
const request = require('supertest');

describe('User Management', () => {
    beforeEach(async () => {
        await truncate();
    });

    it('should not create user with non-unique email', async () => {
        const user = {
            name: 'asd',
            email: 'asd',
            password: 'asd'
        };

        await factory.create('User', user);

        const response = await request(app)
            .post('/users')
            .send(user);

        expect(response.status).toBe(409);

    });

    it('should return user login data upon user creation', async () => {
        const user = faker.getUser();

        const response = await request(app)
            .post('/users')
            .send(user);

        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');

    });

});