import React, { useState } from 'react';
import axios from 'axios';

function Login({ setVista, setUsuario }) {
  const [creds, setCreds] = useState({ correo: '', password: '' });
  const [mensaje, setMensaje] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8085/api/users/login', creds);
      setUsuario(res.data);
      if (res.data.rol === 'ADMIN') {
        setVista('admin');
      } else {
        setVista('catalogo');
      }
    } catch (err) {
      setMensaje("Error: Usuario o contraseña incorrectos");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Iniciar Sesión</h2>
      {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}
      <input type="email" placeholder="Correo" onChange={(e) => setCreds({...creds, correo: e.target.value})} />
      <input type="password" placeholder="Contraseña" onChange={(e) => setCreds({...creds, password: e.target.value})} />
      <button type="submit">Entrar</button>
    </form>
  );
}

export default Login;