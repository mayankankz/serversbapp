const Sequelize = require('sequelize');
const sequelize = require('../Utill/connection');


const classMaster = sequelize.define('class_master', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    classLabel: {
        type : Sequelize.STRING,
        allowNull : false,
        required: true
    },
    ClassValue: {
        type : Sequelize.STRING,
        allowNull : false,
        required: true
    },
},{
    timeStamp: true
})

module.exports=classMaster;