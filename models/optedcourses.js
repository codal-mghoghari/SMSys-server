"use strict";
const { Model } = require("sequelize");
const {updateData} = require("../util/util");

module.exports = (sequelize, DataTypes) => {
    class OptedCourses extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            OptedCourses.belongsTo(models.Courses, {
                through: 'Courses',
                foreignKey: 'courseId',
                onDelete: 'CASCADE',
            })
        }
        validationRequest = async (action) => {
            let rules;
            switch (action) {
                case "create":
                    rules = {
                        validationRule: {
                            courseId: "required",
                            userId: "required",
                        },
                        customMessage: {
                            "required.courseId": "optedCourseID is required",
                            "required.userId": "userID is required",
                        },
                    };
                    break;
                case "update":
                    rules = {
                        validationRule: {
                            courseId: "required",
                            userId: "required",
                        },
                        customMessage: {
                            "required.courseId": "optedCourseID is required",
                            "required.userId": "userID is required",
                        },
                    };
                    break;
                case "delete":
                    rules = {
                        validationRule: {
                            courseId: "required",
                            userId: "required",
                        },
                        customMessage: {
                            "required.courseId": "optedCourseID is required",
                            "required.userId": "userID is required",
                        },
                    };
                    break;
                default:
                    rules = {};
            }
            return rules;
        };

        prepareUpdateData = async (newData, defaultData) => {
            let data = {};
            for (const item of Object.keys(newData)) {
                data[item] = await updateData(item, newData, defaultData);
            }
            return data;
        };
    }

    OptedCourses.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            courseId: {
                type: DataTypes.UUID,
                references: {
                    model: "Courses",
                    key: 'id'
                }
            },
            userId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Users",
                    key: 'id'
                }
            },
        },
        {
            sequelize,
            modelName: "OptedCourses",
        }
    );

    return OptedCourses;
};