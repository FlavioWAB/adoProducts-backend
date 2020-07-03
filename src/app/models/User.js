const sequelize = require("sequelize");

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
        passwordHash: DataTypes.STRING
    });
    
    return User;
}