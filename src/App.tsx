import { useState, useEffect } from 'react'

function App() {
  const [colaboradores, setColaboradores] = useState([])
  const [formulario, setFormulario] = useState({
    id: null,
    documentoIdentidad: '',
    nombres: '',
    apellidos: '',
    correoElectronico: '',
    cargo: '',
    fechaIngreso: '',
    estadoActivo: true
  })

  const BASE_URL = 'https://talento-humano-backend.onrender.com/api/colaboradores';

  const cargarColaboradores = () => {
    // Fíjate que estoy escribiendo la ruta COMPLETA manualmente aquí
    fetch('https://talento-humano-backend.onrender.com/api/colaboradores')
      .then(respuesta => respuesta.json())
      .then(datos => setColaboradores(datos))
      .catch(error => console.error("Error al cargar:", error));
}

  useEffect(() => {
    cargarColaboradores()
  }, [])

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const guardarOActualizar = (e) => {
    e.preventDefault();

    const metodo = formulario.id ? 'PUT' : 'POST';
    const url = formulario.id ? `${BASE_URL}/${formulario.id}` : BASE_URL;

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formulario)
    })
    .then(respuesta => {
      if (respuesta.ok) {
        limpiarFormulario();
        cargarColaboradores();
      } else {
        alert("¡Error! No se pudo guardar. Verifica los datos.");
      }
    })
    .catch(error => console.error("Error al guardar:", error));
  }

  const editarColaborador = (colaborador) => {
    setFormulario(colaborador);
  }

  const eliminarColaborador = (id) => {
    if (window.confirm("¿Estás seguro de eliminar a este colaborador?")) {
      fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
      .then(() => cargarColaboradores())
      .catch(error => console.error("Error al eliminar:", error));
    }
  }

  const limpiarFormulario = () => {
    setFormulario({ id: null, documentoIdentidad: '', nombres: '', apellidos: '', correoElectronico: '', cargo: '', fechaIngreso: '', estadoActivo: true });
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>Gestión de Talento Humano</h1>
      
      <div style={{ backgroundColor: '#ecf0f1', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>{formulario.id ? 'Actualizar Colaborador' : 'Registrar Nuevo Colaborador'}</h3>
        <form onSubmit={guardarOActualizar} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="text" name="documentoIdentidad" placeholder="Documento" required value={formulario.documentoIdentidad} onChange={manejarCambio} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="text" name="nombres" placeholder="Nombres" required value={formulario.nombres} onChange={manejarCambio} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="text" name="apellidos" placeholder="Apellidos" required value={formulario.apellidos} onChange={manejarCambio} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="email" name="correoElectronico" placeholder="Correo" required value={formulario.correoElectronico} onChange={manejarCambio} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="text" name="cargo" placeholder="Cargo" required value={formulario.cargo} onChange={manejarCambio} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="date" name="fechaIngreso" required value={formulario.fechaIngreso} onChange={manejarCambio} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input type="checkbox" name="estadoActivo" checked={formulario.estadoActivo} onChange={manejarCambio} />
            Activo
          </label>
                  
          <button type="submit" style={{ padding: '8px 15px', backgroundColor: formulario.id ? '#f39c12' : '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {formulario.id ? 'Actualizar' : 'Guardar'}
          </button>
          
          {formulario.id && (
            <button type="button" onClick={limpiarFormulario} style={{ padding: '8px 15px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#34495e', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Documento</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Nombres</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Apellidos</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Correo</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Cargo</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Estado</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {colaboradores.map(c => (
            <tr key={c.id} style={{ backgroundColor: '#f9f9f9' }}>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{c.documentoIdentidad}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{c.nombres}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{c.apellidos}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{c.correoElectronico}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{c.cargo}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                <span style={{ color: c.estadoActivo ? 'green' : 'red', fontWeight: 'bold' }}>
                  {c.estadoActivo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                <button onClick={() => editarColaborador(c)} style={{ padding: '6px 12px', backgroundColor: '#f1c40f', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Editar</button>
                <button onClick={() => eliminarColaborador(c.id)} style={{ padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App