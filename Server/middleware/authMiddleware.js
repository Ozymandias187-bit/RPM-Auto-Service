// middleware/authMiddleware.js
exports.verificarAdmin = (req, res, next) => {
    // ADVERTENCIA: Confiar en el body para el rol es inseguro.
    // Se recomienda implementar JWT (JSON Web Tokens) para validar la identidad.
    const rol = req.headers['x-user-role'] || req.body.rol; 

    if (rol === 'ADMIN') {
        next(); 
    } else {
        res.status(403).json({ message: "Acceso prohibido: Se requieren permisos de administrador." });
    }
};