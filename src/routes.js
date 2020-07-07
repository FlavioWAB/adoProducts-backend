const routes = require('express').Router();
const LoginController = require('./app/controllers/LoginController')
const authMiddleware = require('./app/middleware/auth');
const UserController = require('./app/controllers/UserController');
const ProductController = require('./app/controllers/ProductController');

// User/session handling
routes.post('/login', LoginController.login)
routes.post('/users', UserController.register)

// Product handling
routes.post('/products', authMiddleware, ProductController.register);
routes.delete('/products/:id', authMiddleware, ProductController.delete);
routes.put('/products/:id', authMiddleware, ProductController.update);
routes.get('/products/search(/result-limit/:limit/page/:page)?', authMiddleware, ProductController.search);
routes.get('/products/:id?', authMiddleware, ProductController.get);

module.exports = routes;