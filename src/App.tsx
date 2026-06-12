import { useState, useEffect } from 'react'

function App() {
  const [colaboradores, setColaboradores] = useState<any[]>([])
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
    fetch(BASE_URL)
      .then(respuesta => respuesta.json())
      .then(datos => setColaboradores(datos))
      .catch(error => console.error("Error al cargar:", error));
  }

  useEffect(() => {
    cargarColaboradores()
  }, [])

  const manejarCambio = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const guardarOActualizar = (e: any) => {
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
        alert("¡Error! No se pudo guardar.");
      }
    })
    .catch(error => console.error("Error al guardar:", error));
  }

  const editarColaborador = (colaborador: any) => setFormulario(colaborador);

  const eliminarColaborador = (id: any) => {
    if (window.confirm("¿Estás seguro de eliminar este colaborador?")) {
      fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
      .then(() => cargarColaboradores())
      .catch(error => console.error("Error al eliminar:", error));
    }
  }

  const limpiarFormulario = () => {
    setFormulario({ id: null, documentoIdentidad: '', nombres: '', apellidos: '', correoElectronico: '', cargo: '', fechaIngreso: '', estadoActivo: true });
  }

  return (
    <div style={{ padding: '10px', fontFamily: 'sans-serif', maxWidth: '100vw', overflowX: 'hidden' }}>
      <h1 style={{ color: '#2c3e50', textAlign: 'center', fontSize: '1.5rem' }}>Gestión de Talento Humano</h1>
      
      <div style={{ backgroundColor: '#ecf0f1', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>{formulario.id ? 'Actualizar Colaborador' : 'Registrar Nuevo'}</h3>
        <form onSubmit={guardarOActualizar} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" name="documentoIdentidad" placeholder="Documento" required value={formulario.documentoIdentidad} onChange={manejarCambio} style={{ padding: '12px', width: '100%', boxSizing: 'border-box', border: '1px solid #ccc' }} />
          <input type="text" name="nombres" placeholder="Nombres" required value={formulario.nombres} onChange={manejarCambio} style={{ padding: '12px', width: '100%', boxSizing: 'border-box', border: '1px solid #ccc' }} />
          <input type="text" name="apellidos" placeholder="Apellidos" required value={formulario.apellidos} onChange={manejarCambio} style={{ padding: '12px', width: '100%', boxSizing: 'border-box', border: '1px solid #ccc' }} />
          <input type="email" name="correoElectronico" placeholder="Correo" required value={formulario.correoElectronico} onChange={manejarCambio} style={{ padding: '12px', width: '100%', boxSizing: 'border-box', border: '1px solid #ccc' }} />
          <input type="text" name="cargo" placeholder="Cargo" required value={formulario.cargo} onChange={manejarCambio} style={{ padding: '12px', width: '100%', boxSizing: 'border-box', border: '1px solid #ccc' }} />
          <input type="date" name="fechaIngreso" required value={formulario.fechaIngreso} onChange={manejarCambio} style={{ padding: '12px', width: '100%', boxSizing: 'border-box', border: '1px solid #ccc' }} />
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input type="checkbox" name="estadoActivo" checked={formulario.estadoActivo} onChange={manejarCambio} /> Activo
          </label>
                  
          <button type="submit" style={{ padding: '12px', backgroundColor: formulario.id ? '#f39c12' : '#27ae60', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            {formulario.id ? 'Actualizar' : 'Guardar'}
          </button>
        </form>
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Doc</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nombre</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Cargo</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Estado</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {colaboradores.map((c: any) => (
              <tr key={c.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.documentoIdentidad}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.nombres}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.cargo}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd', color: c.estadoActivo ? 'green' : 'red' }}>{c.estadoActivo ? 'Activo' : 'Inactivo'}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                  <button onClick={() => editarColaborador(c)} style={{ padding: '5px', marginRight: '5px' }}>Ed</button>
                  <button onClick={() => eliminarColaborador(c.id)} style={{ padding: '5px', backgroundColor: '#e74c3c', color: 'white' }}>El</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App