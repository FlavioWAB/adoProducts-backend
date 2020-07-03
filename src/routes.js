const routes = require('express').Router();
const { User } = require('./app/models');

User.create({
    name: 'Ronaldo',
    email: 'meu@email.com',
    password_hash: 'heoaeo'
})
User.create({
    name: 'Ronaldo',
    email: 'meu@emsail.com',
    password_hash: 'heoaeo'
})
User.findOne({ where: { name: 'ronaldo' } })

User.update(
    { name: 'a very different title now' },
    { where: { name: 'ronaldo' } }
)

User.destroy({
    where: { name: 'juliano' }
})
// Definição de rotas

module.exports = routes;