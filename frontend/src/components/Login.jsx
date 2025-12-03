import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { validateEmail, validatePassword } from '../utils/validation'
import './Auth.css'

function Login({ onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // 🔒 VALIDACIÓN DE SEGURIDAD: Validar email antes de enviar
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setError(emailValidation.error)
      return
    }

    // 🔒 VALIDACIÓN DE SEGURIDAD: Validar contraseña antes de enviar
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error)
      return
    }

    setLoading(true)

    try {
      const result = await login(email, password)
      
      if (!result.success) {
        setError(result.error || 'Error al iniciar sesión')
      }
      // Si es exitoso, el AuthContext actualizará currentUser y App.jsx redirigirá
    } catch (error) {
      setError('Error inesperado. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">🌍 Bienvenido a ViajeIA</h2>
        <p className="auth-subtitle">Tu asistente personal de viajes te espera</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión ✈️'}
          </button>
        </form>

        <div className="auth-switch">
          <p>¿No tienes cuenta? <button onClick={onSwitchToRegister} className="auth-link">Regístrate aquí</button></p>
        </div>
      </div>
    </div>
  )
}

export default Login