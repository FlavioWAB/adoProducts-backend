require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const express = require('express');
var cors = require('cors')

class AppController {
    constructor() {
        this.express = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.express.use(express.json());

        const whitelist = ['http://localhost:8000', 'https://mystifying-kirch-b6b1a1.netlify.app']

        this.express.use(cors({
            origin: function (origin, callback) {
                if(process.env.NODE_ENV === 'test' || whitelist.indexOf(origin) !== -1) {
                    callback(null, true)
                } else {
                    callback(new Error('Not allowed by CORS'))
                }
            },
            optionsSuccessStatus: 200
        }));
    }

    routes() {
        this.express.use(require('./routes'));
    }
}

module.exports = new AppController().express;