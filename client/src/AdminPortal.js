import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Asegúrate de tener axios instalado: npm install axios

function AdminPortal({ usuario, setVista, API_URL }) {
  // const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8085';
  const [vehiculos, setVehiculos] = useState([]);
  const [citasAdmin, setCitasAdmin] = useState([]); // Nuevo estado para las citas
  const [ventas, setVentas] = useState([]); // Nuevo estado para las ventas
  const [usuarios, setUsuarios] = useState([]); // Nuevo estado para los usuarios
  const [formulario, setFormulario] = useState({ tipo: null, datos: {} });
  const [adminView, setAdminView] = useState('vehiculos'); // 'vehiculos', 'citas' o 'ventas'
  const [formVenta, setFormVenta] = useState({ tipoVenta: 'VEHICULO', usuarioId: '', vehiculoId: '', precioFinal: '', detalleServicio: '', estadoPago: 'PAGADO' });
  const [mostrarFormVenta, setMostrarFormVenta] = useState(false);

  // 1. Cargar Vehículos (Ruta pública, no necesita rol)
  const cargarVehiculos = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/vehiculos`);
      setVehiculos(res.data);
    } catch (err) { console.error(err); }
  }, [API_URL]);

  // Nueva función para cargar todos los usuarios para el administrador
  const cargarUsuarios = useCallback(async () => {
    if (usuario && usuario.rol === 'ADMIN') {
      try {
        const res = await axios.get(`${API_URL}/api/users/all`, {
           headers: { 'x-user-role': usuario.rol }
        });
        setUsuarios(res.data);
      } catch (err) { console.error("Error al cargar usuarios:", err); }
    }
  }, [API_URL, usuario]);

  // Nueva función para cargar todas las citas para el administrador
  const cargarTodasCitas = useCallback(async () => {
    if (usuario && usuario.rol === 'ADMIN') {
      try {
        const res = await axios.get(`${API_URL}/api/citas/all`, {
          headers: { 'x-user-role': usuario.rol } // Enviar el rol en los headers para verificación
        });
        setCitasAdmin(res.data);
      } catch (err) {
        console.error("Error al cargar todas las citas para admin:", err);
      }
    }
  }, [API_URL, usuario]);

  // Nueva función para cargar todas las ventas para el administrador
  const cargarVentas = useCallback(async () => {
    if (usuario && usuario.rol === 'ADMIN') {
      try {
        const res = await axios.get(`${API_URL}/api/ventas`, {
          headers: { 'x-user-role': usuario.rol }
        });
        setVentas(res.data);
      } catch (err) {
        console.error("Error al cargar ventas:", err);
      }
    }
  }, [API_URL, usuario]);

  useEffect(() => {
    if (adminView === 'vehiculos') cargarVehiculos();
    if (adminView === 'citas') cargarTodasCitas();
    if (adminView === 'ventas') { cargarVentas(); cargarVehiculos(); cargarUsuarios(); }
  }, [adminView, cargarVehiculos, cargarTodasCitas, cargarVentas, cargarUsuarios]);


  // 2. Validación de seguridad en el Frontend
  if (!usuario || usuario.rol !== 'ADMIN') {
    return <h2>Acceso Denegado. Solo administradores.</h2>;
  }

  // 3. Guardar o Editar
  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      // IMPORTANTE: Incluimos el rol en los datos que enviamos al servidor
      const payload = { 
        ...formulario.datos, 
        rol: usuario.rol 
      };

      if (formulario.tipo === 'crear') {
        // Ajustado a la ruta de tu backend: /agregar
        await axios.post(`${API_URL}/api/vehiculos/agregar`, payload, {
          headers: { 'x-user-role': usuario.rol }
        });
      } else {
        // Ajustado a tu backend: /editar/:id o la ruta PUT que tengas
        await axios.put(`${API_URL}/api/vehiculos/editar/${formulario.datos.id}`, payload, {
          headers: { 'x-user-role': usuario.rol }
        });
      }
      
      setFormulario({ tipo: null, datos: {} });
      cargarVehiculos();
      alert("Operación exitosa");
    } catch (err) { 
      console.error(err);
      alert("Error al guardar: " + (err.response?.data?.message || err.message)); 
    }
  };

  // 4. Eliminar
  const eliminarVehiculo = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este vehículo?")) {
      try {
        // Para métodos DELETE, los datos del body (como el rol) se envían en la propiedad 'data'
        await axios.delete(`${API_URL}/api/vehiculos/eliminar/${id}`, {
          data: { rol: usuario.rol },
          headers: { 'x-user-role': usuario.rol }
        });
        cargarVehiculos();
        alert("Vehículo eliminado");
      } catch (err) {
        alert("Error al eliminar: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleRegistrarVenta = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...formVenta, 
        rol: usuario.rol 
      };

      await axios.post(`${API_URL}/api/ventas/agregar`, payload, {
        headers: { 'x-user-role': usuario.rol }
      });
      
      setMostrarFormVenta(false);
      setFormVenta({ tipoVenta: 'VEHICULO', usuarioId: '', vehiculoId: '', precioFinal: '', detalleServicio: '', estadoPago: 'PAGADO' });
      cargarVentas();
      alert("Venta registrada exitosamente");
    } catch (err) {
      console.error(err);
      alert("Error al registrar venta: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="admin-container" style={{ padding: '20px' }}>
      {/* Botón de cerrar sesión integrado en tu diseño */}
      <button onClick={() => setVista('login')} style={{ float: 'right', background: '#e74c3c', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer' }}>
        Cerrar Sesión
      </button>

      <h1 style={{ marginBottom: '20px' }}>Panel de Administración</h1>
      <p>Bienvenido, {usuario.nombre}</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setAdminView('vehiculos')} 
          style={{ padding: '10px 15px', marginRight: '10px', backgroundColor: adminView === 'vehiculos' ? '#007bff' : '#f0f0f0', color: adminView === 'vehiculos' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Gestionar Vehículos
        </button>
        <button 
          onClick={() => setAdminView('citas')} 
          style={{ padding: '10px 15px', marginRight: '10px', backgroundColor: adminView === 'citas' ? '#007bff' : '#f0f0f0', color: adminView === 'citas' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Ver Citas
        </button>
        <button 
          onClick={() => setAdminView('ventas')} 
          style={{ padding: '10px 15px', backgroundColor: adminView === 'ventas' ? '#007bff' : '#f0f0f0', color: adminView === 'ventas' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Ver Ventas
        </button>
      </div>

      {adminView === 'vehiculos' && !formulario.tipo ? (
        <>
          <button
            onClick={() => setFormulario({ tipo: 'crear', datos: {} })}
            style={{ marginBottom: '20px', padding: '10px', background: '#27ae60', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            + Agregar Vehículo
          </button>
          
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f2f2f2' }}>
                <th style={{ padding: '10px' }}>Marca y Modelo</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map((v) => (
                <tr key={v.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{v.marca} {v.modelo} ({v.anio || 'N/A'})</td>
                  <td>${v.precio}</td>
                  <td>
                    <button onClick={() => setFormulario({ tipo: 'editar', datos: v })} style={{ marginRight: '10px', padding: '4px 8px', cursor: 'pointer' }}>Editar</button>
                    <button onClick={() => eliminarVehiculo(v.id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '4px 8px', cursor: 'pointer' }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : adminView === 'vehiculos' && formulario.tipo ? (
        <form onSubmit={handleGuardar} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
          <h2>{formulario.tipo === 'crear' ? 'Nuevo Vehículo' : 'Editar Ficha'}</h2>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Marca:</label>
            <input required placeholder="Ej: Toyota" value={formulario.datos.marca || ''} 
                   onChange={(e) => setFormulario({...formulario, datos: {...formulario.datos, marca: e.target.value}})} 
                   style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Modelo:</label>
            <input required placeholder="Ej: Corolla" value={formulario.datos.modelo || ''} 
                   onChange={(e) => setFormulario({...formulario, datos: {...formulario.datos, modelo: e.target.value}})} 
                   style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Año:</label>
            <input required type="number" placeholder="Ej: 2023" value={formulario.datos.anio || ''} 
                   onChange={(e) => setFormulario({...formulario, datos: {...formulario.datos, anio: e.target.value}})} 
                   style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Precio ($):</label>
            <input required type="number" placeholder="Ej: 25000" value={formulario.datos.precio || ''} 
                   onChange={(e) => setFormulario({...formulario, datos: {...formulario.datos, precio: e.target.value}})} 
                   style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Descripción del Vehículo:</label>
            <textarea required rows="3" placeholder="Ej: Único dueño, excelentes condiciones, mantenimientos al día..." value={formulario.datos.descripcion || ''} 
                      onChange={(e) => setFormulario({...formulario, datos: {...formulario.datos, descripcion: e.target.value}})} 
                      style={{ width: '100%', padding: '8px', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            <small style={{ color: '#7f8c8d', display: 'block', marginTop: '2px' }}>Mínimo 10 caracteres obligatorios para el backend.</small>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>URL de la Imagen:</label>
            <input placeholder="Ej: https://imagenes.com/carro.jpg" value={formulario.datos.imagen || ''} 
                   onChange={(e) => setFormulario({...formulario, datos: {...formulario.datos, imagen: e.target.value}})} 
                   style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            <small style={{ color: '#7f8c8d', display: 'block', marginTop: '2px' }}>Opcional. Si se deja vacío, el servidor asignará una por defecto.</small>
          </div>

          <button type="submit" style={{ background: '#3498db', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer', marginRight: '10px' }}>
            Guardar
          </button>
          <button type="button" onClick={() => setFormulario({ tipo: null, datos: {} })} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Cancelar
          </button>
        </form>
      ) : adminView === 'citas' ? (
        <div className="admin-citas-container">
          <h2>Citas Agendadas por Usuarios</h2>
          {citasAdmin.length === 0 ? (
            <p>No hay citas agendadas.</p>
          ) : (
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ background: '#f2f2f2' }}>
                  <th style={{ padding: '10px' }}>Fecha</th>
                  <th>Hora</th>
                  <th>Vehículo</th>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Comentarios</th>
                </tr>
              </thead>
              <tbody>
                {citasAdmin.map(cita => (
                  <tr key={cita.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px' }}>{cita.fecha}</td>
                    <td>{cita.hora}</td>
                    <td>{cita.vehiculo ? `${cita.vehiculo.marca} ${cita.vehiculo.modelo} (${cita.vehiculo.anio})` : 'N/A'}</td>
                    <td>{cita.cliente ? cita.cliente.nombre : 'N/A'}</td>
                    <td>{cita.cliente ? cita.cliente.correo : 'N/A'}</td>
                    <td>{cita.tipo}</td>
                    <td>{cita.estado}</td>
                    <td>{cita.comentarios || 'Sin comentarios'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : adminView === 'ventas' ? (
        <div className="admin-ventas-container">
          <h2>Registro de Ventas Realizadas</h2>
          
          <button 
            onClick={() => setMostrarFormVenta(!mostrarFormVenta)}
            style={{ marginBottom: '20px', padding: '10px', background: '#27ae60', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            {mostrarFormVenta ? 'Cancelar' : '+ Registrar Nueva Venta'}
          </button>

          {mostrarFormVenta && (
            <form onSubmit={handleRegistrarVenta} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3>Nueva Venta / Servicio</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label>Cliente:</label>
                  <select required value={formVenta.usuarioId} onChange={(e) => setFormVenta({...formVenta, usuarioId: e.target.value})} style={{ width: '100%', padding: '8px' }}>
                    <option value="">Seleccione un cliente</option>
                    {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre} ({u.correo})</option>)}
                  </select>
                </div>
                <div>
                  <label>Tipo de Venta:</label>
                  <select value={formVenta.tipoVenta} onChange={(e) => setFormVenta({...formVenta, tipoVenta: e.target.value})} style={{ width: '100%', padding: '8px' }}>
                    <option value="VEHICULO">Vehículo</option>
                    <option value="SERVICIO">Servicio de Mantenimiento</option>
                  </select>
                </div>
                {formVenta.tipoVenta === 'VEHICULO' ? (
                  <div>
                    <label>Vehículo:</label>
                    <select required value={formVenta.vehiculoId} onChange={(e) => setFormVenta({...formVenta, vehiculoId: e.target.value})} style={{ width: '100%', padding: '8px' }}>
                      <option value="">Seleccione un vehículo</option>
                      {vehiculos.map(v => <option key={v.id} value={v.id}>{v.marca} {v.modelo} ({v.anio})</option>)}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label>Tipo de Mantenimiento:</label>
                    <input required placeholder="Ej: Cambio de aceite, Frenos..." value={formVenta.detalleServicio} onChange={(e) => setFormVenta({...formVenta, detalleServicio: e.target.value})} style={{ width: '100%', padding: '8px' }} />
                  </div>
                )}
                <div>
                  <label>Monto Total ($):</label>
                  <input required type="number" placeholder="0.00" value={formVenta.precioFinal} onChange={(e) => setFormVenta({...formVenta, precioFinal: e.target.value})} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div>
                  <label>Estado de Pago:</label>
                  <select value={formVenta.estadoPago} onChange={(e) => setFormVenta({...formVenta, estadoPago: e.target.value})} style={{ width: '100%', padding: '8px' }}>
                    <option value="PAGADO">Pagado</option>
                    <option value="PENDIENTE">Pendiente</option>
                  </select>
                </div>
              </div>
              <button type="submit" style={{ marginTop: '15px', padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', cursor: 'pointer' }}>Registrar Venta</button>
            </form>
          )}

          {ventas.length === 0 ? (
            <p>No hay ventas registradas.</p>
          ) : (
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ background: '#f2f2f2' }}>
                  <th style={{ padding: '10px' }}>Fecha</th>
                  <th>Tipo</th>
                  <th>Cliente</th>
                  <th>Detalle</th>
                  <th>Precio Final</th>
                  <th>Estado Pago</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map(venta => (
                  <tr key={venta.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px' }}>{new Date(venta.fechaVenta).toLocaleDateString()}</td>
                    <td>{venta.tipoVenta}</td>
                    <td>{venta.comprador ? venta.comprador.nombre : 'N/A'}</td>
                    <td>{venta.tipoVenta === 'VEHICULO' ? (venta.vehiculo ? `${venta.vehiculo.marca} ${venta.vehiculo.modelo}` : 'N/A') : (venta.detalleServicio || 'Mantenimiento')}</td>
                    <td>${venta.precioFinal}</td>
                    <td>{venta.estadoPago}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default AdminPortal;