require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const sequelize = require('./config/Db'); // Importa tu conexión

app.use(cors());
app.use(express.json());

// 📂 Lógica de Jose: Servir imágenes subidas desde el backend
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar rutas
const userRoutes = require('./routes/UserRoutes');
const vehiculoRoutes = require('./vehiculoRoutes');
const citaRoutes = require('./routes/citasRoutes'); 
const ventaRoutes = require('./routes/ventaRoutes'); 

app.use('/api/users', userRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/ventas', ventaRoutes);

// Función para asegurar la estructura de la base de datos antes de iniciar
const inicializarBaseDeDatos = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.query('ALTER TABLE IF EXISTS "Vehiculos" ADD COLUMN IF NOT EXISTS "descripcion" TEXT;');
    await sequelize.query('ALTER TABLE IF EXISTS "Vehiculos" ADD COLUMN IF NOT EXISTS "imagen" TEXT;');
    console.log("✅ Conexión a la base de datos establecida.");
  } catch (sqlError) {
    console.error("Error al conectar con la base de datos:", sqlError);
  }
  return sequelize.sync({ alter: true }); // Cambiado a true para crear Citas y Ventas
};

// Sincronización controlada utilizando nuestra función intermedia
inicializarBaseDeDatos()
  .then(() => {
    console.log("Base de datos sincronizada. Tablas listas.");
    
    // Iniciar servidor solo si la BD conecta bien
    const PORT = process.env.PORT || 8085;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("No se pudo conectar a la base de datos:", err);
  });