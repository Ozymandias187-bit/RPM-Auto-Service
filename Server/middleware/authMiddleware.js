// middleware/authMiddleware.js
exports.verificarAdmin = (req, res, next) => {
    // Intenta obtener el rol de los headers para mayor seguridad que el body
    const rol = req.headers['x-user-role'] || req.body.rol; 

    if (rol === 'ADMIN') {
        next(); 
    } else {
        res.status(403).json({ message: "Acceso prohibido: Se requieren permisos de administrador." });
    }
};