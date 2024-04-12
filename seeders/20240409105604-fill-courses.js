'use strict';

const { v4: uuid } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let seedCourses = [
      {
        id: uuid(),
        course: "Javascript",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        course: "Typescript",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        course: "cSharp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        course: "Java",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        course: "Python",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        course: "Rust",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    await queryInterface.bulkInsert('Courses', seedCourses, {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Courses', null, {});
  }
};
