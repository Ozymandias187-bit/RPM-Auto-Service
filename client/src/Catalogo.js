import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Catalogo() {
  const [vehiculos, setVehiculos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionado, setSeleccionado] = useState(null); // Para el modal

  useEffect(() => {
    const cargarVehiculos = async () => {
      const res = await axios.get('http://localhost:8085/api/vehiculos');
      setVehiculos(res.data);
    };
    cargarVehiculos();
  }, []);

  // Filtramos la lista según lo que el usuario escribe
  const vehiculosFiltrados = vehiculos.filter(v => 
    v.marca.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="catalogo-container">
      <h2>Catálogo de Vehículos</h2>
      
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
        <div style={{ position: 'fixed', top: '20%', left: '30%', background: 'white', padding: '20px', border: '2px solid black' }}>
          <h2>{seleccionado.marca} {seleccionado.modelo}</h2>
          <p>Año: {seleccionado.anio}</p>
          <p>Precio: ${seleccionado.precio}</p>
          <button onClick={() => setSeleccionado(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}

export default Catalogo;