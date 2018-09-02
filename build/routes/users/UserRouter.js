"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const User_1 = require("../../controllers/User");
/*
    /users
*/
exports.default = express()
    .get('/', User_1.default.getAll)
    .get('/:userId', User_1.default.get)
    .post('/', User_1.default.create)
    .put('/:userId', User_1.default.update)
    .delete('/:userId', User_1.default.delete)
    .param("userId", User_1.default.userId);
//# sourceMappingURL=UserRouter.js.map