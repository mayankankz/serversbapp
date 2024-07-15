const Sequelize = require('sequelize');
const sequelize = require('../Utill/connection');


const techersDataModel = sequelize.define('terchersData', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type : Sequelize.STRING,
        allowNull : false,
        required: true
    },
    fathersname: {
       type : Sequelize.STRING,
       allowNull : true,
       defaultValue: null,
    },
    husbandname: {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue: null,
     },
    email: {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue: null,
    },
    address: {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue: null,
    },
    mobilenumber : {
        type: Sequelize.STRING,
        allowNull : true,
        defaultValue: null,
    },
    schoolname: {
        type : Sequelize.STRING,
        allowNull : false,
        required : true,
    },
    schoolcode: {
        type : Sequelize.STRING,
        allowNull : false,
        required : true,
    },
    samagraid: {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue: null,
    },
    empid: {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue: null,
    },
    imgUrl: {
        type : Sequelize.STRING,
        allowNull : false,
        required : true
    },
    designation:{
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue: null,
    },
    aadhar:{
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue: null,
    },
    dob:{
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue: null,
    },
    Bloodgroup:{
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue: null,
    },
    validfrom: {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue: null,
    },
    validTill: {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue: null,
    },
    other1: {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue: null, 
    }
    ,
    other2: {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue: null, 
    }
    ,
    other3: {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue: null, 
    }
   
},{
    timeStamp: true
})

module.exports= techersDataModel;