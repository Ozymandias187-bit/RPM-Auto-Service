const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Esto permite que tu React se conecte al servidor
app.use(express.json());
// Middleware

// Importar rutas (Asegúrate de que este archivo exista en routes/userRoutes.js)
const userRoutes = require('./routes/userRoutes');
const vehiculoRoutes = require('./vehiculoRoutes');

// Definición de rutas
// La petición del frontend llega a /api/users/register
// app.use suma el prefijo, por lo tanto la ruta final es /api/users/register
app.use('/api/users', userRoutes);
app.use('/api/vehiculos', vehiculoRoutes);

// Ruta de prueba para verificar que el servidor vive
app.get('/', (req, res) => {
    res.send('Servidor de RPM Auto and Service funcionando');
});

const PORT = 8085;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});