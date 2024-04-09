'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let seedCourses = [
      {
        cid: 1,
        course: "Javascript",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cid: 2,
        course: "Typescript",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cid: 3,
        course: "cSharp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cid: 4,
        course: "Java",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cid: 5,
        course: "Python",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cid: 6,
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
