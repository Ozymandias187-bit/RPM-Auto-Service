const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('rpm_auto_service', 'postgres', process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

module.exports = sequelize;