import React, { useState, useEffect } from 'react';
import axios from 'axios';
 
function UserProfile({ usuario, setUsuario, setVista }) {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8085';
  const [formData, setFormData] = useState({ 
    nombre: usuario?.nombre || '', 
    correo: usuario?.correo || '', 
    nombreUsuario: usuario?.nombreUsuario || '',
    telefono: usuario?.telefono || '',
    zona: usuario?.zona || '',
    password: '' 
  });
  const [mensaje, setMensaje] = useState('');
  const [citas, setCitas] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(true);
  const [errorCitas, setErrorCitas] = useState(null);

  useEffect(() => {
    const cargarCitas = async () => {
      if (usuario && usuario.id) {
        try {
          const res = await axios.get(`${API_URL}/api/citas/usuario/${usuario.id}`);
          setCitas(res.data);
        } catch (err) {
          console.error("Error al cargar las citas del usuario:", err);
          setErrorCitas("No se pudieron cargar tus citas.");
        } finally { setLoadingCitas(false); }
      }
    };
    cargarCitas();
  }, [usuario, API_URL]); // Recargar citas si el usuario o la URL de la API cambian

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const res = await axios.put(`${API_URL}/api/users/${usuario.id}`, formData);
      setUsuario(res.data.user);
      setMensaje("Perfil actualizado con éxito.");
    } catch (err) {
      const msg = err.response?.data?.message || "Error al actualizar perfil.";
      setMensaje(`Error: ${msg}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      try {
        await axios.delete(`${API_URL}/api/users/${usuario.id}`);
        setUsuario(null);
        setVista('inicio');
        alert("Tu cuenta ha sido eliminada.");
      } catch (err) {
        alert("Error al eliminar la cuenta.");
      }
    }
  };

  if (!usuario) return <p>No has iniciado sesión.</p>;

  return (
    <div className="profile-container" style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Mi Perfil</h2>
      {mensaje && <p style={{ color: mensaje.includes('Error') ? 'red' : 'green', fontWeight: 'bold' }}>{mensaje}</p>}
      
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label>Nombre Completo</label>
        <input value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
        
        <label>Nombre de Usuario</label>
        <input value={formData.nombreUsuario} onChange={(e) => setFormData({...formData, nombreUsuario: e.target.value})} />

        <label>Correo Electrónico</label>
        <input value={formData.correo} onChange={(e) => setFormData({...formData, correo: e.target.value})} />

        <label>Teléfono</label>
        <input value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />

        <label>Zona</label>
        <input value={formData.zona} onChange={(e) => setFormData({...formData, zona: e.target.value})} />

        <label>Nueva Contraseña (dejar vacío si no deseas cambiarla)</label>
        <input 
          type="password" 
          placeholder="********" 
          value={formData.password} 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />

        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Guardar Cambios</button>
      </form>

      <div style={{ marginTop: '30px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
        <h3>Mis Citas Agendadas</h3>
        {loadingCitas ? (
          <p>Cargando citas...</p>
        ) : errorCitas ? (
          <p style={{ color: 'red' }}>{errorCitas}</p>
        ) : citas.length === 0 ? (
          <p>No tienes citas agendadas.</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {citas.map(cita => (
              <li key={cita.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                <p><strong>Vehículo:</strong> {cita.vehiculo.marca} {cita.vehiculo.modelo} ({cita.vehiculo.anio})</p>
                <p><strong>Fecha:</strong> {cita.fecha} <strong>Hora:</strong> {cita.hora}</p>
                <p><strong>Tipo:</strong> {cita.tipo} <strong>Estado:</strong> {cita.estado}</p>
                {cita.comentarios && <p><strong>Comentarios:</strong> {cita.comentarios}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ marginTop: '30px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
        <h3 style={{ color: '#d9534f' }}>Zona de Peligro</h3>
        <button onClick={handleDelete} style={{ backgroundColor: '#d9534f', color: 'white', padding: '10px', border: 'none', cursor: 'pointer', borderRadius: '5px', width: '100%' }}>
          Eliminar mi cuenta definitivamente
        </button>
      </div>
    </div>
  );
}

export default UserProfile;