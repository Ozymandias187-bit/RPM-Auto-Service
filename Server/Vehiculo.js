JavaScript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/Db');

const Vehiculo = sequelize.define('Vehiculo', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    marca: { type: DataTypes.STRING, allowNull: false },
    modelo: { type: DataTypes.STRING, allowNull: false },
    anio: { type: DataTypes.INTEGER, allowNull: false },
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
    tableName: 'vehiculos', // Asegúrate de que esto coincida EXACTAMENTE con tu tabla en pgAdmin
    timestamps: false
});

module.exports = Vehiculo;