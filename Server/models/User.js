const { DataTypes } = require('sequelize');
const sequelize = require('../config/Db');

const User = sequelize.define('User', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    nombre: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    nombreUsuario: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        field: 'nombreusuario' 
    },
    correo: { 
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false,
        field: 'email' 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    telefono: { 
        type: DataTypes.STRING 
    },
    zona: { 
        type: DataTypes.STRING 
    },
    rol: { 
        type: DataTypes.STRING, 
        defaultValue: 'USER' 
    }
}, {
    tableName: 'usuarios', 
    timestamps: false
});

module.exports = User;