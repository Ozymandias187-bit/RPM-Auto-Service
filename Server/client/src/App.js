import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import Register from './Register';
import Catalogo from './Catalogo';
import AdminPortal from './AdminPortal';
import './App.css';

function App() {
  const [vista, setVista] = useState('inicio');
  const [usuario, setUsuario] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroAnio, setFiltroAnio] = useState('');

  // 1. Cargar datos (dentro de la función App)
  useEffect(() => {
    const cargarVehiculos = async () => {
      try {
        const res = await axios.get('http://localhost:8085/api/vehiculos');
        setVehiculos(res.data);
      } catch (err) { console.error("Error al cargar:", err); }
    };
    cargarVehiculos();
  }, []);

  // 2. Lógica de filtros (dentro de la función App)
  const aniosUnicos = [...new Set(vehiculos.map(v => v.anio))].sort();

  const vehiculosFiltrados = vehiculos.filter(v => {
    const termino = busqueda.toLowerCase();
    const coincideTexto = v.marca.toLowerCase().includes(termino) || 
                          v.modelo.toLowerCase().includes(termino);
    const coincideAnio = filtroAnio === "" || v.anio.toString() === filtroAnio;
    return coincideTexto && coincideAnio;
  });

  // 3. Renderizado único (Un solo return)
  return (
    <div className="App">
      <h1>RPM Auto and Service</h1>
      
      {vista === 'inicio' && (
        <div className="welcome-screen">
          <h2>Catálogo de Vehículos</h2>
          
          <input 
            placeholder="Buscar marca o modelo..." 
            onChange={(e) => setBusqueda(e.target.value)} 
          />

          {/* Menú desplegable dinámico */}
          <select onChange={(e) => setFiltroAnio(e.target.value)} value={filtroAnio}>
            <option value="">Todos los años</option>
            {aniosUnicos.map(anio => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
          </select>

          <ul>
            {vehiculosFiltrados.map(v => (
              <li key={v.id}>{v.marca} {v.modelo} - {v.anio}</li>
            ))}
          </ul>

          <button onClick={() => setVista('login')}>Ir al Inicio de Sesión</button>
        </div>
      )}
      
      {vista === 'login' && <Login setVista={setVista} setUsuario={setUsuario} />}
      {vista === 'register' && <Register setVista={setVista} />}
      {vista === 'catalogo' && <Catalogo usuario={usuario} />}
      {vista === 'admin' && <AdminPortal usuario={usuario} />}

      <div style={{ marginTop: '20px' }}>
        {vista !== 'inicio' && (
          <button onClick={() => { setVista('inicio'); setUsuario(null); }}>
            Volver a la página principal
          </button>
        )}
      </div>
    </div>
  );
}

export default App;