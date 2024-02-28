const AuthController = require("../controllers/authController");
const SwaggerController = require("../controllers/SwaggerController");
const path = require("path");
const verifyJWT = require("../handler/verifyJWT");
const verifyAdmin = require("../handler/isAdmin");

module.exports = (app) => {

    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/swagger", SwaggerController.getItem);

    app.post("/api/login", AuthController.login);
    app.post("/api/logout", AuthController.logout);
    app.post("/api/signup", AuthController.signup);

    //
    // app.get("/api/*/:id", [verifyJWT, verifyAdmin], async (req, res, next) => {
    //     const url = req.url.split("/");
    //     const rootPath = path.join(__dirname, "../");
    //     const controllerName = url[2] + "controller.js";
    //     const controllerObject = require(rootPath +
    //         "controllers/" +
    //         controllerName);
    //     return await controllerObject.readItem(req, res, next);
    // });
    //
    // app.get("/api/*", [verifyJWT], async (req, res, next) => {
    //     let url = req.url.substring(0, req.url.indexOf("?")).split("/");
    //     url = url != "" ? url : req.url.split("/");
    //     const rootPath = path.join(__dirname, "../");
    //     const controllerName = url[2] + "controller.js";
    //     const controllerObject = require(rootPath +
    //         "controllers/" +
    //         controllerName);
    //     return await controllerObject.listItem(req, res, next);
    // });
    //
    // app.post("/api/*", [verifyJWT], async (req, res, next) => {
    //     const url = req.url.split("/");
    //     const rootPath = path.join(__dirname, "../");
    //     const controllerName = url[2] + "controller.js";
    //     const controllerObject = require(rootPath +
    //         "controllers/" +
    //         controllerName);
    //     return await controllerObject.createItem(req, res, next);
    // });
    //
    // app.put("/api/*/:id", [verifyJWT], async (req, res, next) => {
    //     const url = req.url.split("/");
    //     const rootPath = path.join(__dirname, "../");
    //     const controllerName = url[2] + "controller.js";
    //     const controllerObject = require(rootPath +
    //         "controllers/" +
    //         controllerName);
    //     return await controllerObject.updateItem(req, res, next);
    // });
    //
    // app.delete("/api/*/:id", [verifyJWT], async (req, res, next) => {
    //     const url = req.url.split("/");
    //     const rootPath = path.join(__dirname, "../");
    //     const controllerName = url[2] + "controller.js";
    //     const controllerObject = require(rootPath +
    //         "controllers/" +
    //         controllerName);
    //     return await controllerObject.deleteItem(req, res, next);
    // });
};