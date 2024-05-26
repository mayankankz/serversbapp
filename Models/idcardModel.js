const Sequelize = require("sequelize");
const sequelize = require("../Utill/connection");

const IdCardModel = sequelize.define(
  "idcard",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    elements: {
      type: Sequelize.JSON,
      allowNull: false,
      required: true,
    },
    layout: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
    },
    backgroundImage: Sequelize.TEXT('long')	,
  },
  {
    timeStamp: true,
  }
);

module.exports = IdCardModel;
