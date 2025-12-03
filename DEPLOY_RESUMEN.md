# 🚀 Resumen Rápido - Deploy con Firebase

## ✅ Checklist Pre-Deploy

- [ ] Firebase configurado (Authentication + Realtime Database)
- [ ] Credenciales de Firebase en `frontend/src/firebase/config.js`
- [ ] Reglas de seguridad en Firebase configuradas
- [ ] Código subido a GitHub
- [ ] API Keys del backend listas (Gemini, OpenWeather, Unsplash)

---

## 📋 Pasos Rápidos

### 1️⃣ Frontend en Vercel (5 minutos)

```bash
# 1. Verificar build local
cd frontend
npm run build

# 2. Subir a GitHub
git add .
git commit -m "Deploy con Firebase"
git push

# 3. En Vercel.com:
# - New Project → Conecta GitHub
# - Root Directory: frontend
# - Framework: Vite
# - Deploy
```

**Variables de entorno en Vercel:**
```
VITE_API_URL=https://tu-backend.onrender.com
```

**⚠️ IMPORTANTE**: Después de agregar variables, haz **Redeploy**

---

### 2️⃣ Backend en Render (10 minutos)

```bash
# 1. Verificar que Procfile existe en backend/
# Debe contener: web: python app.py

# 2. En Render.com:
# - New → Web Service
# - Conecta GitHub
# - Root Directory: backend
# - Build: pip install -r requirements.txt
# - Start: python app.py
```

**Variables de entorno en Render:**
```
GEMINI_API_KEY=tu-key
OPENWEATHER_API_KEY=tu-key
UNSPLASH_API_KEY=tu-key
PORT=5001
FLASK_ENV=production
CORS_ORIGINS=https://tu-app.vercel.app,https://*.vercel.app
```

**⚠️ IMPORTANTE**: Reemplaza `tu-app.vercel.app` con tu URL real de Vercel

---

### 3️⃣ Verificar Firebase

1. **Firebase Console** → **Authentication**
   - Debe estar habilitado Email/Password

2. **Firebase Console** → **Realtime Database** → **Reglas**
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

3. **Firebase Console** → **Configuración** → **Tus aplicaciones**
   - Copia las credenciales a `frontend/src/firebase/config.js`

---

### 4️⃣ Probar en Producción

1. Abre tu URL de Vercel
2. Deberías ver Login
3. Prueba:
   - ✅ Registrarte
   - ✅ Iniciar sesión
   - ✅ Completar formulario
   - ✅ Hacer consulta
   - ✅ Verificar en Firebase que se guardaron datos

---

## 🔍 Verificación Rápida

### Backend funciona?
```
https://tu-backend.onrender.com/api/health
```
Debería responder: `{"status": "ok"}`

### Frontend funciona?
```
https://tu-app.vercel.app
```
Debería mostrar Login

### Firebase funciona?
- Firebase Console → Authentication → Ver usuarios
- Firebase Console → Realtime Database → Ver datos guardados

---

## 🐛 Problemas Comunes

| Problema | Solución |
|----------|----------|
| CORS Error | Verifica `CORS_ORIGINS` en Render incluye tu URL de Vercel |
| Firebase Permission Denied | Verifica reglas de Realtime Database |
| Backend no responde | Revisa logs en Render, verifica variables de entorno |
| Frontend no carga | Verifica build en Vercel, revisa consola del navegador |
| No se guardan datos | Verifica credenciales de Firebase, revisa consola del navegador |

---

## 📝 URLs Importantes

- **Frontend**: `https://tu-app.vercel.app`
- **Backend**: `https://tu-backend.onrender.com`
- **Firebase Console**: `https://console.firebase.google.com`

---

## 🔄 Actualizar Código

Cada cambio se despliega automáticamente:

```bash
git add .
git commit -m "Actualización"
git push
# Vercel y Render desplegarán automáticamente
```

---

**📖 Guía completa**: Ver `DEPLOY_FIREBASE.md` para detalles paso a paso

