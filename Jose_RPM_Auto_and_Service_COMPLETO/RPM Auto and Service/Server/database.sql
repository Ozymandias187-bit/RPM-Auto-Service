-- ============================================================
-- RPM Auto and Service — Script de Base de Datos
-- ============================================================
CREATE DATABASE IF NOT EXISTS rpm_auto_service
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE rpm_auto_service;

-- Tabla vehiculos
CREATE TABLE IF NOT EXISTS vehiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  marca VARCHAR(50) NOT NULL,
  modelo VARCHAR(50) NOT NULL,
  anio INT NOT NULL,
  precio DECIMAL(12,2) NOT NULL,
  stock INT DEFAULT 1,
  descripcion TEXT,
  imagen_url VARCHAR(255),
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla citas
CREATE TABLE IF NOT EXISTS citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_cliente VARCHAR(100) NOT NULL,
  correo_cliente VARCHAR(100),
  telefono_cliente VARCHAR(20),
  id_vehiculo INT NOT NULL,
  fecha_cita DATE NOT NULL,
  hora_cita TIME NOT NULL,
  tipo ENUM('visita','compra') DEFAULT 'visita',
  estado ENUM('pendiente','confirmada','cancelada') DEFAULT 'pendiente',
  notas TEXT,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Tabla ventas
CREATE TABLE IF NOT EXISTS ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_cliente VARCHAR(100) NOT NULL,
  correo_cliente VARCHAR(100),
  id_vehiculo INT NOT NULL,
  precio_venta DECIMAL(12,2) NOT NULL,
  estado_pago ENUM('pendiente','pagado','cancelado') DEFAULT 'pendiente',
  contrato_url VARCHAR(255),
  notas TEXT,
  fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Datos de prueba
INSERT INTO vehiculos (marca, modelo, anio, precio, stock, descripcion) VALUES
  ('Toyota', 'Corolla', 2023, 1850000.00, 3, 'Sedán confiable, bajo consumo de combustible'),
  ('Honda', 'CR-V', 2024, 2400000.00, 2, 'SUV espaciosa con tecnología avanzada'),
  ('Hyundai', 'Tucson', 2023, 2100000.00, 1, 'SUV con diseño moderno y garantía extendida');
