const Sequelize = require('sequelize');
const sequelize = require('../Utill/connection');


const schoolsModel = sequelize.define('school', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    schoolname: {
        type : Sequelize.STRING,
        allowNull : false,
        required: true
    },
    schoolcode: Sequelize.INTEGER,
},{
    timeStamp: true
})

module.exports=schoolsModel;