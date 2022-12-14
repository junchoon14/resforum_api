'use strict';
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert('Users', [{
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        isAdmin: true,
        name: 'root',
        description: '',
        image: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        isAdmin: false,
        name: 'user1',
        description: '',
        image: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        isAdmin: false,
        name: 'user2',
        description: '',
        image: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {})

      await queryInterface.bulkInsert('Restaurants',
        Array.from({ length: 50 }).map(d =>
        ({
          name: faker.name.findName(),
          tel: faker.phone.phoneNumber('+886-9##-###-###'),
          address: faker.address.streetAddress(),
          opening_hours: '08:00',
          image: faker.image.imageUrl(),
          description: faker.lorem.paragraph(),
          views: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          CategoryId: Math.floor(Math.random() * 5) + 1
        })
        ), {})

      return await queryInterface.bulkInsert('Categories',
        ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理']
          .map((item, index) =>
          ({
            id: index + 1,
            name: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
          ), {})
    } catch (err) {
      console.warn(err)
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete('Users', null, {})
      await queryInterface.bulkDelete('Restaurants', null, {})
      return await queryInterface.bulkDelete('Categories', null, {})
    } catch (err) {
      console.warn(err)
    }
  }
};
