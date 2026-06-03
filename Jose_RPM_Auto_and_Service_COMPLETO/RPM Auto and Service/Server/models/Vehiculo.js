const { DataTypes } = require('sequelize');
const sequelize = require('../config/Db');

const Vehiculo = sequelize.define('Vehiculo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  marca: { type: DataTypes.STRING(50), allowNull: false },
  modelo: { type: DataTypes.STRING(50), allowNull: false },
  anio: { type: DataTypes.INTEGER, allowNull: false },
  precio: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 1 },
  descripcion: { type: DataTypes.TEXT },
  imagen_url: { type: DataTypes.STRING(255) },
}, {
  tableName: 'vehiculos',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: false,
});

module.exports = Vehiculo;
