const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");
const { OAuth2Client } = require("google-auth-library");
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

  static async googleLogin(req, res, next) {
    try {
      // hooks option
      const { googletoken } = req.headers;

      const client = new OAuth2Client();

      const ticket = await client.verifyIdToken({
        idToken: googletoken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      let user = await User.findOne({
        where: {
          email: payload.email,
        },
      });

      if (!user) {
        user = await User.create(
          {
            email: payload.email,
            password: "googlelogin",
          },
          {
            hooks: false,
          }
        );
      } else {
        if (user.password !== "googlelogin") {
          throw { name: "GoogleFailed" };
        }
      }

      const access_token = signToken({ id: user.id });

      res.status(200).json({
        access_token,
      });
    } catch (err) {
      console.log(err, "<--- err");

      if (err.name === "GoogleFailed") {
        res
          .status(500)
          .json({ message: "You already registered with our app" });
      } else {
        res.status(500).json({ message: "ISE" });
      }
    }
  }
};
