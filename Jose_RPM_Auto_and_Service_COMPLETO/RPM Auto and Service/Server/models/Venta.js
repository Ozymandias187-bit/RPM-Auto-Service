const { DataTypes } = require('sequelize');
const sequelize = require('../config/Db');

const Venta = sequelize.define('Venta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_cliente: { type: DataTypes.STRING(100), allowNull: false },
  correo_cliente: { type: DataTypes.STRING(100) },
  id_vehiculo: { type: DataTypes.INTEGER, allowNull: false },
  precio_venta: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  estado_pago: { type: DataTypes.ENUM('pendiente', 'pagado', 'cancelado'), defaultValue: 'pendiente' },
  contrato_url: { type: DataTypes.STRING(255) },
  notas: { type: DataTypes.TEXT },
}, {
  tableName: 'ventas',
  timestamps: true,
  createdAt: 'fecha_venta',
  updatedAt: false,
});

module.exports = Venta;
