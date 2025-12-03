# 🚀 Guía de Despliegue - ViajeIA con Firebase

## 📋 Checklist Pre-Despliegue

Antes de desplegar, asegúrate de tener:

- [ ] Proyecto Firebase creado y configurado
- [ ] Authentication habilitado (Email/Password)
- [ ] Realtime Database creada y configurada
- [ ] Reglas de seguridad configuradas en Firebase
- [ ] Credenciales de Firebase copiadas
- [ ] API Keys del backend (Gemini, OpenWeather, Unsplash)
- [ ] Cuenta en Vercel (para frontend)
- [ ] Cuenta en Render/Railway (para backend)
- [ ] Repositorio en GitHub

---

## 🔥 PASO 1: Configurar Firebase para Producción

### 1.1 Verificar Configuración de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto `viajeia-363a9`
3. Verifica que esté activo:
   - ✅ **Authentication** → Método Email/Password habilitado
   - ✅ **Realtime Database** → Creada y funcionando

### 1.2 Configurar Reglas de Seguridad

1. Ve a **Realtime Database** → **Reglas**
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

### 1.3 Obtener Credenciales de Firebase

1. Ve a **Configuración del proyecto** (⚙️)
2. Baja hasta **"Tus aplicaciones"**
3. Haz clic en tu app web (`</>`)
4. Copia el objeto de configuración:

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

**⚠️ IMPORTANTE**: Estas credenciales son públicas y seguras. Firebase las protege con reglas de seguridad.

---

## 🌐 PASO 2: Desplegar Frontend en Vercel

### 2.1 Preparar el Frontend

1. **Asegúrate de que `firebase/config.js` tenga las credenciales correctas:**

```javascript
// frontend/src/firebase/config.js
const firebaseConfig = {
  apiKey: "TU_API_KEY_REAL",  // ← Reemplaza con tus credenciales
  authDomain: "viajeia-363a9.firebaseapp.com",
  databaseURL: "https://viajeia-363a9-default-rtdb.firebaseio.com",
  projectId: "viajeia-363a9",
  storageBucket: "viajeia-363a9.firebasestorage.app",
  messagingSenderId: "277458123960",
  appId: "1:277458123960:web:4719ab9be3e2993f88084d"
}
```

2. **Verifica que el build funcione localmente:**

```bash
cd frontend
npm install
npm run build
```

Si el build es exitoso, estás listo.

### 2.2 Subir a GitHub

```bash
# Desde la raíz del proyecto
git add .
git commit -m "Preparar para deploy con Firebase"
git push origin main
```

### 2.3 Desplegar en Vercel

#### Opción A: Desde la Web (Recomendado)

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **"Add New..."** → **"Project"**
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `ViajeIA`
5. **Configuración del proyecto:**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` ⚠️ IMPORTANTE
   - **Build Command**: `npm run build` (automático)
   - **Output Directory**: `dist` (automático)
   - **Install Command**: `npm install` (automático)
6. Haz clic en **"Deploy"**
7. Espera 1-2 minutos
8. **Copia la URL** que te da Vercel (ej: `https://viajeia.vercel.app`)

#### Opción B: Desde CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel
# Sigue las instrucciones
```

### 2.4 Configurar Variables de Entorno en Vercel

1. En Vercel, ve a tu proyecto
2. **Settings** → **Environment Variables**
3. Agrega:

```
Key: VITE_API_URL
Value: https://tu-backend-url.onrender.com
Environment: ✅ Production, ✅ Preview
```

4. Haz clic en **"Save"**
5. **IMPORTANTE**: Ve a **Deployments** → Haz clic en los 3 puntos del último deployment → **"Redeploy"**

---

## 🐍 PASO 3: Desplegar Backend en Render

### 3.1 Preparar el Backend

1. **Verifica que `requirements.txt` esté actualizado:**

```txt
Flask==3.0.0
flask-cors==4.0.0
google-generativeai>=0.3.0
python-dotenv==1.0.0
requests==2.31.0
```

2. **Crea un archivo `Procfile` en la carpeta `backend`:**

```txt
web: python app.py
```

### 3.2 Crear Cuenta en Render

1. Ve a [render.com](https://render.com)
2. Regístrate con GitHub (más fácil)
3. Conecta tu cuenta de GitHub

### 3.3 Crear Web Service

1. En Render, haz clic en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Selecciona el repositorio `ViajeIA`
4. **Configuración:**
   - **Name**: `viajeia-backend`
   - **Environment**: `Python 3`
   - **Root Directory**: `backend` ⚠️ IMPORTANTE
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Plan**: `Free` (o el que prefieras)

### 3.4 Configurar Variables de Entorno en Render

En la sección **"Environment"**, agrega estas variables:

```
GEMINI_API_KEY=tu-api-key-de-gemini
OPENWEATHER_API_KEY=tu-api-key-de-openweather
UNSPLASH_API_KEY=tu-api-key-de-unsplash
PORT=5001
FLASK_ENV=production
CORS_ORIGINS=https://tu-app.vercel.app,https://*.vercel.app
```

**⚠️ IMPORTANTE**: 
- Reemplaza `tu-app.vercel.app` con tu URL real de Vercel
- Nunca compartas estas claves públicamente

### 3.5 Desplegar

1. Haz clic en **"Create Web Service"**
2. Espera 5-10 minutos para el primer despliegue
3. **Copia la URL** que te da Render (ej: `https://viajeia-backend.onrender.com`)

---

## 🔗 PASO 4: Conectar Frontend con Backend

### 4.1 Actualizar Variable de Entorno en Vercel

1. Ve a Vercel → Tu proyecto → **Settings** → **Environment Variables**
2. Edita `VITE_API_URL`:
   - **Value**: `https://viajeia-backend.onrender.com` (tu URL de Render)
3. Guarda
4. **Redeploy**: Ve a **Deployments** → **Redeploy**

### 4.2 Actualizar CORS en Backend

1. En Render, ve a tu servicio → **Environment**
2. Verifica que `CORS_ORIGINS` tenga tu URL de Vercel:
   ```
   CORS_ORIGINS=https://tu-app.vercel.app,https://*.vercel.app
   ```
3. Si lo cambiaste, Render redeployará automáticamente

---

## ✅ PASO 5: Verificar que Todo Funcione

### 5.1 Verificar Backend

1. Abre en el navegador: `https://viajeia-backend.onrender.com/api/health`
2. Deberías ver: `{"status": "ok", "message": "Backend funcionando correctamente"}`

### 5.2 Verificar Frontend

1. Abre tu URL de Vercel: `https://tu-app.vercel.app`
2. Deberías ver la pantalla de Login
3. Prueba:
   - ✅ Registrarte con un nuevo usuario
   - ✅ Iniciar sesión
   - ✅ Completar el formulario de viaje
   - ✅ Hacer una consulta al asistente
   - ✅ Verificar en Firebase Console que se guardaron los datos

### 5.3 Verificar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. **Authentication** → Deberías ver usuarios registrados
3. **Realtime Database** → Deberías ver:
   ```
   users/
     └── [userId]/
         ├── nombre: "..."
         ├── email: "..."
         └── ...
   consultas/
     └── [userId]/
         └── [consultaId]/
             └── ...
   ```

---

## 🔧 Solución de Problemas Comunes

### Error: "Firebase App already initialized"

**Solución**: Verifica que `firebase/config.js` solo inicialice Firebase una vez.

### Error: "Permission denied" en Firebase

**Solución**: 
1. Verifica las reglas de Realtime Database
2. Asegúrate de que el usuario esté autenticado
3. Verifica que las reglas permitan lectura/escritura para el usuario actual

### Error: CORS en producción

**Solución**:
1. Verifica `CORS_ORIGINS` en Render
2. Asegúrate de incluir tu URL de Vercel
3. Incluye también `https://*.vercel.app` para preview deployments

### Backend no responde

**Solución**:
1. Verifica los logs en Render (Dashboard → tu servicio → Logs)
2. Verifica que todas las variables de entorno estén configuradas
3. Verifica que el puerto sea correcto (Render usa la variable PORT automáticamente)

### Frontend no carga

**Solución**:
1. Verifica que el build sea exitoso en Vercel
2. Revisa la consola del navegador (F12)
3. Verifica que `VITE_API_URL` esté configurada en Vercel
4. Haz un redeploy

### Usuario se registra pero no se guarda en Firebase

**Solución**:
1. Abre la consola del navegador (F12)
2. Revisa si hay errores
3. Verifica las reglas de Realtime Database
4. Verifica que las credenciales de Firebase sean correctas

---

## 📝 Resumen de URLs y Configuración

### URLs de Producción

- **Frontend**: `https://tu-app.vercel.app`
- **Backend**: `https://viajeia-backend.onrender.com`
- **Firebase Console**: `https://console.firebase.google.com`

### Variables de Entorno - Frontend (Vercel)

```
VITE_API_URL=https://viajeia-backend.onrender.com
```

### Variables de Entorno - Backend (Render)

```
GEMINI_API_KEY=tu-api-key
OPENWEATHER_API_KEY=tu-api-key
UNSPLASH_API_KEY=tu-api-key
PORT=5001
FLASK_ENV=production
CORS_ORIGINS=https://tu-app.vercel.app,https://*.vercel.app
```

### Credenciales Firebase (en código frontend)

```javascript
// frontend/src/firebase/config.js
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

---

## 🎉 ¡Listo!

Tu aplicación debería estar funcionando en producción con:
- ✅ Autenticación con Firebase
- ✅ Almacenamiento de datos en Realtime Database
- ✅ Frontend desplegado en Vercel
- ✅ Backend desplegado en Render
- ✅ Todo conectado y funcionando

---

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Render](https://render.com/docs)
- [Documentación de Firebase](https://firebase.google.com/docs)
- [Guía de CORS](https://developer.mozilla.org/es/docs/Web/HTTP/CORS)

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios:

1. **Frontend**: 
   ```bash
   git add .
   git commit -m "Actualización"
   git push
   # Vercel desplegará automáticamente
   ```

2. **Backend**:
   ```bash
   git add .
   git commit -m "Actualización backend"
   git push
   # Render desplegará automáticamente
   ```

3. **Verifica** que todo funcione después de cada actualización.

