const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
module.exports = class userController {
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      let checkUser = await User.findOne({ where: { email } });

      if (checkUser) {
        throw { name: "EmailExists" };
      }

      let newUser = await User.create({ name, email, password });
      const token = signToken({ id: newUser.id, email });
      res
        .status(201)
        .json({ token, user: { id: newUser.id, email: newUser.email } });
    } catch (error) {
      console.log(error, "<-- error dari register");
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw {
          name: "BadRequest",
          message: "Email and Password are required",
        };
      }
      let foundUser = await User.findOne({ where: { email } });
      if (!foundUser) {
        throw { name: "NotFound", message: "Email is not registered" };
      }
      let checkPassword = comparePassword(password, foundUser.password);
      if (!checkPassword)
        throw { name: "Unauthorized", message: "Email or Password is Invalid" };
      const token = signToken({ id: foundUser.id, email });
      res
        .status(200)
        .json({ token, user: { id: foundUser.id, email: foundUser.email } });
    } catch (error) {
      next(error);
      console.log(error, "<-- error dari login");
    }
  }
};
