const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config()
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const jwt = require('./handler/jwt');
const swaggerUi = require("swagger-ui-express");
const errorHandler = require("./handler/error");
const {Sequelize} = require("sequelize");


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(null, {
        explorer: true,
        swaggerUrl: "/api/swagger",
        customSiteTitle: "API",
    })
);

app.use(jwt());
app.use(errorHandler);

require("./routes")(app);
// app.use('/users', usersRouter);

module.exports = app;
