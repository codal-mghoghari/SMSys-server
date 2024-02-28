'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const users = [
            {
                first_name: "Margav",
                last_name: "Ghoghari",
                email: "mghoghari@codal.com",
                password: bcrypt.hashSync("123", 10),
                date_of_birth: "2001-12-08",
                role: 0,
            },
        ];
        await queryInterface.bulkInsert("Users", users, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Users", null, {});
    }
};
