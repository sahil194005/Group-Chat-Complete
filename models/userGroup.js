const {DataTypes} = require('sequelize');
const sequelize = require('../db/connect');

const UserGroups = sequelize.define('UserGroups',{
    id:{
        type:DataTypes.INTEGER,
        unique:true,
        autoIncrement:true,
        primaryKey:true

    },

})

module.exports = UserGroups