const { DataTypes } = require('sequelize');
const sequelize = require('../config/Db');
const User = require('./User');
const Vehiculo = require('./Vehiculo');

const Venta = sequelize.define('Venta', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fechaVenta: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    tipoVenta: { 
        type: DataTypes.ENUM('VEHICULO', 'SERVICIO'), 
        allowNull: false,
        defaultValue: 'VEHICULO'
    },
    detalleServicio: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    },
    precioFinal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    estadoPago: { 
        type: DataTypes.ENUM('PENDIENTE', 'PAGADO', 'CANCELADO'), 
        defaultValue: 'PENDIENTE' 
    },
    contratoUrl: { type: DataTypes.TEXT }
}, {
    tableName: 'Ventas',
    timestamps: true
});

// Definición de Relaciones
Venta.belongsTo(User, { foreignKey: 'usuarioId', as: 'comprador' });
Venta.belongsTo(Vehiculo, { foreignKey: 'vehiculoId', as: 'vehiculo' });

module.exports = Venta;