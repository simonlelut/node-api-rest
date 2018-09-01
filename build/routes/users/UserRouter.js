"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const User_1 = require("../../controllers/User");
/*
    /users
*/
exports.default = express()
    .post('/', User_1.default.createUser)
    .get('/', User_1.default.getUsers)
    .param("userId", User_1.default.userId);
//# sourceMappingURL=UserRouter.js.map