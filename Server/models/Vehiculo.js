const { DataTypes } = require('sequelize');
const sequelize = require('../config/Db'); // Sube un nivel para encontrar la config

const Vehiculo = sequelize.define('Vehiculo', {
    marca: { type: DataTypes.STRING, allowNull: false },
    modelo: { type: DataTypes.STRING, allowNull: false },
    anio: { type: DataTypes.INTEGER, allowNull: false },
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
    tableName: 'Vehiculos' 
});

module.exports = Vehiculo;