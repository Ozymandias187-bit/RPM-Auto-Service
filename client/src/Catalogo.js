import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Catalogo({ usuario }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionado, setSeleccionado] = useState(null); // Para el modal
  const [error, setError] = useState(null);

  // Estado para el formulario de cita
  const [citaForm, setCitaForm] = useState({
    fecha: '',
    hora: '09:00',
    comentarios: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8085';

  useEffect(() => {
    const cargarVehiculos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/vehiculos`);
        setVehiculos(res.data);
      } catch (err) {
        console.error("Error al cargar vehículos:", err);
        setError("No se pudo cargar el catálogo. Intenta más tarde.");
      }
    };
    cargarVehiculos();
  }, []);

  const agendarCita = async (e) => {
    e.preventDefault();
    if (!usuario) {
      alert("Debes iniciar sesión para agendar una cita.");
      return;
    }

    try {
      const payload = {
        ...citaForm,
        usuarioId: usuario.id,
        vehiculoId: seleccionado.id,
        tipo: 'VISITA'
      };
      const res = await axios.post(`${API_URL}/api/citas/agregar`, payload);
      alert(res.data.message);
      setSeleccionado(null);
    } catch (err) {
      const msg = err.response?.data?.message || "Error al agendar cita";
      alert(msg);
    }
  };

  // Filtramos la lista según lo que el usuario escribe
  const vehiculosFiltrados = vehiculos.filter(v => 
    v.marca.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="catalogo-container">
      <h2>Catálogo de Vehículos</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Barra de búsqueda */}
      <input 
        placeholder="Buscar por marca..." 
        onChange={(e) => setBusqueda(e.target.value)} 
      />

      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        {vehiculosFiltrados.map((v) => (
          <div key={v.id} style={{ border: '1px solid #ddd', padding: '15px' }}>
            <h3>{v.marca} {v.modelo}</h3>
            <button onClick={() => setSeleccionado(v)}>Ver detalles</button>
          </div>
        ))}
      </div>

      {/* Modal de detalles */}
      {seleccionado && (
        <div style={{ position: 'fixed', top: '10%', left: '25%', width: '50%', background: 'white', padding: '30px', border: '2px solid black', zIndex: 1000, maxHeight: '80vh', overflowY: 'auto' }}>
          <h2>{seleccionado.marca} {seleccionado.modelo}</h2>
          <p>Año: {seleccionado.anio}</p>
          <p>Precio: ${seleccionado.precio}</p>
          <p><strong>Descripción:</strong> {seleccionado.descripcion}</p>
          
          <hr />
          {usuario ? (
            <form onSubmit={agendarCita} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3>Agendar Cita para Ver</h3>
              <label>Fecha:</label>
              <input type="date" required value={citaForm.fecha} onChange={(e) => setCitaForm({...citaForm, fecha: e.target.value})} />
              
              <label>Hora (9am - 5pm):</label>
              <select value={citaForm.hora} onChange={(e) => setCitaForm({...citaForm, hora: e.target.value})}>
                {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>

              <label>Comentarios adicionales:</label>
              <textarea value={citaForm.comentarios} onChange={(e) => setCitaForm({...citaForm, comentarios: e.target.value})} placeholder="Ej: Me interesa verlo por la mañana." />
              
              <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', padding: '10px', cursor: 'pointer' }}>Confirmar Cita</button>
            </form>
          ) : (
            <p style={{ color: 'red' }}>Inicia sesión para agendar una cita.</p>
          )}
          <button onClick={() => setSeleccionado(null)} style={{ marginTop: '20px', width: '100%' }}>Cerrar</button>
        </div>
      )}
    </div>
  );
}

export default Catalogo;