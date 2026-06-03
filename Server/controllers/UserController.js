const User = require('../models/User');
const bcrypt = require('bcryptjs');
console.log("El controlador ha sido cargado");
exports.register = async (req, res) => {
    // 1. Extraemos todo de una sola vez
    const { nombre, nombreUsuario, correo, password, telefono, zona } = req.body;

    if (!nombre || nombre.length < 3 || nombre.length > 20) {
        console.error("DEBUG: Falló validación de nombre. Recibido:", nombre);
        return res.status(400).json({ message: "El nombre debe tener entre 3 y 20 caracteres." });
    }

    const userRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!nombreUsuario || !userRegex.test(nombreUsuario)) {
        console.error("DEBUG: Falló validación de nombre de usuario. Recibido:", nombreUsuario);
        return res.status(400).json({ message: "El nombre de usuario debe tener entre 3 y 20 caracteres y ser alfanumérico." });
    }

    if (!correo || !correo.includes('@')) {
        console.error("DEBUG: Falló validación de correo. Recibido:", correo);
        return res.status(400).json({ message: "Ingresa un correo electrónico válido." });
    }
  const phoneRegex = /^[0-9+\-\s]{8,15}$/;
    if (!phoneRegex.test(telefono)) {
        console.error("DEBUG: Falló validación de teléfono. Recibido:", telefono);
        return res.status(400).json({ message: "El teléfono debe ser numérico y tener entre 8 y 15 dígitos." });
    }

    if (!zona || zona.trim().length === 0 || zona.length > 50) {
        console.error("DEBUG: Falló validación de zona. Recibido:", zona);
        return res.status(400).json({ message: "La zona es obligatoria y debe tener máximo 50 caracteres." });
    }

    if (!password || password.length === 0) {
        console.error("DEBUG: Contraseña no proporcionada.");
        return res.status(400).json({ message: "La contraseña es obligatoria." });
    }

    try {
        // Verificar si el correo ya existe
        const existingUser = await User.findOne({ where: { correo } });
        if (existingUser) {
            return res.status(400).json({ message: "El correo ya está registrado." });
        }

        // Verificar si el nombre de usuario ya existe
        const existingUsername = await User.findOne({ where: { nombreUsuario } });
        if (existingUsername) {
            return res.status(400).json({ message: "El nombre de usuario ya está en uso." });
        }
       
        // Hashear contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            nombre,
            nombreUsuario,
            correo,
            password: hashedPassword,
            telefono,
            zona,
            rol: 'USER'
        });

        res.status(201).json({ message: "Usuario registrado con éxito." });

    } catch (error) {
        console.error("ERROR AL GUARDAR USUARIO:", error);
        // Enviamos el mensaje de error técnico para identificar si faltan columnas en la BD
        const errorSQL = error.parent?.sqlMessage || error.message;
        res.status(500).json({ 
            message: "Error en la base de datos SQL: " + errorSQL
        });
    }
};

exports.login = async (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ message: "Por favor, ingresa correo y contraseña." });
    }

    try {
        // 1. Buscar al usuario por su correo
        const user = await User.findOne({ where: { correo } });

        // 2. Verificar si el usuario existe y comparar contraseña hasheada
        const isMatch = user ? await bcrypt.compare(password, user.password) : false;
        if (!isMatch) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos." });
        }

        // 3. Login exitoso: Devolvemos los datos necesarios (rol, nombre, etc.)
        res.status(200).json({
            id: user.id,
            nombre: user.nombre,
            nombreUsuario: user.nombreUsuario,
            correo: user.correo,
            rol: user.rol
        });
    } catch (error) {
        console.error("ERROR EN LOGIN:", error);
        res.status(500).json({ message: "Error en la base de datos: " + (error.message || "Error desconocido") });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre, nombreUsuario, correo, password, telefono, zona } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const updates = { nombre, nombreUsuario, correo, telefono, zona };
        
        if (password && password.trim() !== "") {
            updates.password = await bcrypt.hash(password, 10);
        }

        await user.update(updates);
        
        res.status(200).json({ 
            message: "Perfil actualizado con éxito.",
            user: { id: user.id, nombre, nombreUsuario, correo, rol: user.rol, telefono, zona }
        });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar: " + error.message });
    }
};

exports.deleteAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        await user.destroy();
        res.status(200).json({ message: "Cuenta eliminada correctamente." });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar cuenta: " + error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'nombre', 'correo', 'nombreUsuario']
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};