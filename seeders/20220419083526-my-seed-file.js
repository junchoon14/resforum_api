'use strict';
const bcrypt = require('bcryptjs')
// const faker = require('faker')

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert('Users', [{
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        isAdmin: true,
        name: 'root',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        isAdmin: false,
        name: 'user1',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        isAdmin: false,
        name: 'user2',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {})
    } catch (err) {
      console.warn(err)
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      return await queryInterface.bulkInsert('Users', null, {})
    } catch (err) {
      console.warn(err)
    }
  }
};
