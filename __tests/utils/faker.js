const fakerLib = require('faker');

class Faker {
    getUser() {
        return {
            name: fakerLib.name.findName(),
            email: fakerLib.internet.email(),
            password: fakerLib.internet.password()
        };
    }

    getProduct() {
        return {
            name: fakerLib.commerce.productName(),
            description: fakerLib.lorem.paragraph(),
            category: fakerLib.commerce.department(),
            price: fakerLib.commerce.price(),
            avaliableUnits: fakerLib.finance.amount()
        };
    }
}

module.exports = new Faker;
