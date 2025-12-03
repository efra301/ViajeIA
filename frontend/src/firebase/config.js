import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

// ⚠️ IMPORTANTE: Reemplaza estos valores con los de tu proyecto Firebase
// Los obtienes del paso 1.4 de la guía anterior
const firebaseConfig = {
  apiKey: "AIzaSyBxjnY_gIq_xLcpexfYljf2IbhkuXItado",
  authDomain: "viajeia-363a9.firebaseapp.com",
  databaseURL: "https://viajeia-363a9-default-rtdb.firebaseio.com",
  projectId: "viajeia-363a9",
  storageBucket: "viajeia-363a9.firebasestorage.app",
  messagingSenderId: "277458123960",
  appId: "1:277458123960:web:4719ab9be3e2993f88084d"
}

// Inicializar Firebase
let app
try {
  app = initializeApp(firebaseConfig)
  console.log('✅ Firebase inicializado correctamente')
} catch (error) {
  console.error('❌ Error al inicializar Firebase:', error)
  throw error
}

// Exportar servicios que usaremos
export const auth = getAuth(app)
export const database = getDatabase(app)
export default app