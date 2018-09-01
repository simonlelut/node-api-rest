"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const UserRouter_1 = require("./users/UserRouter");
const router = express();
router.get('/', (req, res) => {
    res.send({ msg: "Welcome to my API ! " });
});
router.use('/users', UserRouter_1.default);
router.all('*', (req, res) => {
    res.status(404).send({ msg: "route not found" });
});
exports.default = router;
//# sourceMappingURL=routes.js.map