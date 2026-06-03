const { Vehiculo } = require('../models');

// GET /api/vehiculos
exports.listar = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.findAll({ order: [['fecha_creacion', 'DESC']] });
    res.json(vehiculos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/vehiculos/:id
exports.obtener = async (req, res) => {
  try {
    const v = await Vehiculo.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: 'Vehículo no encontrado' });
    res.json(v);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/vehiculos
exports.crear = async (req, res) => {
  try {
    const { marca, modelo, anio, precio, stock, descripcion } = req.body;
    const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;
    const vehiculo = await Vehiculo.create({ marca, modelo, anio, precio, stock, descripcion, imagen_url });
    res.status(201).json(vehiculo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/vehiculos/:id
exports.actualizar = async (req, res) => {
  try {
    const v = await Vehiculo.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: 'Vehículo no encontrado' });
    const datos = { ...req.body };
    if (req.file) datos.imagen_url = `/uploads/${req.file.filename}`;
    await v.update(datos);
    res.json(v);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/vehiculos/:id
exports.eliminar = async (req, res) => {
  try {
    const v = await Vehiculo.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: 'Vehículo no encontrado' });
    await v.destroy();
    res.json({ mensaje: 'Vehículo eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
