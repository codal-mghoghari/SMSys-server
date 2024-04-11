const Model = require("../models/index");
const Validator = require("validatorjs");
const ValidationError = require("../handler/error/ValidationError");
const bcrypt = require("bcrypt");
require("dotenv/config");
const {getPaginated, pagination} = require("../util/CommonUtil");
/**
 * @swagger
 * tags:
 *   name: Opted Course
 *   description: The Opted Course managing API
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     OptCourse:
 *       type: object
 *       properties:
 *         courseId:
 *           type: integer
 *           description: The course id
 *         userId:
 *           type: integer
 *           description: The user id
 */

/**
 * @openapi
 * /optcourse:
 *   post:
 *     summary: Create a new User's Opted Course
 *     tags: [OptCourse]
 *    parameters:
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
        const userId = req.params.id;
        let data = {...req.body, userId}
        const courseModel = new Model.OptedCourses();
        const {validationRule, customMessage} = await courseModel.validationRequest(
            "create"
        );
        const allCoursesData = await Model.OptedCourses.findAll({
            where: {userId: userId},
        })
        // If already existing data, it shall not re-add same data.
        const isExist = !!allCoursesData.find((value) => data.userId.toString() === value.dataValues.userId.toString() && data.courseId.toString() === value.dataValues.courseId.toString());
        if (allCoursesData.length > 0 && isExist) {
            return res.status(400).json({status: "ERROR", message: "User with that Course already existing!"});
        }
        const validation = new Validator(data, validationRule, customMessage);
        if (validation.fails()) {
            return next(
                new ValidationError(
                    JSON.parse(JSON.stringify(validation.errors)).errors
                )
            );
        }
        let response = await Model.OptedCourses.create(data);
        return res.status(200).json({data: response, message: "Course created successfully"});
    } catch (e) {
        return res.status(500).json({status: "ERROR", message: e.message});
    }
};

/**
 * @openapi
 * /optcourse:
 *   get:
 *     summary: Returns the list of all the Opted Courses
 *     tags: [OptCourse]
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
        const data = await Model.OptedCourses.findAndCountAll({
            limit: limit,
            offset: offset,
            order: order,
        });
        let response = await pagination(data, page, limit);
        return res.status(200).json({data: response, message: "All courses listed"});
    } catch (e) {
        return res.status(500).json({status: "ERROR", message: e.message});
    }
};

/**
 * @openapi
 * /optcourse/:
 *   get:
 *     summary: Get the courses by user ID
 *     tags: [OptCourse]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: The user was successfully created
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
        const data = req.body;
        const courseModel = new Model.Courses();
        const courseResponse = await Model.OptedCourses.findAll({
            where: {userId: data.userId},
            include: [{
                model: courseModel,
                where: {courseId: data.courseId},
            }]
        })
        if (!courseResponse) {
            return res
                .status(404)
                .json({status: "ERROR", message: "Course not found."});
        }
        return res.status(200).json({data: courseResponse, message: "Course Found!"});
    } catch (e) {
        return res.status(500).json({status: "ERROR", message: e.message});
    }
};

/**
 * @swagger
 * /optcourse/{id}:
 *  put:
 *    summary: Update the course by the userid
 *    tags: [OptCourse]
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
        let updatedData = await optedCourses.prepareUpdateData(data, isUser);
        console.log("updatedData: ", updatedData)
        const userUpdate = await isCourse.update(updatedData);
        return res.status(200).json({data: userUpdate, message: "Saved Changes!"});
    } catch (e) {
        return res.status(500).json({status: "ERROR", message: e.message});
    }
};

/**
 * @swagger
 * /optcourse/{id}:
 *   delete:
 *     summary: Remove the user by id
 *     tags: [OptCourse]
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
        const course = await Model.OptedCourses.findOne({
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
        return res.status(200).json({message: "Item deleted."});
    } catch (e) {
        return res.status(500).json({status: "ERROR", message: e.message});
    }
};