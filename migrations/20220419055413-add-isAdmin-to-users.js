'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Users', 'isAdmin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'isAdmin');
  }
};