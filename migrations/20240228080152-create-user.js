'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            first_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            last_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            date_of_birth: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            role: {
                type: Sequelize.BOOLEAN,
                defaultValue: 1,
                comment: "0->admin,1->user",
            },
            is_deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: 0,
                comment: "0->active,1->deleted",
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                defaultValue: Sequelize.DataTypes.NOW,
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
                defaultValue: Sequelize.DataTypes.NOW,
                onUpdate: Sequelize.DataTypes.NOW,
            },
            optedCourses: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "none",
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Users");
    }
};
