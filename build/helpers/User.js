"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../entity/User");
const typeorm_1 = require("typeorm");
class UserController {
    /**
     * @param  {express.Request} req
     * @param  {express.Response} res
     * @param  {express.NextFunction} next
     */
    getUser(req, res, next) {
        typeorm_1.getConnection().getRepository(User_1.User)
            .findOne({
            id: req.query.id,
        })
            .then((data) => {
            res.status(200).json(data);
        })
            .catch((error) => {
            res.status(500).json({
                error: error.message,
                errorStack: error.stack
            });
            next(error);
        });
    }
    /**
     * @param  {express.Request} req
     * @param  {express.Response} res
     * @param  {express.NextFunction} next
     */
    createUser(req, res, next) {
        const user = new User_1.User();
        user.name = req.body.name;
        typeorm_1.getConnection().getRepository(User_1.User).save(user)
            .then((data) => {
            res.status(200).json(data);
        })
            .catch((error) => {
            res.status(500).json({
                error: error.message,
                errorStack: error.stack
            });
            next(error);
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=User.js.map