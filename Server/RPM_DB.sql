-- Estructura para PostgreSQL
-- Ejecutar estos comandos en psql:
-- CREATE DATABASE concesionario_db;
-- \c concesionario_db

-- Tabla de Usuarios (Sincronizada con models/User.js)
CREATE TABLE IF NOT EXISTS "Users" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(100) NOT NULL,
    "nombreUsuario" VARCHAR(50) UNIQUE NOT NULL,
    "correo" VARCHAR(100) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(20),
    "zona" VARCHAR(100),
    "rol" VARCHAR(20) DEFAULT 'USER',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Vehículos (Sincronizada con models/Vehiculo.js)
CREATE TABLE IF NOT EXISTS "Vehiculos" (
    "id" SERIAL PRIMARY KEY,
    "marca" VARCHAR(50) NOT NULL,
    "modelo" VARCHAR(50) NOT NULL,
    "anio" INTEGER NOT NULL,
    "precio" DECIMAL(10, 2) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario administrador por defecto
INSERT INTO "Users" ("nombre", "nombreUsuario", "correo", "password", "rol")
VALUES ('Administrador', 'admin', 'admin@rpm.com', 'admin123', 'ADMIN')
ON CONFLICT ("nombreUsuario") DO NOTHING;