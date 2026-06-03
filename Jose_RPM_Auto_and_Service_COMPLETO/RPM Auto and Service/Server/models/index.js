const sequelize = require('../config/Db');
const Vehiculo = require('./Vehiculo');
const Cita = require('./Cita');
const Venta = require('./Venta');

// Asociaciones
Vehiculo.hasMany(Cita, { foreignKey: 'id_vehiculo', as: 'citas' });
Cita.belongsTo(Vehiculo, { foreignKey: 'id_vehiculo', as: 'vehiculo' });

Vehiculo.hasMany(Venta, { foreignKey: 'id_vehiculo', as: 'ventas' });
Venta.belongsTo(Vehiculo, { foreignKey: 'id_vehiculo', as: 'vehiculo' });

module.exports = { sequelize, Vehiculo, Cita, Venta };
