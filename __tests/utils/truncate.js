const { sequelize } = require('../../src/app/models');

module.exports = () => {
    return Promise.all(Object.keys(sequelize.models).map(table => {
        return sequelize.models[table].destroy({ truncate: true, force: true})
    }))
}