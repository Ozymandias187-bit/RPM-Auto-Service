import React, { useState } from 'react';
import axios from 'axios';

function Login({ setVista, setUsuario }) {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8085';
  const [creds, setCreds] = useState({ correo: '', password: '' });
  const [mensaje, setMensaje] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, creds);
      console.log("Respuesta del servidor en Login:", res.data);
      setUsuario(res.data);
    if (res.data.rol === 'ADMIN') {
      setVista('admin'); 
    } else {
      setVista('catalogo');
    }
    } catch (err) 
    {console.error("Error en la petición de Login:", err);
        alert("Credenciales incorrectas");
      setMensaje("Credenciales inválidas");
      console.error("Error en login:", err);
      const msg = err.response?.data?.message || 
                  err.message || 
                  "Error al conectar con el servidor";
      setMensaje(`Error: ${msg}`);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Iniciar Sesión</h2>
      {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}
      
      <label htmlFor="login-email">Correo Electrónico</label>
      <input id="login-email" type="email" placeholder="correo@ejemplo.com" onChange={(e) => setCreds({...creds, correo: e.target.value})} />
      
      <label htmlFor="login-pass">Contraseña</label>
      <input id="login-pass" type="password" placeholder="********" onChange={(e) => setCreds({...creds, password: e.target.value})} />
      
      <button type="submit">Entrar</button>
    </form>
  );
}

export default Login;