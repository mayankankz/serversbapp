const Sequelize = require('sequelize');
const sequelize = require('../Utill/connection');


const invoiceModel = sequelize.define('invoice', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    invoicenumber: {
        type : Sequelize.STRING,
        required: true,
        allowNull : false,
    },
    name: {
        type : Sequelize.STRING,
        allowNull : false,
        required: true
    },
    companyname: {
        type : Sequelize.STRING,
        required: false,
        allowNull : false,
    },
    address: {
       type : Sequelize.STRING,
        allowNull : false,
        required: true
    },
    mobile: {
        type : Sequelize.STRING,
        allowNull : false,
        required: true
    },
    isgstbill: {
        type : Sequelize.BOOLEAN,
        defaultValue: false,
    },
    gstnumber: {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue: null,
    },
    email : {
       type : Sequelize.STRING,
       allowNull : false,
       required: false
    },
    items :{
        type : Sequelize.JSON,
        required : true,
    },
    issuedate : {
        type: Sequelize.STRING,
        required : true,
    },
    duedate : {
        type: Sequelize.STRING,
        required : true,
    },
    discount : {
        type: Sequelize.JSON,
        required : false,
        allowNull: true,
        defaultValue: null
    },
    taxes : {
        type: Sequelize.JSON,
        required : false,
        allowNull: true,
        defaultValue: null
    },
    status : {
        type: Sequelize.STRING,
        required : true,
    },
    total : {
        type: Sequelize.STRING,
        required : true
    } 
},{
    timeStamp: true
})

module.exports = invoiceModel;