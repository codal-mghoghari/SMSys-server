'use strict';

const {hashSync} = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        first_name: "Margav",
        last_name: "Ghoghari",
        email: "mghoghari@codal.com",
        password: hashSync("123456", 10),
        date_of_birth: "2001-12-08",
        role: 0,
        is_deleted: 0,
        entry_test: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert('Users', users, {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
