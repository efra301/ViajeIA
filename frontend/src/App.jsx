import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import Login from './components/Login'
import Register from './components/Register'
import './App.css'

const METRICAS_INICIALES = {
  totalUsuarios: 0,
  totalConsultas: 0,
  destinos: {},
  consultasPorDia: {}
}

function App() {
  const { currentUser, logout, guardarConsulta, userData, loading, error } = useAuth()
  const [mostrarAuth, setMostrarAuth] = useState('login') // 'login' o 'register'
  const [mostrarFormulario, setMostrarFormulario] = useState(true)

  // Debug: Log del estado de autenticación
  useEffect(() => {
    console.log('🔍 App - Estado Auth:', { 
      loading, 
      currentUser: currentUser?.email || 'null', 
      error,
      mostrarFormulario 
    })
  }, [loading, currentUser, error, mostrarFormulario])
  const [datosViaje, setDatosViaje] = useState({
    destino: '',
    fecha: '',
    presupuesto: '',
    preferencia: ''
  })
  const [pregunta, setPregunta] = useState('')
  const [respuesta, setRespuesta] = useState('')
  const [fotos, setFotos] = useState([])
  const [infoDestino, setInfoDestino] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [historial, setHistorial] = useState([])
  const [favoritos, setFavoritos] = useState(() => {
    // Cargar favoritos del localStorage
    const saved = localStorage.getItem('viajeia_favoritos')
    return saved ? JSON.parse(saved) : []
  })
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false)
  const [metricas, setMetricas] = useState(METRICAS_INICIALES)

  // useEffect para métricas - DEBE estar antes de cualquier return condicional
  useEffect(() => {
    const metricasGuardadas = localStorage.getItem('viajeia_metricas')
    let metricasActuales = metricasGuardadas ? JSON.parse(metricasGuardadas) : { ...METRICAS_INICIALES }

    if (!localStorage.getItem('viajeia_usuario_registrado')) {
      metricasActuales.totalUsuarios += 1
      localStorage.setItem('viajeia_usuario_registrado', 'true')
    }

    setMetricas(metricasActuales)
    localStorage.setItem('viajeia_metricas', JSON.stringify(metricasActuales))
  }, [])

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #4a90e2 100%)',
        color: 'white',
        fontSize: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>✈️</div>
          <div>Cargando ViajeIA...</div>
          <div style={{ fontSize: '14px', marginTop: '20px', opacity: 0.8 }}>
            Si esto tarda mucho, verifica tu conexión a internet
          </div>
          {error && (
            <div style={{ 
              fontSize: '12px', 
              marginTop: '20px', 
              padding: '10px',
              background: 'rgba(255,0,0,0.2)',
              borderRadius: '5px'
            }}>
              Error: {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Si hay un error crítico, mostrarlo
  if (error && !currentUser) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #4a90e2 100%)',
        color: 'white',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          <h2>Error de Conexión</h2>
          <p style={{ marginTop: '10px', opacity: 0.9 }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: 'white',
              color: '#1e3a5f',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Recargar Página
          </button>
        </div>
      </div>
    )
  }

  // Si no hay usuario autenticado, mostrar pantalla de login/registro
  if (!currentUser) {
    console.log('🔍 No hay usuario, mostrando Login/Register')
    return (
      <>
        {mostrarAuth === 'login' ? (
          <Login onSwitchToRegister={() => setMostrarAuth('register')} />
        ) : (
          <Register onSwitchToLogin={() => setMostrarAuth('login')} />
        )}
      </>
    )
  }

  // Si hay usuario autenticado, mostrar la aplicación
  console.log('🔍 Usuario autenticado:', currentUser.email, 'mostrarFormulario:', mostrarFormulario)

  // Calcular métricas (solo se usan si hay usuario autenticado)
  const topDestinos = Object.entries(metricas.destinos || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  const consultasPorDiaOrdenadas = Object.entries(metricas.consultasPorDia || {})
    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
    .slice(0, 5)

  const actualizarMetricas = (destinoActual) => {
    setMetricas((prev) => {
      const actualizadas = {
        totalUsuarios: prev.totalUsuarios,
        totalConsultas: prev.totalConsultas + 1,
        destinos: { ...(prev.destinos || {}) },
        consultasPorDia: { ...(prev.consultasPorDia || {}) }
      }

      const fechaHoy = new Date().toISOString().split('T')[0]
      actualizadas.consultasPorDia[fechaHoy] = (actualizadas.consultasPorDia[fechaHoy] || 0) + 1

      if (destinoActual) {
        const destinoKey = destinoActual.toLowerCase()
        actualizadas.destinos[destinoKey] = (actualizadas.destinos[destinoKey] || 0) + 1
      }

      localStorage.setItem('viajeia_metricas', JSON.stringify(actualizadas))
      return actualizadas
    })
  }

  const handleFormularioSubmit = (e) => {
    e.preventDefault()
    if (datosViaje.destino && datosViaje.fecha && datosViaje.presupuesto && datosViaje.preferencia) {
      setMostrarFormulario(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setDatosViaje(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const guardarFavorito = () => {
    if (!datosViaje.destino) return
    
    const nuevoFavorito = {
      id: Date.now(),
      destino: datosViaje.destino,
      fecha: datosViaje.fecha,
      presupuesto: datosViaje.presupuesto,
      preferencia: datosViaje.preferencia,
      fechaGuardado: new Date().toLocaleString('es-ES'),
      historial: historial
    }
    
    const nuevosFavoritos = [...favoritos, nuevoFavorito]
    setFavoritos(nuevosFavoritos)
    localStorage.setItem('viajeia_favoritos', JSON.stringify(nuevosFavoritos))
    alert(`✅ ${datosViaje.destino} guardado en favoritos!`)
  }

  const eliminarFavorito = (id) => {
    const nuevosFavoritos = favoritos.filter(f => f.id !== id)
    setFavoritos(nuevosFavoritos)
    localStorage.setItem('viajeia_favoritos', JSON.stringify(nuevosFavoritos))
  }

  const cargarFavorito = (favorito) => {
    setDatosViaje({
      destino: favorito.destino,
      fecha: favorito.fecha,
      presupuesto: favorito.presupuesto,
      preferencia: favorito.preferencia
    })
    setHistorial(favorito.historial || [])
    setMostrarFormulario(false)
    setMostrarFavoritos(false)
  }

  const exportarPDF = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF()
      
      // Logo y título
      doc.setFontSize(24)
      doc.setTextColor(30, 60, 114) // Color azul
      doc.text('ViajeIA', 105, 20, { align: 'center' })
      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      doc.text('Tu Asistente Personal de Viajes', 105, 28, { align: 'center' })
      
      // Línea separadora
      doc.setDrawColor(30, 60, 114)
      doc.line(20, 35, 190, 35)
      
      // Información del viaje
      doc.setFontSize(16)
      doc.setTextColor(30, 60, 114)
      doc.text('Información del Viaje', 20, 45)
      
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      let y = 55
      doc.text(`Destino: ${datosViaje.destino}`, 20, y)
      y += 7
      doc.text(`Fecha: ${new Date(datosViaje.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`, 20, y)
      y += 7
      doc.text(`Presupuesto: ${datosViaje.presupuesto}`, 20, y)
      y += 7
      doc.text(`Preferencia: ${datosViaje.preferencia}`, 20, y)
      y += 15
      
      // Historial de conversaciones
      if (historial.length > 0) {
        doc.setFontSize(16)
        doc.setTextColor(30, 60, 114)
        doc.text('Recomendaciones y Planificación', 20, y)
        y += 10
        
        doc.setFontSize(10)
        doc.setTextColor(0, 0, 0)
        
        historial.forEach((entrada, index) => {
          if (y > 270) {
            doc.addPage()
            y = 20
          }
          
          doc.setFontSize(11)
          doc.setTextColor(30, 60, 114)
          doc.text(`Pregunta ${index + 1}: ${entrada.pregunta}`, 20, y)
          y += 7
          
          doc.setFontSize(10)
          doc.setTextColor(0, 0, 0)
          const respuestaLines = doc.splitTextToSize(entrada.respuesta, 170)
          doc.text(respuestaLines, 20, y)
          y += respuestaLines.length * 5 + 5
          
          doc.line(20, y, 190, y)
          y += 5
        })
      }
      
      // Guardar PDF
      doc.save(`ViajeIA_${datosViaje.destino}_${new Date().toISOString().split('T')[0]}.pdf`)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pregunta.trim()) return

    setCargando(true)
    setRespuesta('')
    setFotos([])
    setInfoDestino(null)

    try {
      // Usar variable de entorno en producción, localhost en desarrollo
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
      const response = await fetch(`${API_URL}/api/planificar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          pregunta: pregunta,
          datosViaje: datosViaje,
          historial: historial.slice(-5) // Enviar últimas 5 conversaciones para contexto
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Error del servidor: ${response.status}`)
      }

      const data = await response.json()
      if (data.error) {
        setRespuesta(`Error: ${data.error}`)
        setFotos([])
        setInfoDestino(null)
      } else {
        const nuevaRespuesta = data.respuesta || 'No se pudo obtener una respuesta.'
        setRespuesta(nuevaRespuesta)
        setFotos(data.fotos || [])
        setInfoDestino(data.info_destino || null)
        
        // Agregar al historial
        const nuevaEntrada = {
          id: Date.now(),
          pregunta: pregunta,
          respuesta: nuevaRespuesta,
          fecha: new Date().toLocaleString('es-ES'),
          destino: datosViaje.destino,
          fotos: data.fotos || []
        }
        setHistorial(prev => [...prev, nuevaEntrada])
        actualizarMetricas(datosViaje.destino)

        // 🔥 Guardar consulta en Firebase
        const resultadoConsulta = await guardarConsulta({
          destino: datosViaje.destino,
          fechaViaje: datosViaje.fecha,
          presupuesto: datosViaje.presupuesto,
          preferencias: datosViaje.preferencia,
          pregunta: pregunta,
          respuesta: nuevaRespuesta
        })

        if (!resultadoConsulta.success) {
          console.error('Error al guardar consulta en Firebase:', resultadoConsulta.error)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setRespuesta(`Error al conectar con el servidor: ${error.message}. Asegúrate de que el backend esté ejecutándose en http://localhost:5001`)
    } finally {
      setCargando(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      // Limpiar estados locales al cerrar sesión
      setMostrarFormulario(true)
      setHistorial([])
      setDatosViaje({
        destino: '',
        fecha: '',
        presupuesto: '',
        preferencia: ''
      })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <div className="app">
      {infoDestino && (
        <div className="panel-lateral">
          <div className="panel-header">
            <h3 className="panel-titulo">📍 {infoDestino.ciudad}</h3>
            <p className="panel-subtitulo">{infoDestino.pais}</p>
          </div>
          
          <div className="panel-seccion">
            <div className="panel-item">
              <div className="panel-icono">🌡️</div>
              <div className="panel-contenido">
                <div className="panel-label">Temperatura</div>
                <div className="panel-valor">{infoDestino.temperatura}°C</div>
                <div className="panel-descripcion">{infoDestino.descripcion}</div>
              </div>
            </div>
          </div>

          <div className="panel-seccion">
            <div className="panel-item">
              <div className="panel-icono">🕐</div>
              <div className="panel-contenido">
                <div className="panel-label">Hora Local</div>
                <div className="panel-valor">{infoDestino.hora_destino}</div>
                <div className="panel-descripcion">
                  {infoDestino.diferencia_horaria > 0 ? '+' : ''}{infoDestino.diferencia_horaria}h diferencia
                </div>
              </div>
            </div>
          </div>

          {infoDestino.tipo_cambio && (
            <div className="panel-seccion">
              <div className="panel-item">
                <div className="panel-icono">💱</div>
                <div className="panel-contenido">
                  <div className="panel-label">Tipo de Cambio</div>
                  <div className="panel-valor">1 USD = {infoDestino.tipo_cambio.toFixed(2)} {infoDestino.simbolo_moneda}</div>
                  <div className="panel-descripcion">Moneda: {infoDestino.moneda}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="container">
        <header className="header">
          <div className="header-title-section">
            <h1 className="titulo">ViajeIA - Tu Asistente Personal de Viajes</h1>
            {userData && (
              <p className="header-user-info">👤 Hola, {userData.nombre || currentUser.email}</p>
            )}
          </div>
          <div className="header-buttons">
            <button 
              className="header-btn logout-btn"
              onClick={handleLogout}
              style={{ marginRight: '10px' }}
            >
              🚪 Cerrar Sesión
            </button>
            {!mostrarFormulario && (
              <>
              <button 
                className="header-btn"
                onClick={() => setMostrarFavoritos(!mostrarFavoritos)}
              >
                {mostrarFavoritos ? '📋 Chat' : '⭐ Favoritos'}
              </button>
              {historial.length > 0 && (
                <>
                  <button 
                    className="header-btn"
                    onClick={exportarPDF}
                  >
                    📥 Descargar PDF
                  </button>
                  <button 
                    className="header-btn"
                    onClick={guardarFavorito}
                  >
                    ⭐ Guardar Favorito
                  </button>
                </>
              )}
              </>
            )}
          </div>
        </header>

        {!mostrarFormulario && !mostrarFavoritos && (
          <section className="metricas-panel">
            <div className="metricas-card">
              <h3>👥 Usuarios únicos</h3>
              <p className="metricas-numero">{metricas.totalUsuarios}</p>
              <span className="metricas-label">Personas que han usado ViajeIA en este dispositivo</span>
            </div>
            <div className="metricas-card">
              <h3>🧭 Consultas registradas</h3>
              <p className="metricas-numero">{metricas.totalConsultas}</p>
              <span className="metricas-label">Preguntas totales realizadas</span>
            </div>
            <div className="metricas-top">
              <h4>🌍 Destinos más consultados</h4>
              {topDestinos.length === 0 ? (
                <p className="metricas-label">Aún no hay destinos suficientes</p>
              ) : (
                <ul>
                  {topDestinos.map(([destino, total]) => (
                    <li key={destino}>
                      <span>{destino.toUpperCase()}</span>
                      <strong>{total} consultas</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="metricas-top">
              <h4>📅 Consultas por día</h4>
              {consultasPorDiaOrdenadas.length === 0 ? (
                <p className="metricas-label">Aún no hay datos diarios</p>
              ) : (
                <ul>
                  {consultasPorDiaOrdenadas.map(([fecha, total]) => (
                    <li key={fecha}>
                      <span>{new Date(fecha).toLocaleDateString('es-ES')}</span>
                      <strong>{total} consultas</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        <main className="main-content">
          {mostrarFavoritos ? (
            <div className="favoritos-container">
              <h2 className="favoritos-titulo">⭐ Mis Viajes Guardados</h2>
              {favoritos.length === 0 ? (
                <p className="favoritos-vacio">No tienes viajes guardados todavía. ¡Guarda tu primer destino!</p>
              ) : (
                <div className="favoritos-grid">
                  {favoritos.map((favorito) => (
                    <div key={favorito.id} className="favorito-card">
                      <div className="favorito-header">
                        <h3 className="favorito-destino">✈️ {favorito.destino}</h3>
                        <button 
                          className="favorito-eliminar"
                          onClick={() => eliminarFavorito(favorito.id)}
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="favorito-info">
                        <p><strong>Fecha:</strong> {new Date(favorito.fecha).toLocaleDateString('es-ES')}</p>
                        <p><strong>Presupuesto:</strong> {favorito.presupuesto}</p>
                        <p><strong>Preferencia:</strong> {favorito.preferencia}</p>
                        <p><strong>Guardado:</strong> {favorito.fechaGuardado}</p>
                        <p><strong>Conversaciones:</strong> {favorito.historial?.length || 0}</p>
                      </div>
                      <button 
                        className="favorito-cargar"
                        onClick={() => cargarFavorito(favorito)}
                      >
                        Cargar este viaje
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : mostrarFormulario ? (
            <form onSubmit={handleFormularioSubmit} className="formulario-encuesta">
              <h2 className="encuesta-titulo">🗺️ Cuéntanos sobre tu viaje</h2>
              <p className="encuesta-subtitulo">Completa este formulario rápido para personalizar tu experiencia</p>
              
              <div className="campo-encuesta">
                <label htmlFor="destino" className="label-encuesta">
                  ✈️ ¿A dónde quieres viajar?
                </label>
                <input
                  type="text"
                  id="destino"
                  name="destino"
                  className="input-encuesta"
                  placeholder="Ej: París, Tokio, Cancún..."
                  value={datosViaje.destino}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="campo-encuesta">
                <label htmlFor="fecha" className="label-encuesta">
                  📅 ¿Cuándo?
                </label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  className="input-encuesta"
                  value={datosViaje.fecha}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="campo-encuesta">
                <label htmlFor="presupuesto" className="label-encuesta">
                  💰 ¿Cuál es tu presupuesto aproximado?
                </label>
                <select
                  id="presupuesto"
                  name="presupuesto"
                  className="input-encuesta"
                  value={datosViaje.presupuesto}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona un rango</option>
                  <option value="economico">Económico (menos de $500)</option>
                  <option value="medio">Medio ($500 - $1,500)</option>
                  <option value="alto">Alto ($1,500 - $3,000)</option>
                  <option value="premium">Premium (más de $3,000)</option>
                </select>
              </div>

              <div className="campo-encuesta">
                <label htmlFor="preferencia" className="label-encuesta">
                  🎯 ¿Prefieres aventura, relajación o cultura?
                </label>
                <div className="opciones-preferencia">
                  <label className="opcion-preferencia">
                    <input
                      type="radio"
                      name="preferencia"
                      value="aventura"
                      checked={datosViaje.preferencia === 'aventura'}
                      onChange={handleInputChange}
                      required
                    />
                    <span>🏔️ Aventura</span>
                  </label>
                  <label className="opcion-preferencia">
                    <input
                      type="radio"
                      name="preferencia"
                      value="relajacion"
                      checked={datosViaje.preferencia === 'relajacion'}
                      onChange={handleInputChange}
                      required
                    />
                    <span>🏖️ Relajación</span>
                  </label>
                  <label className="opcion-preferencia">
                    <input
                      type="radio"
                      name="preferencia"
                      value="cultura"
                      checked={datosViaje.preferencia === 'cultura'}
                      onChange={handleInputChange}
                      required
                    />
                    <span>🏛️ Cultura</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="boton-encuesta"
              >
                Comenzar Planificación 🚀
              </button>
            </form>
          ) : (
            <>
              <div className="resumen-viaje">
                <h3 className="resumen-titulo">📋 Tu viaje</h3>
                <div className="resumen-datos">
                  <span><strong>Destino:</strong> {datosViaje.destino}</span>
                  <span><strong>Fecha:</strong> {new Date(datosViaje.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span><strong>Presupuesto:</strong> {datosViaje.presupuesto}</span>
                  <span><strong>Preferencia:</strong> {datosViaje.preferencia}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="formulario">
                <div className="input-group">
                  <textarea
                    className="input-text"
                    placeholder="Escribe tu pregunta sobre tu viaje aquí..."
                    value={pregunta}
                    onChange={(e) => setPregunta(e.target.value)}
                    rows="4"
                    disabled={cargando}
                  />
                </div>
                <button 
                  type="submit" 
                  className="boton-planificar"
                  disabled={cargando || !pregunta.trim()}
                >
                  {cargando ? 'Planificando...' : 'Planificar mi viaje'}
                </button>
              </form>

              {historial.length > 0 && (
                <div className="historial-container">
                  <h3 className="historial-titulo">💬 Historial de Conversaciones</h3>
                  <div className="historial-lista">
                    {historial.map((entrada) => (
                      <div key={entrada.id} className="historial-item">
                        <div className="historial-pregunta">
                          <strong>❓ {entrada.pregunta}</strong>
                          <span className="historial-fecha">{entrada.fecha}</span>
                        </div>
                        <div className="historial-respuesta">
                          {entrada.respuesta.substring(0, 150)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {respuesta && (
                <>
                  <div className="respuesta-container">
                    <h2 className="respuesta-titulo">Respuesta:</h2>
                    <div className="respuesta-contenido">
                      {respuesta}
                    </div>
                  </div>
                  
                  {fotos && fotos.length > 0 && (
                    <div className="fotos-container">
                      <h3 className="fotos-titulo">📸 Fotos de {datosViaje.destino || 'tu destino'}</h3>
                      <div className="fotos-grid">
                        {fotos.map((foto, index) => (
                          <div key={index} className="foto-item">
                            <img 
                              src={foto.url} 
                              alt={foto.descripcion || `Foto ${index + 1} de ${datosViaje.destino || 'destino'}`}
                              className="foto-imagen"
                              loading="lazy"
                              onClick={() => window.open(foto.url_grande, '_blank')}
                            />
                            <p className="foto-autor">Foto por {foto.autor}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>

        {!mostrarFormulario && (
          <section className="pro-banner">
            <div className="pro-content">
              <h2>🚀 Próximamente: ViajeIA Pro</h2>
              <p>Estamos construyendo una experiencia premium para viajeros que quieren ir más lejos.</p>
              <ul>
                <li>🗓️ Itinerarios día por día hiper detallados</li>
                <li>🏨 Reservas directas de hoteles y experiencias</li>
                <li>✈️ Alertas inteligentes de precios de vuelos</li>
                <li>♾️ Consultas ilimitadas con Alex en cualquier idioma</li>
              </ul>
              <button className="pro-cta" onClick={() => alert('Muy pronto podrás unirte a ViajeIA Pro. ¡Estate atent@!')}>
                Quiero ser de los primeros
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default App