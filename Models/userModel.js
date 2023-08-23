const Sequelize = require('sequelize');
const sequelize = require('../Utill/connection');


const userModel = sequelize.define('user', {
    userid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
   
    username: {
        type : Sequelize.STRING,
        allowNull : false,
        required: true
    },
    password: {
       type : Sequelize.STRING,
        allowNull : false,
        required: true
    },
    Schoolname: {
        type : Sequelize.STRING,
        allowNull : false,
        required: true
    },
    schoolcode: Sequelize.INTEGER,
    email : Sequelize.STRING,
    validationoptions : Sequelize.JSON,
    isAdmin : {
        type: Sequelize.BOOLEAN,
        default: false,
    }
},{
    timeStamp: true
})

module.exports=userModel;