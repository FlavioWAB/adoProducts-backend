const routes = require('express').Router();
const LoginController = require('./app/controllers/LoginController')
const authMiddleware = require('./app/middleware/auth');
const UserController = require('./app/controllers/UserController');

routes.post('/login', LoginController.login)
routes.post('/users', UserController.register)

routes.get('/dash', authMiddleware, (req, res) => {
    return res.status(200).send()
});

module.exports = routes;