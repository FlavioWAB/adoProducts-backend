const { User } = require('../models');
const errorLogger = require('../../utils/errorLogger');
const fieldValidation = require('../../utils/fieldValidation');

class UserController {
    async register(req, res) {
        const { name, email, password } = req.body;

        const anyAreEmpty = fieldValidation.notEmpty({ name, email, password });

        if (anyAreEmpty) {
            return res.status(422).json({ error: anyAreEmpty.missingFields });
        } else {
            try {
                const user = await User.create({ name, email, password });
                return res.status(200).json({
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        createdAt: user.createdAt
                    },
                    token: user.generateToken()
                });
            } catch (err) {
                errorLogger(err);
                if (err.parent.code === "ER_DUP_ENTRY" | err.parent.code === "SQLITE_CONSTRAINT") {
                    return res.status(409).json({ error: ["E-mail already exists"] });
                } else {
                    return res.status(500).json({ error: ["Internal server error"] });
                }
            }
            
        }
    }
}

module.exports = new UserController();