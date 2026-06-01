const { DataTypes } = require('sequelize');
const sequelize = require('../config/Db');

const User = sequelize.define('User', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    nombreUsuario: { type: DataTypes.STRING, allowNull: false },
    correo: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING },
    zona: { type: DataTypes.STRING },
    rol: { type: DataTypes.STRING, defaultValue: 'USER' }
});

module.exports = User;