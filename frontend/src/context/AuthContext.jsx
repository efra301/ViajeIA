import { createContext, useContext, useState, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { ref, set, get } from 'firebase/database'
import { auth, database } from '../firebase/config'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState(null)

  // Función para registrar un nuevo usuario
  async function register(nombre, email, password) {
    try {
      setError(null)
      // 1. Crear usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // 2. Guardar información adicional en Realtime Database
      await set(ref(database, `users/${user.uid}`), {
        nombre: nombre,
        email: email,
        fechaRegistro: new Date().toISOString(),
        uid: user.uid
      })

      return { success: true, user }
    } catch (error) {
      console.error('Error en registro:', error)
      const errorMessage = error.message || 'Error al registrar usuario'
      setError(errorMessage)
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  // Función para iniciar sesión
  async function login(email, password) {
    try {
      setError(null)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: userCredential.user }
    } catch (error) {
      console.error('Error en login:', error)
      let errorMessage = 'Error al iniciar sesión'
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No existe un usuario con este correo'
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Correo electrónico no válido'
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Error de conexión. Verifica tu internet.'
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Función para cerrar sesión
  async function logout() {
    try {
      setError(null)
      await signOut(auth)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      setError(error.message || 'Error al cerrar sesión')
      throw error
    }
  }

  // Función para guardar una consulta en Firebase
  async function guardarConsulta(datosConsulta) {
    if (!currentUser) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    try {
      const consultaId = Date.now().toString()
      const consultaData = {
        ...datosConsulta,
        usuarioEmail: currentUser.email,
        usuarioId: currentUser.uid,
        fechaConsulta: new Date().toISOString(),
        id: consultaId
      }

      // Guardar en: /consultas/{userId}/{consultaId}
      await set(ref(database, `consultas/${currentUser.uid}/${consultaId}`), consultaData)
      
      return { success: true, consultaId }
    } catch (error) {
      console.error('Error al guardar consulta:', error)
      return { success: false, error: error.message }
    }
  }

  // Función para cargar datos del usuario desde la base de datos
  async function cargarDatosUsuario(uid) {
    try {
      const snapshot = await get(ref(database, `users/${uid}`))
      if (snapshot.exists()) {
        setUserData(snapshot.val())
        return snapshot.val()
      }
      return null
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error)
      return null
    }
  }

  // Observar cambios en el estado de autenticación
  useEffect(() => {
    let mounted = true
    let timeoutId = null

    console.log('🔍 AuthContext: Inicializando Firebase Auth...')

    // Timeout de seguridad: si después de 10 segundos no hay respuesta, dejar de cargar
    timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.warn('⚠️ Timeout: Firebase no respondió en 10 segundos')
        setLoading(false)
      }
    }, 10000)

    try {
      const unsubscribe = onAuthStateChanged(
        auth, 
        async (user) => {
          console.log('🔍 AuthStateChanged:', user ? `Usuario: ${user.email}` : 'Sin usuario')
          
          if (!mounted) {
            console.log('🔍 Componente desmontado, ignorando actualización')
            return
          }

          clearTimeout(timeoutId)
          
          try {
            setCurrentUser(user)
            console.log('🔍 CurrentUser actualizado:', user ? 'Sí' : 'No')
            
            if (user) {
              console.log('🔍 Cargando datos del usuario...')
              // Cargar datos del usuario desde Realtime Database
              await cargarDatosUsuario(user.uid)
              console.log('🔍 Datos del usuario cargados')
            } else {
              setUserData(null)
              console.log('🔍 No hay usuario, limpiando datos')
            }
          } catch (err) {
            console.error('❌ Error en onAuthStateChanged:', err)
            setError(err.message || 'Error al verificar autenticación')
          } finally {
            if (mounted) {
              console.log('🔍 Finalizando carga...')
              setLoading(false)
              console.log('✅ AuthContext inicializado')
            }
          }
        }
      )

      return () => {
        console.log('🔍 Limpiando AuthContext...')
        mounted = false
        clearTimeout(timeoutId)
        unsubscribe()
      }
    } catch (error) {
      console.error('❌ Error al inicializar Firebase Auth:', error)
      if (mounted) {
        setError(error.message || 'Error al inicializar autenticación')
        setLoading(false)
      }
    }
  }, [])

  const value = {
    currentUser,
    userData,
    loading,
    error,
    register,
    login,
    logout,
    guardarConsulta
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}