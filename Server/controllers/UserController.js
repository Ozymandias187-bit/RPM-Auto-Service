const User = require('../models/User');
console.log("El controlador ha sido cargado");
exports.register = async (req, res) => {
    // 1. Extraemos todo de una sola vez
    console.log("Datos recibidos:", req.body);
    console.log("¡Llegó una petición a register!"); 
    console.log("Cuerpo de la petición:", req.body);
    const { nombre, nombreUsuario, correo, password, telefono, zona } = req.body;

    // 2. Validaciones paso a paso
    if (!nombre || nombre.length < 3 || nombre.length > 20)
        console.error("DEBUG: Falló validación de nombre. Recibido:", nombre); {
        return res.status(400).json({ message: "El nombre debe tener entre 3 y 20 caracteres." });
    }

   const userRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!userRegex.test(nombreUsuario)) 
        console.error("DEBUG: Falló validación de nombre de usuario. Recibido:", nombreUsuario);{
        return res.status(400).json({ message: "El nombre de usuario solo debe contener letras y números." });
    }

    if (!correo || !correo.includes('@')) {
        console.error("DEBUG: Falló validación de correo. Recibido:", correo);
        return res.status(400).json({ message: "Ingresa un correo electrónico válido." });
    }
const passwordLimpio = password.trim(); 
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*.\-_.]{8,}$/;

console.log("Validando contraseña limpia:", passwordLimpio);

if (!passwordRegex.test(passwordLimpio)) {
    return res.status(400).json({ message: "La contraseña debe tener mínimo 8 caracteres, incluir una letra y un número." });
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

    try {
        // Verificar si el correo ya existe
        const existingUser = await User.findOne({ where: { correo } });
        if (existingUser) {
            return res.status(400).json({ message: "El correo ya está registrado." });
        }

       
        
        await User.create({
            nombre,
            nombreUsuario,
            correo,

            password,
            telefono,
            zona
        });

        res.status(201).json({ message: "Usuario registrado con éxito." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor al guardar el usuario." });
    }
};

exports.login = async (req, res) => {

};