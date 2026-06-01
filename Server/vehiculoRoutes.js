const express = require('express');
const router = express.Router();
const Vehiculo = require('./models/Vehiculo'); 

router.get('/', async (req, res) => {
    try {
        const vehiculos = await Vehiculo.findAll();
        res.json(vehiculos);
    } catch (err) {
        res.status(500).json({ message: "Error SQL al obtener vehículos" });
    }
});

module.exports = router;