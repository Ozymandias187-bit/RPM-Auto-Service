// Server/controllers/vehiculoController.js
const Vehiculo = require('../models/Vehiculo'); 

// 1. Obtener todos los vehículos
const obtenerVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.findAll();
        res.json(vehiculos);
    } catch (error) {
        console.error("Error al obtener vehículos:", error);
        res.status(500).json({ message: "Error al obtener la lista de vehículos" });
    }
};

// 2. Agregar un nuevo vehículo
const agregarVehiculo = async (req, res) => {
    try {
        const fuente = req.body.datos ? req.body.datos : req.body;

        const { marca, modelo, precio, descripcion, imagen } = fuente;
        const anio = fuente.anio || fuente.año || fuente.year;

        if (!marca || !modelo || !anio || !descripcion) {
            return res.status(400).json({ 
                message: "Marca, modelo, año y descripción son campos obligatorios." 
            });
        }

        if (descripcion.trim().length < 10) {
            return res.status(400).json({
                message: "La descripción es demasiado corta. Debe tener al menos 10 caracteres."
            });
        }

        const imagenFinal = imagen && imagen.trim() !== "" 
            ? imagen 
            : "https://via.placeholder.com/400x300?text=Sin+Imagen+Disponible";

        const nuevoVehiculo = await Vehiculo.create({
            marca,
            modelo,
            anio,
            precio: precio || 0,
            descripcion: descripcion.trim(),
            imagen: imagenFinal
        });

        res.status(201).json({ message: "Vehículo registrado exitosamente", vehiculo: nuevoVehiculo });
    } catch (error) {
        console.error("Error al agregar el vehículo:", error);
        res.status(500).json({ message: "Error interno al guardar el vehículo" });
    }
};

// 3. Actualizar/Editar un vehículo existente
const actualizarVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const fuente = req.body;

        const vehiculo = await Vehiculo.findByPk(id);
        if (!vehiculo) {
            return res.status(404).json({ message: "El vehículo no existe" });
        }

        if (fuente.descripcion && fuente.descripcion.trim().length < 10) {
            return res.status(400).json({
                message: "La descripción modificada debe tener al menos 10 caracteres."
            });
        }

        await vehiculo.update({
            marca: fuente.marca || vehiculo.marca,
            modelo: fuente.modelo || vehiculo.modelo,
            anio: fuente.anio || vehiculo.anio,
            precio: fuente.precio !== undefined ? fuente.precio : vehiculo.precio,
            descripcion: fuente.descripcion ? fuente.descripcion.trim() : vehiculo.descripcion,
            imagen: fuente.imagen || vehiculo.imagen
        });

        res.json({ message: "Vehículo actualizado exitosamente", vehiculo });
    } catch (error) {
        console.error("Error al actualizar el vehículo:", error);
        res.status(500).json({ message: "Error interno al intentar actualizar" });
    }
};

// 4. Eliminar un vehículo
const eliminarVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const vehiculo = await Vehiculo.findByPk(id);

        if (!vehiculo) {
            return res.status(404).json({ message: "El vehículo no existe" });
        }

        await vehiculo.destroy();
        res.json({ message: "Vehículo eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el vehículo:", error);
        res.status(500).json({ message: "Error interno al intentar eliminar" });
    }
};

// Exportación de todas las funciones descritas
module.exports = {
    obtenerVehiculos,
    agregarVehiculo,
    actualizarVehiculo,
    eliminarVehiculo
};