import React, { useEffect, useState } from 'react';
import { getVehiculos, getVentas, crearVenta, actualizarVenta } from '../services/api';
import './Page.css';

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [form, setForm] = useState({ nombre_cliente: '', correo_cliente: '', id_vehiculo: '', precio_venta: '', notas: '' });
  const [contrato, setContrato] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const cargar = () => { getVentas().then(setVentas); getVehiculos().then(setVehiculos); };
  useEffect(() => { cargar(); }, []);

  const notify = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3500); };

  const handleVehiculoChange = (e) => {
    const id = e.target.value;
    const v = vehiculos.find(x => String(x.id) === id);
    setForm({ ...form, id_vehiculo: id, precio_venta: v ? v.precio : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (contrato) fd.append('contrato', contrato);
    try {
      const res = await crearVenta(fd);
      if (res.error) notify('❌ ' + res.error);
      else { notify('✅ Venta registrada'); setForm({ nombre_cliente: '', correo_cliente: '', id_vehiculo: '', precio_venta: '', notas: '' }); setContrato(null); setShowForm(false); cargar(); }
    } catch { notify('❌ Error al registrar venta'); }
    setLoading(false);
  };

  const cambiarEstado = async (id, estado_pago) => {
    await actualizarVenta(id, { estado_pago });
    cargar();
  };

  const estadoColor = { pendiente: '#f59e0b', pagado: '#10b981', cancelado: '#ef4444' };

  return (
    <div className="page">
      <div className="page-header">
        <h1>💰 Gestión de Ventas</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '+ Registrar Venta'}
        </button>
      </div>

      {msg && <div className="toast">{msg}</div>}

      {showForm && (
        <form className="card form-card" onSubmit={handleSubmit}>
          <h2>Nueva Venta</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre del Cliente *</label>
              <input required value={form.nombre_cliente} onChange={e => setForm({...form, nombre_cliente: e.target.value})} placeholder="María García" />
            </div>
            <div className="form-group">
              <label>Correo del Cliente</label>
              <input type="email" value={form.correo_cliente} onChange={e => setForm({...form, correo_cliente: e.target.value})} placeholder="maria@email.com" />
            </div>
            <div className="form-group">
              <label>Vehículo *</label>
              <select required value={form.id_vehiculo} onChange={handleVehiculoChange}>
                <option value="">-- Seleccionar --</option>
                {vehiculos.filter(v => v.stock > 0).map(v => (
                  <option key={v.id} value={v.id}>{v.marca} {v.modelo} ({v.anio}) — Stock: {v.stock}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Precio de Venta (RD$) *</label>
              <input required type="number" min="0" step="0.01" value={form.precio_venta} onChange={e => setForm({...form, precio_venta: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Contrato (PDF/DOC)</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={e => setContrato(e.target.files[0])} />
            </div>
            <div className="form-group full">
              <label>Notas</label>
              <textarea rows="2" value={form.notas} onChange={e => setForm({...form, notas: e.target.value})} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Registrando...' : 'Confirmar Venta'}
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr><th>Cliente</th><th>Vehículo</th><th>Precio</th><th>Estado Pago</th><th>Fecha</th><th>Contrato</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {ventas.length === 0 && <tr><td colSpan="7" className="empty-msg">No hay ventas registradas</td></tr>}
            {ventas.map(v => (
              <tr key={v.id}>
                <td><strong>{v.nombre_cliente}</strong><br /><small>{v.correo_cliente}</small></td>
                <td>{v.vehiculo ? `${v.vehiculo.marca} ${v.vehiculo.modelo} (${v.vehiculo.anio})` : `#${v.id_vehiculo}`}</td>
                <td>RD$ {Number(v.precio_venta).toLocaleString()}</td>
                <td><span className="badge" style={{background: estadoColor[v.estado_pago]}}>{v.estado_pago}</span></td>
                <td>{v.fecha_venta?.split('T')[0]}</td>
                <td>{v.contrato_url ? <a href={`http://localhost:5000${v.contrato_url}`} target="_blank" rel="noreferrer">📄 Ver</a> : '—'}</td>
                <td>
                  <select value={v.estado_pago} onChange={e => cambiarEstado(v.id, e.target.value)} className="select-sm">
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
