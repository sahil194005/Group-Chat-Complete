const { Sequelize } = require("sequelize");
const mysql = require('mysql2')

const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD, { host: `localhost`, dialect: "mysql",logging:false });

module.exports = sequelize;


