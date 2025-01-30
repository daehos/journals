const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");
module.exports = async function authentication(req, res, next) {
  const bearerToken = req.headers["authorization"];
  if (!bearerToken) {
    next({ name: "Unauthorized", message: "Unauthorized error" });
    return;
  }
  const [, token] = bearerToken.split(" ");
  if (!token) {
    next({ name: "Unauthorized", message: "Unauthorized error" });
    return;
  }

  try {
    const data = verifyToken(token);

    const user = await User.findByPk(data.id);
    if (!user) {
      next({ name: "Unauthorized", message: "Invalid Token" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
