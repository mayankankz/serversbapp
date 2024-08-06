const Sequelize = require("sequelize");
const sequelize = require("../Utill/connection");

const studentDataModel = sequelize.define(
  "studentData",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    studentname: {
      type: Sequelize.STRING,
      allowNull: true,
      required: true,
    },
    fathersname: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    mothersname: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    class: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    mobilenumber: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    schoolname: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
    },
    schoolcode: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
    },
    samagraid: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    session: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
    },
    imgUrl: {
      type: Sequelize.STRING,
      allowNull: true,
     
    },
    studentidno: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    aadhar: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    dob: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    section: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    housename: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    Bloodgroup: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    other1: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    other2: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    other3: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    isPrinted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    }
  },
  {
    timeStamp: true,
  }
);

module.exports = studentDataModel;
