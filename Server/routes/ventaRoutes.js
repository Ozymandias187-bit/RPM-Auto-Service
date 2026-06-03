const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');
const { verificarAdmin } = require('../middleware/authMiddleware');
const ventaController = require('../controllers/ventaController');

router.get('/', verificarAdmin, ventaController.obtenerVentas);

router.post('/agregar', verificarAdmin, ventaController.registrarVenta);

module.exports = router;
