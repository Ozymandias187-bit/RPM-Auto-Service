# 🔧 RPM Auto & Service — Guía Completa de Instalación y Ejecución en VS Code

## 📁 Estructura del Proyecto

```
RPM Auto and Service/
├── Server/                  ← Backend (Node.js + Express + Sequelize)
│   ├── config/Db.js
│   ├── models/              (Vehiculo, Cita, Venta)
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/upload.js
│   ├── uploads/             (archivos subidos — se crea automático)
│   ├── database.sql         ← script para crear la BD
│   ├── .env.example
│   └── index.js
└── client/                  ← Frontend (React)
    ├── src/
    │   ├── pages/           (Vehiculos, Citas, Ventas)
    │   ├── components/      (Navbar)
    │   └── services/api.js
    └── package.json
```

---

## ✅ PREREQUISITOS (instalar una sola vez)

| Herramienta | Versión mínima | Descarga |
|---|---|---|
| Node.js | 18+ | https://nodejs.org |
| MySQL | 8.0+ | https://dev.mysql.com/downloads/ |
| VS Code | cualquier | https://code.visualstudio.com |

**Extensiones recomendadas en VS Code:**
- ESLint
- Prettier
- MySQL (by weijan chen) — para ver la BD desde VS Code

---

## 🗄️ PASO 1 — Crear la base de datos

1. Abre **MySQL Workbench** o la terminal con MySQL.
2. Ejecuta el script `Server/database.sql`:

```sql
-- En MySQL Workbench: File > Open SQL Script > selecciona database.sql > ⚡ Run
-- O desde terminal:
mysql -u root -p < "Server/database.sql"
```

3. Esto crea la BD `rpm_auto_service` con las 3 tablas y 3 vehículos de prueba.

---

## ⚙️ PASO 2 — Configurar variables de entorno del Backend

1. En la carpeta `Server/`, copia el archivo `.env.example` y renómbralo a `.env`:

```
Server/
├── .env.example   ← copiar este
└── .env           ← pegar con este nombre
```

2. Edita `Server/.env` con tus datos de MySQL:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TU_PASSWORD_AQUI
DB_NAME=rpm_auto_service
PORT=5000
```

---

## 🚀 PASO 3 — Correr el BACKEND

Abre una **terminal en VS Code** (Ctrl + ` ) y escribe:

```bash
# Entra a la carpeta Server
cd "RPM Auto and Service/Server"

# Instala dependencias (solo la primera vez)
npm install

# Inicia el servidor
npm run dev
```

✅ Verás en consola:
```
✅ Base de datos sincronizada
🚀 Servidor corriendo en http://localhost:5000
```

> Si `nodemon` falla, usa `npm start` en su lugar.

**Prueba rápida** — abre en el navegador:
```
http://localhost:5000/api/health
http://localhost:5000/api/vehiculos
```

---

## 🎨 PASO 4 — Correr el FRONTEND

Abre una **segunda terminal en VS Code** (icono `+` en el panel de terminal) y escribe:

```bash
# Entra a la carpeta client
cd "RPM Auto and Service/client"

# Instala dependencias (solo la primera vez)
npm install

# Inicia la app React
npm start
```

✅ Se abre automáticamente en el navegador:
```
http://localhost:3000
```

---

## 🖥️ RESUMEN — Orden correcto cada vez que abras el proyecto

| Orden | Terminal | Comando | Puerto |
|---|---|---|---|
| 1️⃣ | Terminal 1 | `cd Server && npm run dev` | :5000 |
| 2️⃣ | Terminal 2 | `cd client && npm start` | :3000 |

> ⚠️ El backend **siempre primero**. El frontend consume la API.

---

## 🗂️ FUNCIONALIDADES — Sprint 1

### 🚗 Vehículos (http://localhost:3000/)
- ✅ Cargar lista de vehículos
- ✅ Registrar nuevo vehículo con validación de datos
- ✅ Adjuntar imagen y documentos (PDF/DOC)
- ✅ Editar y eliminar vehículos

### 📅 Citas (http://localhost:3000/citas)
- ✅ Seleccionar vehículo de interés
- ✅ Elegir día y hora disponible (horario 9am–5pm, bloqueadas las ocupadas)
- ✅ Tipos: visita al concesionario o cita para compra
- ✅ Ver y gestionar todas las citas

### 💰 Ventas (http://localhost:3000/ventas)
- ✅ Registrar venta con descuento automático de stock
- ✅ Adjuntar contrato de compra
- ✅ Cambiar estado de pago (pendiente/pagado/cancelado)

---

## 🛠️ Solución de problemas frecuentes

| Error | Causa | Solución |
|---|---|---|
| `ECONNREFUSED 3306` | MySQL no está corriendo | Iniciar MySQL service |
| `Access denied for user 'root'` | Password incorrecto | Revisar `.env` |
| `Cannot GET /api/vehiculos` | Backend no arrancó | Correr `npm run dev` en Server/ primero |
| `npm: command not found` | Node no instalado | Instalar Node.js desde nodejs.org |
| Puerto 3000 ocupado | Otra app usa el puerto | React pregunta si usar otro; presiona Y |
| Puerto 5000 ocupado | Cambiar PORT en `.env` a 5001 | Y actualizar `src/services/api.js` |

