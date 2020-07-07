
const faker = require('../utils/faker');
const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../utils/factories');
const request = require('supertest');
let user;
let bearerToken;

describe('Product Management', () => {

    beforeAll(async () => {
        user = await factory.create('User')
        bearerToken = `Bearer ${user.generateToken()}`
    });

    beforeEach(async () => {
        await truncate();
    });

    it('should delete a product when authenticated', async () => {
        const product = await factory.create('Product');

        const response = await request(app)
            .delete(`/products/${product.id}`)
            .set('Authorization', bearerToken)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success');
    });

    it('should update product data when authenticated', async () => {
        const product = await factory.create('Product');

        const response = await request(app)
            .put(`/products/${product.id}`)
            .set('Authorization', bearerToken)
            .send({
                name: 'Lorem Ipsum'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('product');
        expect(response.body.product.name).toBe('Lorem Ipsum');
    });

    it('should create a product when authenticated', async () => {
        const product = faker.getProduct();

        const response = await request(app)
            .post('/products')
            .set('Authorization', bearerToken)
            .send(product);

        expect(response.status).toBe(200);
    });

    it('should retrieve a product when authenticated, without throwing any errors', async () => {
        const product = await factory.create('Product');

        const response = await request(app)
            .get(`/products/${product.id}`)
            .set('Authorization', bearerToken);

        expect(response.status).toBe(200);
    });

    it('should not delete product without authentication', async () => {
        const product = await factory.create('Product');

        const response = await request(app)
            .delete(`/products/${product.id}`)

        expect(response.status).toBe(401);
    });

    it('should not update product data without authentication', async () => {
        const product = await factory.create('Product');

        const response = await request(app)
            .put(`/products/${product.id}`)
            .send({
                name: 'Lorem Ipsum'
            });

        expect(response.status).toBe(401);
    });

    it('should not create product without authentication', async () => {
        const product = faker.getProduct();

        const response = await request(app)
            .post('/products')
            .send(product)

        expect(response.status).toBe(401);
    });

    it('should not retrieve any products without authentication', async () => {
        const product = await factory.create('Product');

        const response = await request(app)
            .get(`/products/${product.id}`)

        expect(response.status).toBe(401);
    });



    it('should not delete an inexistent product', async () => {

        const response = await request(app)
            .delete(`/products/Lorem Ipsum`)
            .set('Authorization', bearerToken);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    it('should not update an inexistent product', async () => {
        const product = await factory.create('Product');

        const response = await request(app)
            .put(`/products/Lorem Ipsum`)
            .set('Authorization', bearerToken)
            .send({
                name: 'Lorem Ipsum'
            });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    it('should throw an error when trying to retrieve an inexistant product', async () => {
        const product = await factory.create('Product');

        const response = await request(app)
            .get(`/products/Lorem Ipsum`)
            .set('Authorization', bearerToken);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    it('should return a product when the search term matches any of the descriptor fields (name, description, category)', async () => {
        const product = await factory.create('Product');

        const response = await request(app)
            .get(`/products/search`)
            .set('Authorization', bearerToken)
            .send({
                query: product.name.split(' ')[0]
            });

        expect(response.status).toBe(200);
    });

});