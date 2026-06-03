 const bcrypt = require('bcryptjs');

async function crearHash(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log("El hash para tu contraseña es:", hash);
}

// Cambia 'tu_password_aqui' por la contraseña que quieras usar para el admin
crearHash('admin123');