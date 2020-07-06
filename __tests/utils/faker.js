const fakerLib = require('faker');

class Faker {
    getUser() {
        return {
            name: fakerLib.name.findName(),
            email: fakerLib.internet.email(),
            password: fakerLib.internet.password()
        };
    }
}

module.exports = new Faker;
