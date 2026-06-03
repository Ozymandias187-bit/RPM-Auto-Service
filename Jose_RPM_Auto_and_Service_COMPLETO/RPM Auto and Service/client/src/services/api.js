const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ── Vehículos ──────────────────────────────────────────────
export const getVehiculos = () =>
  fetch(`${BASE_URL}/vehiculos`).then(r => r.json());

export const getVehiculo = (id) =>
  fetch(`${BASE_URL}/vehiculos/${id}`).then(r => r.json());

export const crearVehiculo = (formData) =>
  fetch(`${BASE_URL}/vehiculos`, { method: 'POST', body: formData }).then(r => r.json());

export const actualizarVehiculo = (id, formData) =>
  fetch(`${BASE_URL}/vehiculos/${id}`, { method: 'PUT', body: formData }).then(r => r.json());

export const eliminarVehiculo = (id) =>
  fetch(`${BASE_URL}/vehiculos/${id}`, { method: 'DELETE' }).then(r => r.json());

// ── Citas ──────────────────────────────────────────────────
export const getCitas = () =>
  fetch(`${BASE_URL}/citas`).then(r => r.json());

export const getDisponibilidad = (fecha) =>
  fetch(`${BASE_URL}/citas/disponibilidad?fecha=${fecha}`).then(r => r.json());

export const crearCita = (datos) =>
  fetch(`${BASE_URL}/citas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  }).then(r => r.json());

export const actualizarCita = (id, datos) =>
  fetch(`${BASE_URL}/citas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  }).then(r => r.json());

export const eliminarCita = (id) =>
  fetch(`${BASE_URL}/citas/${id}`, { method: 'DELETE' }).then(r => r.json());

// ── Ventas ─────────────────────────────────────────────────
export const getVentas = () =>
  fetch(`${BASE_URL}/ventas`).then(r => r.json());

export const crearVenta = (formData) =>
  fetch(`${BASE_URL}/ventas`, { method: 'POST', body: formData }).then(r => r.json());

export const actualizarVenta = (id, datos) =>
  fetch(`${BASE_URL}/ventas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  }).then(r => r.json());
