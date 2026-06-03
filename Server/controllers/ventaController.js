const Venta = require('../models/Venta');
const User = require('../models/User');
const Vehiculo = require('../models/Vehiculo');

exports.registrarVenta = async (req, res) => {
    try {
        const { 
            tipoVenta, 
            detalleServicio, 
            precioFinal, 
            usuarioId, 
            vehiculoId,
            estadoPago 
        } = req.body;

        if (!tipoVenta || !precioFinal || !usuarioId) {
            return res.status(400).json({ message: "Tipo de venta, precio y usuario son obligatorios." });
        }

        if (tipoVenta === 'SERVICIO' && !detalleServicio) {
            return res.status(400).json({ message: "Se debe especificar el detalle del mantenimiento realizado." });
        }

        if (tipoVenta === 'VEHICULO' && !vehiculoId) {
            return res.status(400).json({ message: "Se debe seleccionar un vehículo para la venta de tipo VEHICULO." });
        }

        const nuevaVenta = await Venta.create({
            tipoVenta,
            detalleServicio: tipoVenta === 'SERVICIO' ? detalleServicio : null,
            precioFinal,
            usuarioId,
            vehiculoId: tipoVenta === 'VEHICULO' ? vehiculoId : null,
            estadoPago: estadoPago || 'PAGADO'
        });

        res.status(201).json({ message: "Venta registrada con éxito", venta: nuevaVenta });
    } catch (error) {
        console.error("Error al registrar venta:", error);
        res.status(500).json({ message: "Error interno al registrar la venta." });
    }
};

exports.obtenerVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({ 
            include: ['comprador', 'vehiculo'] 
        });
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};