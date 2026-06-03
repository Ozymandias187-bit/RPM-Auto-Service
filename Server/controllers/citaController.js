const Cita = require('../models/Cita');

exports.crearCita = async (req, res) => {
    try {
        const { fecha, hora, tipo, usuarioId, vehiculoId, comentarios } = req.body;

        // 1. Validaciones básicas
        if (!fecha || !hora || !usuarioId || !vehiculoId) {
            return res.status(400).json({ message: "Todos los campos son obligatorios para agendar." });
        }

        // 2. Validar horario (Jose's guide: 9am - 5pm)
        const horaNum = parseInt(hora.split(':')[0]);
        if (horaNum < 9 || horaNum > 17) {
            return res.status(400).json({ message: "Las citas solo se pueden agendar entre las 9:00 AM y 5:00 PM." });
        }

        // 3. Verificar si el bloque ya está ocupado para ese vehículo
        const citaExistente = await Cita.findOne({
            where: { fecha, hora, vehiculoId }
        });

        if (citaExistente) {
            return res.status(400).json({ message: "Este horario ya está reservado para este vehículo. Por favor elige otro." });
        }

        // 4. Crear la cita
        const nuevaCita = await Cita.create({
            fecha,
            hora,
            tipo: tipo || 'VISITA',
            usuarioId,
            vehiculoId,
            comentarios
        });

        res.status(201).json({ message: "¡Cita agendada con éxito!", cita: nuevaCita });
    } catch (error) {
        console.error("Error al crear cita:", error);
        res.status(500).json({ message: "Error interno del servidor al agendar la cita." });
    }
};

exports.obtenerTodasCitas = async (req, res) => {
    try {
        const citas = await Cita.findAll({
            include: [
                { model: require('../models/User'), as: 'cliente', attributes: ['nombre', 'correo', 'telefono'] },
                { model: require('../models/Vehiculo'), as: 'vehiculo', attributes: ['marca', 'modelo', 'anio', 'precio'] }
            ],
            order: [['fecha', 'ASC'], ['hora', 'ASC']]
        });
        res.status(200).json(citas);
    } catch (error) {
        console.error("Error al obtener todas las citas:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener todas las citas." });
    }
};

exports.obtenerCitasPorUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        const citas = await Cita.findAll({
            where: { usuarioId },
            include: [
                { model: require('../models/Vehiculo'), as: 'vehiculo', attributes: ['marca', 'modelo', 'anio'] }
            ],
            order: [['fecha', 'ASC'], ['hora', 'ASC']]
        });
        res.status(200).json(citas);
    } catch (error) {
        console.error("Error al obtener citas del usuario:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener las citas." });
    }
};