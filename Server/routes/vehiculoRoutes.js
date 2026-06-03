// Server/routes/vehiculoRoutes.js
const express = require('express');
const router = express.Router();

// Importamos las funciones desde el controlador limpio
const { 
    obtenerVehiculos, 
    agregarVehiculo, 
    actualizarVehiculo, 
    eliminarVehiculo 
} = require('../controllers/vehiculoController');

// Mapeo de endpoints HTTP
router.get('/', obtenerVehiculos);
router.post('/agregar', agregarVehiculo);
router.put('/editar/:id', actualizarVehiculo);
router.delete('/eliminar/:id', eliminarVehiculo);

module.exports = router;