const sequelize = require("../db/connect");
const { Sequelize, DataTypes } = require("sequelize");

const User = sequelize.define("users", {
	id: {
		type: DataTypes.INTEGER,
		unique: true,
		allowNull:false,
		primaryKey:true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
	},
	email: {
		type: DataTypes.STRING,
		unique: true,
	},
	phoneNo: {
		type: DataTypes.BIGINT,
	},
	password:{
		type:DataTypes.STRING
	}
});

module.exports = User;   


// const sequelize = require("../db/connect");
// const { Sequelize, DataTypes } = require("sequelize");

// const User = sequelize.define("users", {
// 	id: {
// 		autoIncrement: true,
// 		unique: true,
// 		allowNull: false,
// 		type: DataTypes.INTEGER,
// 		primaryKey: true,
// 	},
// 	name: {
// 		type: DataTypes.STRING,
// 	},
// 	email: {
// 		type: DataTypes.STRING,
// 		allowNull:false,
// 		unique:true,
// 	},
// 	password: {
// 		type: DataTypes.STRING,
// 	},
// 	ispremiumuser:DataTypes.BOOLEAN,
// 	total_cost:{
// 		type:DataTypes.INTEGER,
// 		defaultValue:0
// 	}
// });

// module.exports = User;