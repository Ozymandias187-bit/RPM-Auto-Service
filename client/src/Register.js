import React, { useState } from 'react';
import axios from 'axios';

function Register({ setVista }) {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8085';

  const [formData, setFormData] = useState({ 
    nombre: '', 
    nombreUsuario: '', 
    correo: '', 
    password: '', 
    telefono: '', 
    zona: '' 
  });
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    // 1. Validación de campos vacíos
    if (!formData.nombre || !formData.correo || !formData.password || !formData.nombreUsuario || !formData.telefono || !formData.zona) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }

    // 2. NUEVA VALIDACIÓN: Longitud del nombre de usuario
    if (formData.nombreUsuario.length < 3 || formData.nombreUsuario.length > 20) {
      setMensaje("El nombre de usuario debe tener entre 3 y 20 caracteres.");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/users/register`, formData);
      setMensaje("¡Registro exitoso! Ya puedes iniciar sesión.");
      setFormData({ nombre: '', nombreUsuario: '', correo: '', password: '', telefono: '', zona: '' });
      
      // Redirigir al login después de 2 segundos para que vean el mensaje de éxito
      setTimeout(() => setVista('login'), 2000);
    } catch (error) {
      console.error("Error completo:", error);
      // Muestra el mensaje del servidor si existe, sino un mensaje genérico
      const errorMsg = error.response?.data?.message || 
                       error.response?.statusText || 
                       error.message || 
                       "Error al conectar con el servidor.";
      
      setMensaje(`Error ${error.response?.status || ''}: ${errorMsg}`);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '350px' }}>
        <h2>Registro</h2>
        
        {mensaje && (
          <p style={{ color: mensaje.includes('exitoso') ? 'green' : 'red', fontWeight: 'bold' }}>
            {mensaje}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label htmlFor="nombre">Nombre Completo</label>
          <input 
            id="nombre" type="text" placeholder="Ej. Juan Pérez" 
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
          />
          
          <label htmlFor="usuario">Nombre de Usuario</label>
          <input 
            id="usuario" type="text" placeholder="3-20 caracteres" 
            value={formData.nombreUsuario}
            onChange={(e) => setFormData({...formData, nombreUsuario: e.target.value})} 
          />
          
          <label htmlFor="correo">Correo Electrónico</label>
          <input 
            id="correo" type="email" placeholder="email@ejemplo.com" 
            value={formData.correo}
            onChange={(e) => setFormData({...formData, correo: e.target.value})} 
          />
          
          <label htmlFor="password">Contraseña</label>
          <input 
            id="password" type="password" placeholder="Cualquier contraseña" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
          
          <label htmlFor="telefono">Teléfono</label>
          <input 
            id="telefono" type="tel" placeholder="Ej. +504 9999-9999" 
            value={formData.telefono}
            onChange={(e) => setFormData({...formData, telefono: e.target.value})} 
          />
          
          <label htmlFor="zona">Zona de Residencia</label>
          <input 
            id="zona" type="text" placeholder="Ciudad o barrio" 
            value={formData.zona}
            onChange={(e) => setFormData({...formData, zona: e.target.value})} 
          />
          
          <button type="submit">Registrarse</button>
        </div>
      </form>
    </div>
  );
}

export default Register;