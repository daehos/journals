"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Journal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Journal.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  Journal.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "UserId Required" },
          notEmpty: { msg: "UserId Required" },
        },
      },
      date: DataTypes.DATE,
      content: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Content Required" },
          notEmpty: { msg: "Content Required" },
        },
      },
      ai_insight: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "ai_insight Required" },
          notEmpty: { msg: "ai_insight Required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Journal",
    }
  );
  return Journal;
};
