const sequelize = require('../db/connect');
const {DataTypes} = require('sequelize')

const Chat = sequelize.define('chats',{
    id:{
        primaryKey:true,
        autoIncrement:true,
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    message:{
        type:DataTypes.STRING
    },
    name:{
        type:DataTypes.STRING
    },
    type:{
        type:DataTypes.STRING
    }
})

module.exports = Chat;