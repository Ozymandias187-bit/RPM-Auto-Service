const { Cita, Vehiculo } = require('../models');

// GET /api/citas
exports.listar = async (req, res) => {
  try {
    const citas = await Cita.findAll({
      include: [{ model: Vehiculo, as: 'vehiculo', attributes: ['marca', 'modelo', 'anio'] }],
      order: [['fecha_cita', 'ASC'], ['hora_cita', 'ASC']],
    });
    res.json(citas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/citas/:id
exports.obtener = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id, {
      include: [{ model: Vehiculo, as: 'vehiculo' }],
    });
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json(cita);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/citas
exports.crear = async (req, res) => {
  try {
    const { nombre_cliente, correo_cliente, telefono_cliente, id_vehiculo, fecha_cita, hora_cita, tipo, notas } = req.body;

    // Verificar disponibilidad: misma fecha y hora
    const conflicto = await Cita.findOne({
      where: { fecha_cita, hora_cita, estado: ['pendiente', 'confirmada'] },
    });
    if (conflicto) return res.status(409).json({ error: 'Esa fecha y hora ya están ocupadas' });

    const cita = await Cita.create({ nombre_cliente, correo_cliente, telefono_cliente, id_vehiculo, fecha_cita, hora_cita, tipo, notas });
    res.status(201).json(cita);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/citas/:id
exports.actualizar = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    await cita.update(req.body);
    res.json(cita);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/citas/:id
exports.eliminar = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    await cita.destroy();
    res.json({ mensaje: 'Cita eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/citas/disponibilidad?fecha=YYYY-MM-DD
exports.disponibilidad = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) return res.status(400).json({ error: 'Falta el parámetro fecha' });

    const ocupadas = await Cita.findAll({
      where: { fecha_cita: fecha, estado: ['pendiente', 'confirmada'] },
      attributes: ['hora_cita'],
    });

    // Horarios disponibles de 9am a 6pm cada hora
    const horas = [];
    for (let h = 9; h <= 17; h++) {
      const hora = `${String(h).padStart(2, '0')}:00:00`;
      const ocupada = ocupadas.some(c => c.hora_cita === hora);
      horas.push({ hora, disponible: !ocupada });
    }
    res.json(horas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
