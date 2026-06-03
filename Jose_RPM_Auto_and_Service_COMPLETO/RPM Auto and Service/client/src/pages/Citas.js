import React, { useEffect, useState } from 'react';
import { getVehiculos, getCitas, getDisponibilidad, crearCita, actualizarCita, eliminarCita } from '../services/api';
import './Page.css';

const EMPTY = { nombre_cliente: '', correo_cliente: '', telefono_cliente: '', id_vehiculo: '', fecha_cita: '', hora_cita: '', tipo: 'visita', notas: '' };

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const cargar = () => {
    getCitas().then(setCitas);
    getVehiculos().then(setVehiculos);
  };
  useEffect(() => { cargar(); }, []);

  useEffect(() => {
    if (form.fecha_cita) {
      getDisponibilidad(form.fecha_cita).then(setHorasDisponibles);
    }
  }, [form.fecha_cita]);

  const notify = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3500); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = editId ? await actualizarCita(editId, form) : await crearCita(form);
      if (res.error) { notify('❌ ' + res.error); }
      else {
        notify(editId ? '✅ Cita actualizada' : '✅ Cita agendada exitosamente');
        setForm(EMPTY); setEditId(null); setShowForm(false);
        cargar();
      }
    } catch { notify('❌ Error de conexión'); }
    setLoading(false);
  };

  const editar = (c) => {
    setForm({ nombre_cliente: c.nombre_cliente, correo_cliente: c.correo_cliente || '', telefono_cliente: c.telefono_cliente || '', id_vehiculo: c.id_vehiculo, fecha_cita: c.fecha_cita, hora_cita: c.hora_cita.substring(0,5), tipo: c.tipo, notas: c.notas || '' });
    setEditId(c.id); setShowForm(true); window.scrollTo(0, 0);
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Cancelar esta cita?')) return;
    await eliminarCita(id);
    notify('🗑 Cita cancelada');
    cargar();
  };

  const estadoColor = { pendiente: '#f59e0b', confirmada: '#10b981', cancelada: '#ef4444' };

  return (
    <div className="page">
      <div className="page-header">
        <h1>📅 Gestión de Citas</h1>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY); }}>
          {showForm ? '✕ Cancelar' : '+ Agendar Cita'}
        </button>
      </div>

      {msg && <div className="toast">{msg}</div>}

      {showForm && (
        <form className="card form-card" onSubmit={handleSubmit}>
          <h2>{editId ? 'Editar Cita' : 'Solicitud de Cita'}</h2>
          <p className="form-subtitle">Selecciona el vehículo de interés, luego elige el día y la hora disponible.</p>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre del Cliente *</label>
              <input required value={form.nombre_cliente} onChange={e => setForm({...form, nombre_cliente: e.target.value})} placeholder="Juan Pérez" />
            </div>
            <div className="form-group">
              <label>Correo</label>
              <input type="email" value={form.correo_cliente} onChange={e => setForm({...form, correo_cliente: e.target.value})} placeholder="juan@email.com" />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input value={form.telefono_cliente} onChange={e => setForm({...form, telefono_cliente: e.target.value})} placeholder="809-000-0000" />
            </div>
            <div className="form-group">
              <label>Vehículo de Interés *</label>
              <select required value={form.id_vehiculo} onChange={e => setForm({...form, id_vehiculo: e.target.value})}>
                <option value="">-- Seleccionar vehículo --</option>
                {vehiculos.map(v => (
                  <option key={v.id} value={v.id}>{v.marca} {v.modelo} ({v.anio})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Tipo de Cita *</label>
              <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                <option value="visita">👀 Visita al concesionario</option>
                <option value="compra">💳 Agendar para compra</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fecha *</label>
              <input required type="date" min={new Date().toISOString().split('T')[0]} value={form.fecha_cita} onChange={e => setForm({...form, fecha_cita: e.target.value, hora_cita: ''})} />
            </div>
            <div className="form-group full">
              <label>Hora Disponible *</label>
              {horasDisponibles.length === 0 && form.fecha_cita
                ? <p className="info-msg">Cargando horarios...</p>
                : (
                  <div className="hora-grid">
                    {horasDisponibles.map(h => (
                      <button type="button" key={h.hora} disabled={!h.disponible}
                        className={`hora-btn ${form.hora_cita === h.hora.substring(0,5) ? 'selected' : ''} ${!h.disponible ? 'ocupada' : ''}`}
                        onClick={() => h.disponible && setForm({...form, hora_cita: h.hora.substring(0,5)})}>
                        {h.hora.substring(0,5)} {!h.disponible ? '🔴' : '🟢'}
                      </button>
                    ))}
                  </div>
                )}
            </div>
            <div className="form-group full">
              <label>Notas adicionales</label>
              <textarea rows="2" value={form.notas} onChange={e => setForm({...form, notas: e.target.value})} placeholder="Alguna preferencia o consulta..." />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading || !form.hora_cita}>
              {loading ? 'Guardando...' : editId ? 'Actualizar Cita' : 'Agendar Cita'}
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr><th>Cliente</th><th>Vehículo</th><th>Fecha</th><th>Hora</th><th>Tipo</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {citas.length === 0 && <tr><td colSpan="7" className="empty-msg">No hay citas registradas</td></tr>}
            {citas.map(c => (
              <tr key={c.id}>
                <td><strong>{c.nombre_cliente}</strong><br /><small>{c.correo_cliente}</small></td>
                <td>{c.vehiculo ? `${c.vehiculo.marca} ${c.vehiculo.modelo}` : `#${c.id_vehiculo}`}</td>
                <td>{c.fecha_cita}</td>
                <td>{c.hora_cita?.substring(0,5)}</td>
                <td>{c.tipo === 'compra' ? '💳 Compra' : '👀 Visita'}</td>
                <td><span className="badge" style={{background: estadoColor[c.estado]}}>{c.estado}</span></td>
                <td>
                  <button className="btn-sm btn-edit" onClick={() => editar(c)}>✏️</button>
                  <button className="btn-sm btn-danger" onClick={() => eliminar(c.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
