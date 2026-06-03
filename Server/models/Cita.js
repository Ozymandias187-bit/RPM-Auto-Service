const { DataTypes } = require('sequelize');
const sequelize = require('../config/Db');
const User = require('./User');
const Vehiculo = require('./Vehiculo');

const Cita = sequelize.define('Cita', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    hora: { type: DataTypes.TIME, allowNull: false },
    tipo: { 
        type: DataTypes.ENUM('VISITA', 'COMPRA'), 
        defaultValue: 'VISITA' 
    },
    estado: { 
        type: DataTypes.ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA'), 
        defaultValue: 'PENDIENTE' 
    },
    comentarios: { type: DataTypes.TEXT }
}, {
    tableName: 'Citas',
    timestamps: true
});

// Definición de Relaciones
Cita.belongsTo(User, { foreignKey: 'usuarioId', as: 'cliente' });
Cita.belongsTo(Vehiculo, { foreignKey: 'vehiculoId', as: 'vehiculo' });

module.exports = Cita;