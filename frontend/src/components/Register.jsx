import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { validateEmail, validatePassword, validateNombre } from '../utils/validation'
import './Auth.css'

function Register({ onSwitchToLogin }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false)
  const { register } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // 🔒 VALIDACIÓN DE SEGURIDAD: Validar nombre
    const nombreValidation = validateNombre(nombre)
    if (!nombreValidation.isValid) {
      setError(nombreValidation.error)
      return
    }

    // 🔒 VALIDACIÓN DE SEGURIDAD: Validar email
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setError(emailValidation.error)
      return
    }

    // 🔒 VALIDACIÓN DE SEGURIDAD: Validar contraseña
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error)
      return
    }

    // 🔒 VALIDACIÓN DE SEGURIDAD: Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    // 🔒 PRIVACIDAD: Verificar que acepte la política de privacidad
    if (!aceptaPrivacidad) {
      setError('Debes aceptar la política de privacidad para registrarte')
      return
    }

    setLoading(true)

    try {
      const result = await register(nombre, email, password)
      
      if (result.success) {
        // El usuario se registró correctamente
        // El AuthContext automáticamente actualizará currentUser
        alert(`¡Bienvenido a ViajeIA, ${nombre}! 🎉`)
      } else {
        setError(result.error || 'Error al registrar usuario')
      }
    } catch (error) {
      setError('Error inesperado. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">✨ Crear Cuenta en ViajeIA</h2>
        <p className="auth-subtitle">Únete a miles de viajeros que planifican sus aventuras</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="nombre">👤 Nombre completo</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: María González"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email">📧 Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">🔒 Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword">🔒 Confirmar contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
              required
              minLength={6}
            />
          </div>

          {/* 🔒 PRIVACIDAD: Checkbox para aceptar política de privacidad */}
          <div className="auth-field" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="privacidad"
              checked={aceptaPrivacidad}
              onChange={(e) => setAceptaPrivacidad(e.target.checked)}
              required
            />
            <label htmlFor="privacidad" style={{ fontSize: '12px', cursor: 'pointer' }}>
              Acepto la{' '}
              <button
                type="button"
                onClick={() => window.open('/privacidad', '_blank')}
                className="auth-link"
                style={{ padding: 0, background: 'none', border: 'none', textDecoration: 'underline' }}
              >
                política de privacidad
              </button>
            </label>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta 🚀'}
          </button>
        </form>

        <div className="auth-switch">
          <p>¿Ya tienes una cuenta? <button onClick={onSwitchToLogin} className="auth-link">Inicia sesión</button></p>
        </div>
      </div>
    </div>
  )
}

export default Register