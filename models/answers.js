"use strict";
const {Model, Sequelize} = require("sequelize");
const {updateData} = require("../util/util");

module.exports = (sequelize, DataTypes) => {
    class Answers extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Answers.belongsTo(models.Questions, {
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
                            question_type: "required",
                            option: "required",
                            isCorrect: "required",
                        },
                        customMessage: {
                            "required.question_type": "question_type is required",
                            "required.option": "option is required",
                            "required.isCorrect": "isCorrect is required",
                        },
                    };
                    break;
                case "update":
                    rules = {
                        validationRule: {
                            question_type: "required",
                            option: "required",
                            isCorrect: "required",
                        },
                        customMessage: {
                            "required.question_type": "question_type is required",
                            "required.option": "option is required",
                            "required.isCorrect": "isCorrect is required",
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

    Answers.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
            },
            question_type: {
                type: DataTypes.STRING,
            },
            option: DataTypes.STRING,
            isCorrect: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Answers",
        }
    );
    return Answers;
};