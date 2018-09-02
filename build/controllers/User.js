"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../entity/User");
const typeorm_1 = require("typeorm");
let user_find;
class UserController {
    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    getAll(req, res, next) {
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
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    get(req, res, next) {
        res.status(200).json(user_find);
    }
    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    create(req, res, next) {
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
    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    update(req, res, next) {
        user_find.name = req.body.name;
        typeorm_1.getConnection().getRepository(User_1.User).save(user_find)
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
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    delete(req, res, next) {
        typeorm_1.getConnection().getRepository(User_1.User).delete(user_find)
            .then(() => {
            res.status(200).json({ message: "User delete !" });
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
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     * @param  {nNumber} id
     */
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