import { useAuth } from '../context/AuthContext'
import Login from './Login'
import Register from './Register'
import { useState } from 'react'

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth()
  const [mostrarAuth, setMostrarAuth] = useState('login')

  // Si no hay usuario autenticado, mostrar login/register
  if (!currentUser) {
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

  // Si hay usuario autenticado, mostrar el contenido protegido
  return children
}

export default ProtectedRoute