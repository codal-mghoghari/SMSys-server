const Model = require("../models/index");
const Validator = require("validatorjs");
const ValidationError = require("../handler/error/ValidationError");
const bcrypt = require("bcrypt");
require("dotenv/config");
const {getPaginated, pagination} = require("../util/util");
const e = require("express");

/**
 * @swagger
 * tags:
 *   name: Quiz
 *   description: The Quiz managing API
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The row id
 *         question_id:
 *           type: integer
 *           description: The question id
 */

/**
 * @openapi
 * /recomm:
 *   post:
 *     summary: Create a new Quiz Entry
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OptCourse'
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: The opted course was successfully created
 *       400:
 *         description: validation error
 *       401:
 *         description: unauthorized
 *       500:
 *         description: Some server error
 */
exports.createItem = async (req, res, next) => {
    try {
        // const userId = req.params.id;
        // const reqBody = req.body
        // let data = {...reqBody, userId}
        // const courseModel = new Model.RecommCourses();
        // const {validationRule, customMessage} = await courseModel.validationRequest(
        //     "create"
        // );
        // const allCoursesData = await Model.RecommCourses.findAll({
        //     where: {userId: userId},
        // })
        // // If already existing data, it shall not re-add same data.
        // const isExist = !!allCoursesData.find((value) => data.userId.toString() === value.dataValues.userId.toString() && data.courseId.toString() === value.dataValues.courseId.toString());
        // if (allCoursesData.length > 0 && isExist) {
        //     return res.status(200).json({status: "ERROR", message: "User with that Course already existing!"});
        // }
        // const validation = new Validator(data, validationRule, customMessage);
        // if (validation.fails()) {
        //     return next(
        //         new ValidationError(
        //             JSON.parse(JSON.stringify(validation.errors)).errors
        //         )
        //     );
        // }
        // let response = await Model.RecommCourses.create(data);
        // return res.status(200).json({status: "SUCCESS", data: response, message: "Course opted successfully"});
    } catch (e) {
        return res.status(500).json({status: "ERROR", message: e.message});
    }
};

/**
 * @openapi
 * /quiz:
 *   get:
 *     summary: Returns the list of all the Quiz
 *     tags: [Quiz]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: query
 *         name:  page
 *         type: integer
 *       - in: query
 *         name: size
 *         type: integer
 *       - in: query
 *         name: sortKey
 *         type: string
 *       - in: query
 *         name: search
 *         type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *          type: string
 *          enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: The user was successfully created
 *       400:
 *         description: validation error
 *       401:
 *         description: unauthorized
 *       500:
 *         description: Some server error
 *
 */
exports.listItems = async (req, res, next) => {
    try {
        const {page, size, search, sortBy, sortKey} = req.query;
        const {limit, offset} = await getPaginated(size, page);
        const order = [[sortKey ? sortKey : "id", sortBy ? sortBy : "DESC"]];
        const data = await Model.Questions.findAndCountAll({
            limit: limit,
            offset: offset,
            order: order,
            attributes: ['id', 'question_type', 'question'],
            include: [{
                model: Model.Answers,
                required: false,
                attributes: ['id', 'question_id', 'question_type', 'option']
            }],
        });
        let paginatedResponse = await pagination(data, page, limit);
        return res.status(200).json({status: "SUCCESS", data: paginatedResponse, message: "All quiz data listed"});
    } catch (e) {
        return res.status(500).json({status: "ERROR", message: e.message});
    }
};

/**
 * @openapi
 * /quiz/{id}:
 *   get:
 *     summary: Get the Quiz by question ID
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The question id
 *       - in: path
 *         name: isCorrect
 *         schema:
 *           type: integer
 *         required: false
 *         description: isCorrect Option
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: The course  was successfully listed
 *       400:
 *         description: validation error
 *       401:
 *         description: unauthorized
 *       404:
 *         description: No user found
 *       500:
 *         description: Some server error
 */
exports.getItem = async (req, res, next) => {
    try {
        const id = req.params.id;
        const {isCorrect} = req.query;
        if (isCorrect) {
            const courseResponse = await Model.Answers.findAll({
                    where: {id: id, isCorrect: isCorrect},
                attributes: ['id', 'question_id', 'question_type', 'option']
            })
            if (!courseResponse) {
                return res
                    .status(404)
                    .json({status: "ERROR", message: "Option not found."});
            }
            return res.status(200).json({status: "SUCCESS", data: courseResponse, message: "Option Found!"});
        } else {
            const courseResponse = await Model.Answers.findAll({
                where: {question_id: id},
                attributes: ['id', 'question_id', 'question_type', 'option']
            })
            if (!courseResponse) {
                return res
                    .status(404)
                    .json({status: "ERROR", message: "Course not found."});
            }
            return res.status(200).json({status: "SUCCESS", data: courseResponse, message: "Course Found!"});
        }
    } catch (e) {
        return res.status(500).json({status: "ERROR", message: e.message});
    }
};

/**
 * @swagger
 * /quiz/{id}:
 *  put:
 *    summary: Update the RecommCourses by the userid
 *    tags: [Quiz]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    security:
 *       - jwt: []
 *    responses:
 *      200:
 *        description: The user was updated
 *      401:
 *         description: unauthorized
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */

// TODO()
exports.updateItem = async (req, res, next) => {
    try {
        const id = req.params.id;
        const optedCourses = new Model.OptedCourses();
        let {validationRule, customMessage} = await optedCourses.validationRequest(
            "update"
        );
        const validation = new Validator(data, validationRule, customMessage);
        if (validation.fails()) {
            return next(
                new ValidationError(
                    JSON.parse(JSON.stringify(validation.errors)).errors
                )
            );
        }

        const isCourse = await Model.OptedCourses.findOne({
            where: {
                userId: id,
            },
        });
        if (!isCourse) {
            return res.status(404).json({message: "Course not found"});
        }
        let updatedData = await optedCourses.prepareUpdateData(data, isCourse);
        console.log("updatedData: ", updatedData)
        const userUpdate = await isCourse.update(updatedData);
        return res.status(200).json({status: "SUCCESS", data: userUpdate, message: "Saved Changes!"});
    } catch (e) {
        return res.status(500).json({status: "ERROR", message: e.message});
    }
};

/**
 * @swagger
 * /quiz/{id}:
 *   delete:
 *     summary: Remove the user by id
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The course id
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: The course was deleted
 *       400:
 *         description: The given id is not valid
 *       401:
 *         description: unauthorized
 *       404:
 *         description: The user was not found
 */
exports.deleteItem = async (req, res, next) => {
    try {
        const id = req.params.id;
        const course = await Model.RecommCourses.findOne({
            where: {
                courseId: id,
            },
        });
        if (!course) {
            return res
                .status(404)
                .json({status: "ERROR", message: "Course not found."});
        }
        await course.destroy();
        return res.status(200).json({status: "SUCCESS", message: "Removed Recommended Course successfully!"});
    } catch (e) {
        return res.status(500).json({status: "ERROR", message: e.message});
    }
};