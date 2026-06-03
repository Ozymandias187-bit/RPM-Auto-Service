import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import Register from './Register';
import Catalogo from './Catalogo';
import AdminPortal from './AdminPortal';
import UserProfile from './UserProfile';
import './App.css';

function App() {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8085';

  const [vista, setVista] = useState('inicio');
  const [usuario, setUsuario] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  
  const [busqueda, setBusqueda] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('');
  const [filtroModelo, setFiltroModelo] = useState('');
  const [filtroAnio, setFiltroAnio] = useState('');

  useEffect(() => {
    const cargarVehiculos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/vehiculos`);
        setVehiculos(res.data);
      } catch (err) { console.error("Error al cargar:", err); }
    };
    cargarVehiculos();
  }, [API_URL]);

  const marcasUnicas = [...new Set(vehiculos.map(v => v.marca))].sort();
  const modelosUnicos = [...new Set(vehiculos.map(v => v.modelo))].sort();
  const aniosUnicos = [...new Set(vehiculos.map(v => v.anio))].sort();

  const vehiculosFiltrados = vehiculos.filter(v => {
    const coincideMarca = filtroMarca === "" || v.marca === filtroMarca;
    const coincideModelo = filtroModelo === "" || v.modelo === filtroModelo;
    const coincideAnio = filtroAnio === "" || v.anio.toString() === filtroAnio;
    const coincideBusqueda = v.marca.toLowerCase().includes(busqueda.toLowerCase()) || 
                             v.modelo.toLowerCase().includes(busqueda.toLowerCase());
    
    return coincideMarca && coincideModelo && coincideAnio && coincideBusqueda;
  });

  console.log("DEBUG GLOBAL -> Vista actual:", vista, " | Usuario actual:", usuario);

  return (
    <div className="App">
      {/* 1. El título principal SOLO se muestra a los clientes, NO al administrador */}
      {vista !== 'admin' && <h1>RPM Auto and Service</h1>}
      
      {/* VISTA DE INICIO */}
      {vista === 'inicio' && (
        <div className="welcome-screen">
          <h2>Catálogo de Vehículos</h2>
          
          <div className="filtros" style={{ marginBottom: '20px' }}>
            <input placeholder="Buscar por texto..." onChange={(e) => setBusqueda(e.target.value)} />

            <select onChange={(e) => setFiltroMarca(e.target.value)} value={filtroMarca}>
              <option value="">Todas las marcas</option>
              {marcasUnicas.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <select onChange={(e) => setFiltroModelo(e.target.value)} value={filtroModelo}>
              <option value="">Todos los modelos</option>
              {modelosUnicos.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <select onChange={(e) => setFiltroAnio(e.target.value)} value={filtroAnio}>
              <option value="">Todos los años</option>
              {aniosUnicos.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <ul>
            {vehiculosFiltrados.map(v => (
              <li key={v.id}>{v.marca} {v.modelo} - {v.anio}</li>
            ))}
          </ul>

          <div style={{ marginTop: '20px' }}>
            <button onClick={() => setVista('login')}>Ir al Inicio de Sesión</button>
            <button onClick={() => setVista('register')} style={{ marginLeft: '10px' }}>Crear una cuenta</button>
            <button onClick={() => setVista('catalogo')} style={{ marginLeft: '10px', background: '#2ecc71', color: 'white' }}>Ver Catálogo Full</button>
          </div>
        </div>
      )}
      
      {/* VISTAS DE NAVEGACIÓN Y AUTENTICACIÓN */}
      {vista === 'login' && (
        <div className="login-container">
          <Login setVista={setVista} setUsuario={setUsuario} />
          <hr />
          <p>¿No tienes una cuenta aún?</p>
          <button onClick={() => setVista('register')}>Regístrate aquí</button>
        </div>
      )}

      {vista === 'register' && <Register setVista={setVista} />}
      
      {vista === 'catalogo' && (
        <>
          <button onClick={() => setVista('perfil')} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Mi Perfil</button>
          <Catalogo usuario={usuario} />
        </>
      )}
      
      {vista === 'perfil' && <UserProfile usuario={usuario} setUsuario={setUsuario} setVista={setVista} />}
      
      {/* 2. PORTAL DE ADMINISTRACIÓN: Ahora pasamos correctamente la API_URL */}
      {vista === 'admin' && <AdminPortal usuario={usuario} setVista={setVista} API_URL={API_URL} />}

      {/* 3. BOTÓN DE RETORNO GLOBAL: NO se debe mostrar si el usuario está en el panel de admin */}
      {vista !== 'inicio' && vista !== 'admin' && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => setVista('inicio')}>
            Volver a la página principal
          </button>
        </div>
      )}
    </div>
  );
}

export default App;