const { factory } = require('factory-girl');
const Faker = require('./faker');
const { User } = require('../../src/app/models');


factory.define('User', User, Faker.getUser());


module.exports = factory;