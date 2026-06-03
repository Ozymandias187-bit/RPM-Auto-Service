const User = require('../models/User'); // Asegúrate de que este modelo exista y tenga 'correo', 'password' y 'rol'

const login = async (req, res) => {
    const { correo, password } = req.body;

    try {
        // 1. Buscar al usuario por correo
        const user = await User.findOne({ where: { correo } });

        // 2. Validar usuario y contraseña (aquí puedes usar bcrypt si lo deseas)
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos" });
        }

        // 3. Devolver datos del usuario (incluyendo el rol)
        res.status(200).json({
            id: user.id,
            nombre: user.nombre,
            rol: user.rol // Esto es lo que el frontend usa para cambiar la vista
        });
    } catch (err) {
        console.error("Error en servidor:", err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = { login };