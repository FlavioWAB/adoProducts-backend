const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            allowNull: false,
            primaryKey: true
        },
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.VIRTUAL,
        passwordHash: DataTypes.STRING
    }, {
        hooks: {
            beforeSave: async user => {
                if (user.password) {
                    user.passwordHash = await bcrypt.hash(user.password, 8);
                }
            }
        }
    });

    User.prototype.checkPassword = function (password) {
        return bcrypt.compare(password, this.passwordHash)
    };

    User.prototype.generateToken = function (password) {
        return jwt.sign({id: this.id}, process.env.APP_SECRET);
    };

    return User;
}