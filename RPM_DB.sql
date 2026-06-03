CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY, -- 'SERIAL' es el equivalente a 'AUTO_INCREMENT' en Postgres
    nombre VARCHAR(100) NOT NULL,
    nombreUsuario VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    zona VARCHAR(50),
    rol VARCHAR(20) DEFAULT 'USER'
);

-- 3. Crear tabla de vehículos
CREATE TABLE vehiculos (
    id_vehiculo SERIAL PRIMARY KEY,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    anio INT,
    precio DECIMAL(12, 2),
    stock INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Crear tabla de imágenes
CREATE TABLE imagenes_vehiculo (
    id_imagen SERIAL PRIMARY KEY,
    id_vehiculo INT REFERENCES vehiculos(id_vehiculo) ON DELETE CASCADE,
    url_imagen VARCHAR(255) NOT NULL
);

-- 5. Insertar usuario administrador
INSERT INTO usuarios (nombre, nombreUsuario, email, password, rol) 
VALUES ('Administrador', 'admin', 'admin@rpm.com', '$2b$10$Cy5aQ5WjzFeiS3T1J7EKBuwhusTIurB2EVtS7yW0Cgq/7Yv6aR.qe', 'ADMIN');