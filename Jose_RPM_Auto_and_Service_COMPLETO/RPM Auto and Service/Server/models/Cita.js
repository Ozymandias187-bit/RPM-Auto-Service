const { DataTypes } = require('sequelize');
const sequelize = require('../config/Db');

const Cita = sequelize.define('Cita', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_cliente: { type: DataTypes.STRING(100), allowNull: false },
  correo_cliente: { type: DataTypes.STRING(100) },
  telefono_cliente: { type: DataTypes.STRING(20) },
  id_vehiculo: { type: DataTypes.INTEGER, allowNull: false },
  fecha_cita: { type: DataTypes.DATEONLY, allowNull: false },
  hora_cita: { type: DataTypes.TIME, allowNull: false },
  tipo: { type: DataTypes.ENUM('visita', 'compra'), defaultValue: 'visita' },
  estado: { type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada'), defaultValue: 'pendiente' },
  notas: { type: DataTypes.TEXT },
}, {
  tableName: 'citas',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: false,
});

module.exports = Cita;
