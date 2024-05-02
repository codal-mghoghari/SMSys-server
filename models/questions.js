"use strict";
const {Model, Sequelize} = require("sequelize");
const {updateData} = require("../util/util");

module.exports = (sequelize, DataTypes) => {
    class Questions extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Questions.hasMany(models.Answers, {
                foreignKey: 'question_id',
                onDelete: 'CASCADE'
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

    Questions.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
            },
            question_type: {
                type: DataTypes.STRING
            },
            question: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Questions",
        }
    );
    return Questions;
};