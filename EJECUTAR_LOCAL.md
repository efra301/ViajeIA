# 🚀 Guía: Cómo Ejecutar ViajeIA Localmente

## 📋 Pre-requisitos

Antes de empezar, asegúrate de tener instalado:

- [ ] **Node.js** (versión 16 o superior) - [Descargar](https://nodejs.org/)
- [ ] **Python 3** (versión 3.8 o superior) - [Descargar](https://www.python.org/downloads/)
- [ ] **Git** (opcional, para clonar repositorios)
- [ ] **Cuenta de Firebase** configurada
- [ ] **API Keys** necesarias (Gemini, OpenWeather, Unsplash)

---

## 🔥 PASO 1: Configurar Firebase

### 1.1 Verificar Credenciales de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto `viajeia-363a9`
3. Ve a **Configuración del proyecto** (⚙️)
4. Baja hasta **"Tus aplicaciones"** → Haz clic en tu app web (`</>`)
5. Verifica que las credenciales en `frontend/src/firebase/config.js` sean correctas

### 1.2 Verificar Reglas de Realtime Database

1. En Firebase Console → **Realtime Database** → **Reglas**
2. Asegúrate de que las reglas sean:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "consultas": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

3. Haz clic en **"Publicar"**

---

## 🐍 PASO 2: Configurar y Ejecutar el Backend

### 2.1 Navegar a la carpeta backend

Abre una terminal y ejecuta:

```bash
cd "/Users/efrain/Library/Mobile Documents/com~apple~CloudDocs/EFRAIN /PERSONAL/CURSO CREACION DE APLICACIONES CON IA UNIANDES/Proyectos Cursor/Proyecto 3/ViajeIA/backend"
```

O desde la raíz del proyecto:

```bash
cd backend
```

### 2.2 Crear entorno virtual (si no existe)

```bash
python3 -m venv venv
```

Esto crea una carpeta `venv` con Python aislado para tu proyecto.

### 2.3 Activar el entorno virtual

**En Mac/Linux:**
```bash
source venv/bin/activate
```

**En Windows:**
```bash
venv\Scripts\activate
```

**✅ Verificación**: Deberías ver `(venv)` al inicio de tu línea de comandos.

### 2.4 Instalar dependencias

```bash
pip install -r requirements.txt
```

Esto instalará:
- Flask
- flask-cors
- google-generativeai
- python-dotenv
- requests

### 2.5 Crear archivo `.env`

Crea un archivo llamado `.env` en la carpeta `backend` con este contenido:

```env
# API Keys - Reemplaza con tus claves reales
GEMINI_API_KEY=tu-api-key-de-gemini-aqui
OPENWEATHER_API_KEY=tu-api-key-de-openweather-aqui
UNSPLASH_API_KEY=tu-api-key-de-unsplash-aqui

# Configuración del servidor
PORT=5001
FLASK_ENV=development

# CORS - Permite peticiones desde localhost
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**⚠️ IMPORTANTE**: 
- Reemplaza `tu-api-key-de-...` con tus claves reales
- Este archivo NO debe subirse a GitHub (está en `.gitignore`)

### 2.6 Ejecutar el backend

```bash
python app.py
```

**✅ Verificación**: Deberías ver algo como:

```
 * Running on http://0.0.0.0:5001
 * Debug mode: on
```

**⚠️ IMPORTANTE**: 
- Mantén esta terminal abierta
- El backend debe estar corriendo para que el frontend funcione
- Si ves errores, revisa que las API keys en `.env` sean correctas

### 2.7 Verificar que el backend funciona

Abre otra terminal (o pestaña) y ejecuta:

```bash
curl http://localhost:5001/api/health
```

O abre en el navegador: `http://localhost:5001/api/health`

Deberías ver: `{"status": "ok", "message": "Backend funcionando correctamente"}`

---

## ⚛️ PASO 3: Configurar y Ejecutar el Frontend

### 3.1 Abrir una nueva terminal

Abre una **nueva terminal** (deja la del backend corriendo).

### 3.2 Navegar a la carpeta frontend

```bash
cd "/Users/efrain/Library/Mobile Documents/com~apple~CloudDocs/EFRAIN /PERSONAL/CURSO CREACION DE APLICACIONES CON IA UNIANDES/Proyectos Cursor/Proyecto 3/ViajeIA/frontend"
```

O desde la raíz del proyecto:

```bash
cd frontend
```

### 3.3 Instalar dependencias

```bash
npm install
```

Esto instalará:
- React
- Firebase
- Vite
- jsPDF
- Y otras dependencias

**⏱️ Tiempo**: Puede tardar 1-2 minutos la primera vez.

### 3.4 Verificar configuración de Firebase

Abre el archivo `frontend/src/firebase/config.js` y verifica que tenga tus credenciales:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxjnY_gIq_xLcpexfYljf2IbhkuXItado",
  authDomain: "viajeia-363a9.firebaseapp.com",
  databaseURL: "https://viajeia-363a9-default-rtdb.firebaseio.com",
  projectId: "viajeia-363a9",
  storageBucket: "viajeia-363a9.firebasestorage.app",
  messagingSenderId: "277458123960",
  appId: "1:277458123960:web:4719ab9be3e2993f88084d"
}
```

### 3.5 Ejecutar el frontend

```bash
npm run dev
```

**✅ Verificación**: Deberías ver algo como:

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**⚠️ IMPORTANTE**: 
- Mantén esta terminal abierta también
- El frontend debe estar corriendo para ver la aplicación

---

## 🌐 PASO 4: Abrir la Aplicación

### 4.1 Abrir en el navegador

1. Abre tu navegador (Chrome, Firefox, Safari, etc.)
2. Ve a: `http://localhost:5173`

### 4.2 Verificar que carga correctamente

Deberías ver:
- ✅ Pantalla de carga inicial (brevemente)
- ✅ Pantalla de Login (si no estás autenticado)
- ✅ O la aplicación completa (si ya tienes sesión activa)

---

## 🧪 PASO 5: Probar la Aplicación

### 5.1 Probar Registro

1. Si ves Login, haz clic en **"Regístrate aquí"**
2. Completa el formulario:
   - Nombre: "Juan Pérez"
   - Email: "juan@test.com"
   - Contraseña: "123456" (mínimo 6 caracteres)
   - Confirmar contraseña: "123456"
3. Acepta la política de privacidad
4. Haz clic en **"Crear Cuenta 🚀"**
5. Deberías ver un mensaje de bienvenida y ser redirigido

### 5.2 Verificar en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. **Authentication** → Deberías ver el usuario recién creado
3. **Realtime Database** → **Data** → Deberías ver:
   ```
   users/
     └── [userId]/
         ├── nombre: "Juan Pérez"
         ├── email: "juan@test.com"
         └── ...
   ```

### 5.3 Probar el Asistente

1. Completa el formulario de viaje:
   - Destino: "París"
   - Fecha: Selecciona una fecha futura
   - Presupuesto: "Medio"
   - Preferencia: "Cultura"
2. Haz clic en **"Comenzar Planificación 🚀"**
3. Escribe una pregunta: "¿Qué museos debo visitar en París?"
4. Haz clic en **"Planificar mi viaje"**
5. Espera la respuesta del asistente

### 5.4 Verificar que se guardó en Firebase

1. Ve a Firebase Console → **Realtime Database** → **Data**
2. Deberías ver:
   ```
   consultas/
     └── [userId]/
         └── [consultaId]/
             ├── destino: "París"
             ├── pregunta: "..."
             ├── respuesta: "..."
             └── ...
   ```

---

## 🔍 Verificación de Consola

### Abrir Consola del Navegador

1. Presiona **F12** (o **Cmd+Option+I** en Mac)
2. Ve a la pestaña **Console**
3. Deberías ver logs como:
   - `✅ Firebase inicializado correctamente`
   - `🔍 AuthContext: Inicializando Firebase Auth...`
   - `🔍 App - Estado Auth: ...`

### Si hay errores

- **Error de Firebase**: Verifica las credenciales en `firebase/config.js`
- **Error de conexión al backend**: Verifica que el backend esté corriendo en puerto 5001
- **Error de CORS**: Verifica que `CORS_ORIGINS` en `.env` incluya `http://localhost:5173`

---

## 🛑 Detener los Servidores

### Detener Frontend

En la terminal del frontend, presiona: **Ctrl + C**

### Detener Backend

En la terminal del backend, presiona: **Ctrl + C**

### Desactivar entorno virtual (opcional)

```bash
deactivate
```

---

## 📝 Resumen de Comandos

### Terminal 1 - Backend

```bash
cd backend
source venv/bin/activate  # Mac/Linux
# o venv\Scripts\activate  # Windows
python app.py
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

### Navegador

```
http://localhost:5173
```

---

## 🔧 Solución de Problemas

### Error: "Module not found: firebase"

**Solución:**
```bash
cd frontend
npm install firebase
```

### Error: "GEMINI_API_KEY no está configurada"

**Solución:**
1. Verifica que el archivo `.env` exista en `backend/`
2. Verifica que tenga `GEMINI_API_KEY=tu-key-real`
3. Reinicia el backend (Ctrl+C y vuelve a ejecutar `python app.py`)

### Error: "Cannot connect to backend"

**Solución:**
1. Verifica que el backend esté corriendo: `http://localhost:5001/api/health`
2. Verifica que no haya errores en la terminal del backend
3. Verifica que el puerto 5001 no esté ocupado por otro programa

### Error: "Firebase Permission denied"

**Solución:**
1. Verifica las reglas de Realtime Database en Firebase Console
2. Verifica que el usuario esté autenticado
3. Revisa la consola del navegador para más detalles

### La pantalla queda en blanco

**Solución:**
1. Abre la consola del navegador (F12)
2. Revisa si hay errores en rojo
3. Verifica que Firebase esté inicializado correctamente
4. Verifica que las credenciales de Firebase sean correctas

---

## ✅ Checklist de Verificación

Antes de considerar que todo funciona:

- [ ] Backend corriendo en `http://localhost:5001`
- [ ] Frontend corriendo en `http://localhost:5173`
- [ ] Puedo ver la pantalla de Login
- [ ] Puedo registrarme con un nuevo usuario
- [ ] El usuario aparece en Firebase Authentication
- [ ] Los datos del usuario aparecen en Realtime Database
- [ ] Puedo hacer una consulta al asistente
- [ ] La consulta se guarda en Firebase
- [ ] Puedo cerrar sesión
- [ ] Puedo iniciar sesión de nuevo
- [ ] El asistente responde correctamente

---

## 🎉 ¡Listo!

Si todos los checkpoints están marcados, tu aplicación está funcionando correctamente en local.

**Próximos pasos:**
- Desarrollar nuevas funcionalidades
- Probar cambios localmente
- Cuando esté listo, hacer commit y push para desplegar automáticamente

---

## 📚 Comandos Útiles

### Ver logs del backend en tiempo real

El backend muestra logs automáticamente en la terminal. Si no ves nada, verifica que esté corriendo.

### Limpiar caché del frontend

```bash
cd frontend
rm -rf node_modules/.vite
npm run dev
```

### Reinstalar dependencias del frontend

```bash
cd frontend
rm -rf node_modules
npm install
```

### Reinstalar dependencias del backend

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

---

**💡 Tip**: Guarda esta guía como referencia rápida para cuando necesites ejecutar la aplicación localmente.

