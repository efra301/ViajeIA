# 🚀 Guía de Despliegue - ViajeIA

## Despliegue en Vercel (Frontend) - GRATIS

### Paso 1: Preparar el Frontend

1. **Asegúrate de que el código esté listo:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   Si el build funciona correctamente, estás listo.

### Paso 2: Crear cuenta en Vercel

1. Ve a: **https://vercel.com**
2. Haz clic en **"Sign Up"**
3. Elige una opción:
   - **Recomendado**: Conectar con GitHub (más fácil)
   - O crear cuenta con email

### Paso 3: Subir el proyecto a GitHub (si no lo tienes)

**Si ya tienes el proyecto en GitHub, salta al Paso 4.**

1. **Inicializar Git (si no lo has hecho):**
   ```bash
   cd /ruta/a/ViajeIA
   git init
   git add .
   git commit -m "Initial commit - ViajeIA"
   ```

2. **Crear repositorio en GitHub:**
   - Ve a: **https://github.com/new**
   - Crea un nuevo repositorio (ej: "viajeia")
   - **NO** inicialices con README, .gitignore o licencia

3. **Conectar y subir:**
   ```bash
   git remote add origin https://github.com/TU_USUARIO/viajeia.git
   git branch -M main
   git push -u origin main
   ```

### Paso 4: Desplegar en Vercel

#### Opción A: Desde GitHub (Recomendado)

1. **En Vercel:**
   - Haz clic en **"Add New..."** → **"Project"**
   - Conecta tu cuenta de GitHub si no lo has hecho
   - Selecciona el repositorio "viajeia"

2. **Configurar el proyecto:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (importante!)
   - **Build Command**: `npm run build` (debería detectarse automáticamente)
   - **Output Directory**: `dist` (debería detectarse automáticamente)
   - **Install Command**: `npm install`

3. **Variables de entorno (si las necesitas):**
   - Por ahora no necesitas variables de entorno en el frontend
   - Las agregaremos después cuando configuremos el backend

4. **Desplegar:**
   - Haz clic en **"Deploy"**
   - Espera 1-2 minutos
   - ¡Tu app estará online!

#### Opción B: Desde la CLI de Vercel

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Iniciar sesión:**
   ```bash
   vercel login
   ```

3. **Desplegar:**
   ```bash
   cd frontend
   vercel
   ```
   - Sigue las instrucciones en pantalla
   - Acepta las configuraciones por defecto

### Paso 5: Configurar el Backend (Render - GRATIS)

**IMPORTANTE**: Vercel es para frontend. El backend Flask necesita otro servicio.

#### Opción A: Render (Recomendado - Gratis)

1. **Crear cuenta:**
   - Ve a: **https://render.com**
   - Regístrate con GitHub (más fácil)

2. **Crear nuevo Web Service:**
   - Haz clic en **"New +"** → **"Web Service"**
   - Conecta tu repositorio de GitHub
   - Selecciona el repositorio "viajeia"

3. **Configurar:**
   - **Name**: `viajeia-backend`
   - **Environment**: `Python 3`
   - **Root Directory**: `backend` (IMPORTANTE: selecciona la carpeta backend)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`

4. **Variables de entorno:**
   Haz clic en **"Environment"** y agrega:
   ```
   GEMINI_API_KEY=tu-api-key-aqui
   OPENWEATHER_API_KEY=tu-api-key-aqui
   UNSPLASH_API_KEY=tu-api-key-aqui
   PORT=5001
   ```

5. **Desplegar:**
   - Haz clic en **"Create Web Service"**
   - Espera 5-10 minutos para el primer despliegue
   - Copia la URL que te da (ej: `https://viajeia-backend.onrender.com`)

#### Opción B: Railway (Alternativa)

1. Ve a: **https://railway.app**
2. Conecta con GitHub
3. Crea nuevo proyecto desde repositorio
4. Configura como servicio Python
5. Agrega las variables de entorno
6. Deploy automático

### Paso 6: Conectar Frontend con Backend

1. **Obtén la URL de tu backend:**
   - De Render: `https://viajeia-backend.onrender.com`
   - O de Railway: `https://tu-app.railway.app`

2. **Actualiza el frontend - Configurar Variables de Entorno en Vercel:**
   
   **Paso a paso:**
   1. Ve a **https://vercel.com** e inicia sesión
   2. En el Dashboard, haz clic en tu proyecto "viajeia"
   3. Haz clic en la pestaña **"Settings"** (arriba)
   4. En el menú lateral izquierdo, haz clic en **"Environment Variables"**
   5. Haz clic en **"Add New"** o en el botón para agregar variable
   6. Completa los campos:
      - **Key**: `VITE_API_URL`
      - **Value**: `https://viajeia-backend-c83j.onrender.com` (tu URL de Render)
      - **Environment**: Selecciona ✅ Production y ✅ Preview
   7. Haz clic en **"Save"**
   8. **IMPORTANTE**: Ve a **"Deployments"** y haz clic en **"Redeploy"** en el último deployment
   
   📖 **Guía detallada**: Ver `VERCEL_ENV_VARIABLES.md` para instrucciones paso a paso con más detalles

3. **Actualiza el código del frontend:**
   
   Edita `frontend/src/App.jsx` y cambia:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
   
   // Luego en el fetch:
   const response = await fetch(`${API_URL}/api/planificar`, {
   ```

4. **Redeploy en Vercel:**
   - Haz un nuevo commit y push
   - Vercel desplegará automáticamente

### Paso 7: Configurar CORS en el Backend

Asegúrate de que tu backend permita peticiones desde tu dominio de Vercel:

En `backend/app.py`, actualiza:
```python
CORS(app, resources={r"/api/*": {
    "origins": [
        "http://localhost:5173",
        "https://tu-app.vercel.app",  # Tu URL de Vercel
        "https://*.vercel.app"  # Para preview deployments
    ]
}})
```

## 🎉 ¡Listo!

Tu aplicación estará disponible en:
- **Frontend**: `https://tu-app.vercel.app`
- **Backend**: `https://viajeia-backend.onrender.com`

## 📝 Notas Importantes

1. **Plan Gratuito de Render:**
   - El servicio se "duerme" después de 15 minutos de inactividad
   - La primera petición después de dormir puede tardar 30-60 segundos
   - Para evitar esto, considera el plan pago ($7/mes)

2. **Dominio Personalizado:**
   - En Vercel puedes agregar tu propio dominio gratis
   - Ve a Settings → Domains

3. **Actualizaciones:**
   - Cada push a GitHub despliega automáticamente
   - Vercel: instantáneo
   - Render: 5-10 minutos

## 🔧 Solución de Problemas

### Error 404 en la raíz del backend

**Es normal**: El backend está funcionando, pero Flask solo responde en rutas específicas.

**Para verificar que funciona:**
1. Prueba el endpoint de health: `https://viajeia-backend-c83j.onrender.com/api/health`
2. Deberías ver: `{"status": "ok", "message": "Backend funcionando correctamente"}`
3. La raíz ahora también responde: `https://viajeia-backend-c83j.onrender.com/`

**Si ves 404 en la raíz:**
- Haz un nuevo commit y push
- Render redeployará automáticamente
- Espera 2-3 minutos

### Error de CORS:
- Verifica que la URL del backend esté correcta
- Asegúrate de que CORS permita tu dominio de Vercel
- En Render, agrega la variable: `CORS_ORIGINS=https://tu-app.vercel.app,https://*.vercel.app`

### Backend no responde:
- Verifica que las variables de entorno estén configuradas en Render
- Revisa los logs en Render (Dashboard → tu servicio → Logs)
- Verifica que el puerto sea correcto (Render usa la variable PORT automáticamente)

### Frontend no carga:
- Verifica que el build sea exitoso en Vercel
- Revisa la consola del navegador para errores
- Verifica que `VITE_API_URL` esté configurada en Vercel

