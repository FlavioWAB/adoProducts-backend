'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('WinstonLogs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      level: Sequelize.STRING,
      message: Sequelize.TEXT,
      meta: {
        type: Sequelize.TEXT,
        set: function (value) {
          this.setDataValue('meta', JSON.stringify(value));
        },
        get: function () {
          return JSON.parse(this.getDataValue('meta'));
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('WinstonLogs');
  }
};
