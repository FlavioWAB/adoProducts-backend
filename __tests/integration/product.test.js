
const faker = require('../utils/faker');
const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../utils/factories');
const request = require('supertest');

describe('Product Management', () => {

    beforeAll(async () => {
        const user = await factory.create('User');
        const bearerToken = `Bearer ${user.generateToken()}`;
    });

    beforeEach(async () => {
        await truncate();
    });

    describe('Authentication handling', () => {

        it('should delete a product when authenticated', async () => {
            const product = await factory.create('Product');

            const response = await request(app)
                .delete('/products')
                .set('Authorization', bearerToken)
                .send({
                    id: product.id
                });

            expect(response.status).toBe(200);
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
                .set('Authorization', bearerToken);

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
                .delete('/products')
                .send({
                    id: product.id
                });

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

            expect(response.status).toBe(401);
        });

        it('should not retrieve any products without authentication', async () => {
            const product = await factory.create('Product');

            const response = await request(app)
                .get(`/products/${product.id}`)
                .set('Authorization', bearerToken);

            expect(response.status).toBe(401);
        });
    });

    describe('Inexistant product handling', () => {

        it('should not delete an inexistent product', async () => {

            const response = await request(app)
                .delete('/products')
                .set('Authorization', bearerToken)
                .send({
                    id: 'Lorem Ipsum'
                });

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
    });

    describe('Search and Pagination', () => {
        it('should return a product when the search term matches any of the descriptor fields (name, description, category)', async () => {
            const product = await factory.create('Product');

            const response = await request(app)
                .get(`/products/search`)
                .set('Authorization', bearerToken)
                .send({
                    query: products.name.split(' ')[0]
                });

            expect(response.status).toBe(200);
        });

        it('should return only the first page when searching for products', async () => {
            const product = await factory.createMany('Product', 20);

            const response = await request(app)
                .get(`/products/search/result-limit/10/page/1`)
                .set('Authorization', bearerToken);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('results');
            expect(response.bod.results.length).toBe(10);
        });

        it('should return only the second page when searching for products, and it can\'t have any overlapping products with the first page', async () => {
            const product = await factory.createMany('Product', 20);

            const firstPageResponse = await request(app)
                .get(`/products/search/result-limit/10/page/1`)
                .set('Authorization', bearerToken);


            const secondPageResponse = await request(app)
                .get(`/products/search/result-limit/10/page/2`)
                .set('Authorization', bearerToken);

            expect(firstPageResponse.status).toBe(200);
            expect(firstPageResponse.body).toHaveProperty('results');
            expect(firstPageResponse.body.results.length).toBe(10);

            expect(secondPageResponse.status).toBe(200);
            expect(secondPageResponse.body).toHaveProperty('results');
            expect(secondPageResponse.body.results.filter(value => firstPageResponse.body.results.includes(value)).length).toBe(0);

        });
    });
});