import React, { useEffect, useState } from 'react';
import { getVehiculos, crearVehiculo, actualizarVehiculo, eliminarVehiculo } from '../services/api';
import './Page.css';

const EMPTY = { marca: '', modelo: '', anio: '', precio: '', stock: 1, descripcion: '' };

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [imagen, setImagen] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [showForm, setShowForm] = useState(false);

  const cargar = () => getVehiculos().then(setVehiculos);
  useEffect(() => { cargar(); }, []);

  const notify = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imagen) fd.append('imagen', imagen);
    documentos.forEach(doc => fd.append('documentos', doc));

    try {
      if (editId) {
        await actualizarVehiculo(editId, fd);
        notify('✅ Vehículo actualizado');
      } else {
        await crearVehiculo(fd);
        notify('✅ Vehículo registrado');
      }
      setForm(EMPTY); setImagen(null); setDocumentos([]); setEditId(null); setShowForm(false);
      cargar();
    } catch { notify('❌ Error al guardar'); }
    setLoading(false);
  };

  const editar = (v) => {
    setForm({ marca: v.marca, modelo: v.modelo, anio: v.anio, precio: v.precio, stock: v.stock, descripcion: v.descripcion || '' });
    setEditId(v.id); setShowForm(true); window.scrollTo(0, 0);
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar este vehículo?')) return;
    await eliminarVehiculo(id);
    notify('🗑 Vehículo eliminado');
    cargar();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>🚗 Gestión de Vehículos</h1>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY); }}>
          {showForm ? '✕ Cancelar' : '+ Registrar Vehículo'}
        </button>
      </div>

      {msg && <div className="toast">{msg}</div>}

      {showForm && (
        <form className="card form-card" onSubmit={handleSubmit}>
          <h2>{editId ? 'Editar Vehículo' : 'Registrar Nuevo Vehículo'}</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Marca *</label>
              <input required value={form.marca} onChange={e => setForm({...form, marca: e.target.value})} placeholder="Toyota" />
            </div>
            <div className="form-group">
              <label>Modelo *</label>
              <input required value={form.modelo} onChange={e => setForm({...form, modelo: e.target.value})} placeholder="Corolla" />
            </div>
            <div className="form-group">
              <label>Año *</label>
              <input required type="number" min="1900" max="2030" value={form.anio} onChange={e => setForm({...form, anio: e.target.value})} placeholder="2024" />
            </div>
            <div className="form-group">
              <label>Precio (RD$) *</label>
              <input required type="number" min="0" step="0.01" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} placeholder="1500000" />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input type="number" min="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
            </div>
            <div className="form-group full">
              <label>Descripción</label>
              <textarea rows="3" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} placeholder="Características del vehículo..." />
            </div>
            <div className="form-group">
              <label>Imagen del Vehículo</label>
              <input type="file" accept="image/*" onChange={e => setImagen(e.target.files[0])} />
            </div>
            <div className="form-group">
              <label>Adjuntar Documentos (PDF, DOC)</label>
              <input type="file" multiple accept=".pdf,.doc,.docx" onChange={e => setDocumentos([...e.target.files])} />
              {documentos.length > 0 && <small>{documentos.length} archivo(s) seleccionado(s)</small>}
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : editId ? 'Actualizar' : 'Registrar'}
            </button>
          </div>
        </form>
      )}

      <div className="grid-cards">
        {vehiculos.length === 0 && <p className="empty-msg">No hay vehículos registrados.</p>}
        {vehiculos.map(v => (
          <div className="vehicle-card" key={v.id}>
            {v.imagen_url
              ? <img src={`http://localhost:5000${v.imagen_url}`} alt={v.modelo} className="vehicle-img" />
              : <div className="vehicle-img placeholder">🚗</div>
            }
            <div className="vehicle-info">
              <h3>{v.marca} {v.modelo} <span className="year">({v.anio})</span></h3>
              <p className="price">RD$ {Number(v.precio).toLocaleString()}</p>
              <p className="stock-badge" data-low={v.stock < 2}>Stock: {v.stock}</p>
              {v.descripcion && <p className="desc">{v.descripcion}</p>}
            </div>
            <div className="card-actions">
              <button className="btn-edit" onClick={() => editar(v)}>✏️ Editar</button>
              <button className="btn-danger" onClick={() => eliminar(v.id)}>🗑 Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
