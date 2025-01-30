module.exports = function errorHandler(err, req, res, next) {
    switch (err.name) {
      case "SequelizeValidationError":
      case "SequelizeUniqueConstraintError":
        res.status(400).json({ message: err.errors[0].message });
        break;
      case "EmailExists":
        res.status(400).json({ message: "Email already taken" });
        break;
      case "BadRequest":
        res.status(400).json({ message: err.message });
        break;
      case "Unauthorized":
        res.status(401).json({ message: err.message });
        break;
      case "Forbidden":
        res.status(403).json({ message: err.message });
        break;
      case "NotFound":
        res.status(404).json({ message: err.message });
        break;
      case "JsonWebTokenError":
        res.status(401).json({ message: "Invalid token" });
        break;
      default:
        res.status(500).json({ message: "Internal Server Error" });
        break;
    }
  };