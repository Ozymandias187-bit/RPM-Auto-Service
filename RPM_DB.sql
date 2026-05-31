

CREATE TABLE usuarios (
    ALTER TABLE usuarios ADD UNIQUE (usuario);
ALTER TABLE usuarios ADD UNIQUE (email);
    nombre VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'cliente'
);

CREATE TABLE vehiculos (
    id_vehiculo SERIAL PRIMARY KEY,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    precio DECIMAL(12, 2),
    stock INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE imagenes_vehiculo (
    id_imagen SERIAL PRIMARY KEY,
    id_vehiculo INT REFERENCES vehiculos(id_vehiculo) ON DELETE CASCADE,
    url_imagen VARCHAR(255) NOT NULL
);

CREATE DATABASE concesionario_db;


ALTER TABLE usuarios ADD COLUMN rol VARCHAR(20) DEFAULT 'USER';

INSERT INTO usuarios (usuario, password, rol) 
VALUES ('admin', 'admin123', 'admin');