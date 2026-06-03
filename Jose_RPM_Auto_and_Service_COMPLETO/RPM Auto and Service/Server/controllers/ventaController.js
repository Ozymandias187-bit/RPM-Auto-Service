const { Venta, Vehiculo } = require('../models');

// GET /api/ventas
exports.listar = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: [{ model: Vehiculo, as: 'vehiculo', attributes: ['marca', 'modelo', 'anio', 'precio'] }],
      order: [['fecha_venta', 'DESC']],
    });
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/ventas/:id
exports.obtener = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id, {
      include: [{ model: Vehiculo, as: 'vehiculo' }],
    });
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(venta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/ventas
exports.crear = async (req, res) => {
  try {
    const { nombre_cliente, correo_cliente, id_vehiculo, precio_venta, notas } = req.body;
    const contrato_url = req.file ? `/uploads/${req.file.filename}` : null;

    const vehiculo = await Vehiculo.findByPk(id_vehiculo);
    if (!vehiculo) return res.status(404).json({ error: 'Vehículo no encontrado' });
    if (vehiculo.stock < 1) return res.status(409).json({ error: 'Vehículo sin stock disponible' });

    const venta = await Venta.create({ nombre_cliente, correo_cliente, id_vehiculo, precio_venta, contrato_url, notas });
    await vehiculo.update({ stock: vehiculo.stock - 1 });
    res.status(201).json(venta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/ventas/:id
exports.actualizar = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    const datos = { ...req.body };
    if (req.file) datos.contrato_url = `/uploads/${req.file.filename}`;
    await venta.update(datos);
    res.json(venta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
