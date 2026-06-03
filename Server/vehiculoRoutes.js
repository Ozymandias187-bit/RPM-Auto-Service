const express = require('express');
const router = express.Router();
const vehiculoController = require('./controllers/vehiculoController');
const { verificarAdmin } = require('./middleware/authMiddleware');

// Rutas unificadas con la lógica del controlador
router.get('/', vehiculoController.obtenerVehiculos);
router.post('/agregar', verificarAdmin, vehiculoController.agregarVehiculo);
router.put('/editar/:id', verificarAdmin, vehiculoController.actualizarVehiculo);
router.delete('/eliminar/:id', verificarAdmin, vehiculoController.eliminarVehiculo);

module.exports = router;