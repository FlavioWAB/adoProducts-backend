
const faker = require('../utils/faker');
const app = require('../../src/app');
const truncate = require('../utils/truncate');

describe('User Management', () => {
    beforeEach(async () => {
        await truncate();
    });

    it('should not create user with non-unique email', async () => {
        const user = faker.getUser();
        await factory.create('User', user);

        const response = await request(app)
            .post('/user')
            .send(user);

        expect(response.status).toBe(409);
    });

    it('should return user login data upon user creation', async () => {
        const user = faker.getUser();

        const response = await request(app)
            .post('/user')
            .send(user);

        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('users');

    });

});