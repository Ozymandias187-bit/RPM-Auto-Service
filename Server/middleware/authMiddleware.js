// middleware/authMiddleware.js
exports.verificarAdmin = (req, res, next) => {
    // Solo permitimos el rol a través de headers específicos, no por el body.
    // Esto evita que un usuario manipule el JSON enviado para escalar privilegios.
    const rol = req.headers['x-user-role']; 

    if (rol && rol.toUpperCase() === 'ADMIN') {
        next(); 
    } else {
        res.status(403).json({ message: "Acceso denegado: Se requiere nivel de administrador." });
    }
};