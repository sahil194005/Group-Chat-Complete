const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");

const Group = sequelize.define("group", {
	id: {
		unique: true,
		primaryKey: true,
		autoIncrement: true,
		type: DataTypes.INTEGER,
	},
	groupName: {
		type: DataTypes.STRING,
	},
	createdBy:{
		type:DataTypes.INTEGER
	} 
   
});

module.exports = Group;
