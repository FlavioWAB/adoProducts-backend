const { factory } = require('factory-girl');
const Faker = require('./faker');
const { User, Product } = require('../../src/app/models');


factory.define('User', User, Faker.getUser());
factory.define('Product', Product, Faker.getProduct());


module.exports = factory;