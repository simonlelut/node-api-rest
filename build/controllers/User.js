"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../entity/User");
const typeorm_1 = require("typeorm");
let user_find;
class UserController {
    /**
     * @param  {express.Request} req
     * @param  {express.Response} res
     * @param  {express.NextFunction} next
     */
    getUsers(req, res, next) {
        //console.log(req.app.get('config')) //getConfig
        typeorm_1.getConnection().getRepository(User_1.User)
            .find()
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
    userId(req, res, next, id) {
        typeorm_1.getConnection().getRepository(User_1.User).findOne({ id: id })
            .then((user) => {
            if (!user)
                return res.status(404).json("this User doesn't exist !");
            user_find = user;
            next();
        })
            .catch((error) => {
            res.status(500).json({
                error: error.message,
                errorStack: error.stack
            });
            res.status(404).json("this User doesn't exist !");
            next(error);
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=User.js.map