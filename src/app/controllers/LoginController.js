const { User } = require('../models');
const fieldValidation = require('../../utils/fieldValidation');

class LoginController {
    async login(req, res) {
        const { email, password } = req.body;

        const anyAreEmpty = fieldValidation.notEmpty({ email, password });

        if (anyAreEmpty) {

            return res.status(422).json({ error: anyAreEmpty.missingFields });

        } else {

            const user = await User.findOne({ where: { email } })

            if (!user) {
                return res.status(401).json({
                    error: ['User not found']
                });
            }

            if (!(await user.checkPassword(password))) {
                return res.status(401).json({
                    error: ['Incorrect password']
                });
            }

            return res.status(200).json({
                user,
                token: user.generateToken()
            });
        }
    }
}

module.exports = new LoginController();