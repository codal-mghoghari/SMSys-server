"use strict";
const { Model } = require("sequelize");
const {updateData} = require("../util/CommonUtil");

module.exports = (sequelize, DataTypes) => {
    class Courses extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Courses.belongsToMany(models.Users, {
                through: 'OptedCourses',
                as: 'user',
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
                            course: "required",
                        },
                        customMessage: {
                            "required.course": "course is required",
                        },
                    };
                    break;
                case "update":
                    rules = {
                        validationRule: {
                            courses: "required",
                        },
                        customMessage: {
                            "required.course": "course is required",
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

    Courses.init(
        {
            course: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Courses",
        }
    );
    return Courses;
};