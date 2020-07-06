
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        avaliableUnits: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    return Product;
}