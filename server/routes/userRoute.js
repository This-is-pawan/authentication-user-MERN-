// routes/userRoutes.js

const express = require('express');
const { getUserData } = require("../controller/userController");
const { userAuth } = require("../middlware/userAuth");
const userRoter = express.Router();

userRoter.get('/data', userAuth, getUserData); // changed GET to POS

module.exports = { userRoter };
