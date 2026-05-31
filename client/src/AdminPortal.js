import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function AdminPortal({ usuario }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [formulario, setFormulario] = useState({ tipo: null, datos: {} });

  // 1. Declaramos los hooks SIEMPRE, sin importar nada más
  const cargarVehiculos = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8085/api/vehiculos');
      setVehiculos(res.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    cargarVehiculos();
  }, [cargarVehiculos]);

  // 2. AHORA realizamos la validación de seguridad
  if (!usuario || usuario.rol !== 'ADMIN') {
    return <h2>Acceso Denegado.</h2>;
  }

  // 3. El resto de la lógica va después
  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (formulario.tipo === 'crear') {
        await axios.post('http://localhost:8085/api/vehiculos', formulario.datos);
      } else {
        await axios.put(`http://localhost:8085/api/vehiculos/${formulario.datos.id}`, formulario.datos);
      }
      setFormulario({ tipo: null, datos: {} });
      cargarVehiculos();
    } catch (err) { alert("Error al guardar"); }
  };

  const eliminarVehiculo = async (id) => {
    if (window.confirm("¿Seguro?")) {
      await axios.delete(`http://localhost:8085/api/vehiculos/${id}`);
      cargarVehiculos();
    }
  };

  return (
    <div className="admin-container">
      <h1>Panel de Administración</h1>
      {!formulario.tipo ? (
        <>
          <button onClick={() => setFormulario({ tipo: 'crear', datos: {} })}>+ Agregar Vehículo</button>
          <ul>
            {vehiculos.map((v) => (
              <li key={v.id}>
                {v.marca} {v.modelo} - ${v.precio}
                <button onClick={() => setFormulario({ tipo: 'editar', datos: v })}>Editar</button>
                <button onClick={() => eliminarVehiculo(v.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <form onSubmit={handleGuardar}>
          <h2>{formulario.tipo === 'crear' ? 'Nuevo Vehículo' : 'Editar Ficha'}</h2>
          <input placeholder="Marca" defaultValue={formulario.datos.marca || ''} 
                 onChange={(e) => setFormulario({...formulario, datos: {...formulario.datos, marca: e.target.value}})} />
          <input placeholder="Modelo" defaultValue={formulario.datos.modelo || ''} 
                 onChange={(e) => setFormulario({...formulario, datos: {...formulario.datos, modelo: e.target.value}})} />
          <input placeholder="Precio" defaultValue={formulario.datos.precio || ''} 
                 onChange={(e) => setFormulario({...formulario, datos: {...formulario.datos, precio: e.target.value}})} />
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => setFormulario({ tipo: null, datos: {} })}>Cancelar</button>
        </form>
      )}
    </div>
  );
}

export default AdminPortal;