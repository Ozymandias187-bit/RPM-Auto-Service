const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');
const citaController = require('../controllers/citaController');
const { verificarAdmin } = require('../middleware/authMiddleware'); // Importar el middleware

router.post('/agregar', citaController.crearCita);

router.get('/all', verificarAdmin, citaController.obtenerTodasCitas); // Nueva ruta para administradores
router.get('/usuario/:usuarioId', citaController.obtenerCitasPorUsuario);
router.get('/', async (req, res) => {
    try {
        const citas = await Cita.findAll({ include: ['cliente', 'vehiculo'] });
        res.json(citas);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
