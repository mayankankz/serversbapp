const Sequelize = require("sequelize");

const sequelize = new Sequelize("sbapp", "shivam", "Nivyam@123", {
  dialect: "mysql",
  host: "myassuredness.com",
  port: 3306,
});

module.exports = sequelize;
