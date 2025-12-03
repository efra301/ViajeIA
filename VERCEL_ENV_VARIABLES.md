# 🔧 Configurar Variables de Entorno en Vercel - Paso a Paso

## ⚠️ IMPORTANTE: Esto es en VERCEL, NO en GitHub

**Vercel es un sitio diferente a GitHub.** Necesitas ir a **vercel.com**, no a github.com.

## 📍 Paso 1: Acceder a Vercel

1. **Abre una nueva pestaña** en tu navegador
2. **Ve a**: **https://vercel.com** (NO github.com)
3. **Inicia sesión** con tu cuenta:
   - Si conectaste con GitHub, haz clic en "Continue with GitHub"
   - O usa email/contraseña si creaste cuenta directa
4. Una vez dentro, verás el **Dashboard de Vercel** (es diferente al de GitHub)
5. En el Dashboard, verás una lista de tus proyectos desplegados
6. **Haz clic** en el proyecto "viajeia" (o el nombre que le hayas puesto)

## 📍 Paso 2: Navegar a Settings (Configuración)

1. **Estás ahora en la página de tu proyecto en Vercel** (no en GitHub)
2. En la parte superior de la página, verás varias pestañas:
   - **Overview** (Vista general) - muestra estadísticas
   - **Deployments** (Despliegues) - lista de deployments
   - **Analytics** (Analíticas) - métricas
   - **Settings** ⚙️ ← **Haz clic aquí** (es un ícono de engranaje)
3. **Haz clic en "Settings"** o en el ícono ⚙️

## 📍 Paso 3: Encontrar Environment Variables

1. En el menú lateral izquierdo de **Settings**, verás varias opciones:
   - General
   - **Environment Variables** ← **Haz clic aquí**
   - Git
   - Domains
   - Functions
   - etc.

2. **Haz clic en "Environment Variables"**

## 📍 Paso 4: Agregar Variable de Entorno

1. Verás una sección que dice **"Environment Variables"** con una tabla
2. Verás tres campos:
   - **Key** (Clave): Nombre de la variable
   - **Value** (Valor): El valor de la variable
   - **Environment** (Entorno): Dónde aplica (Production, Preview, Development)

3. **Para agregar la URL del backend:**
   - En el campo **Key**, escribe: `VITE_API_URL`
   - En el campo **Value**, escribe: `https://viajeia-backend-c83j.onrender.com`
   - En **Environment**, selecciona:
     - ✅ **Production** (para producción)
     - ✅ **Preview** (para preview deployments)
     - ✅ **Development** (opcional, para desarrollo local)

4. **Haz clic en "Save"** (Guardar)

## 📍 Paso 5: Verificar que se Guardó

1. Deberías ver la variable en la tabla:
   ```
   Key: VITE_API_URL
   Value: https://viajeia-backend-c83j.onrender.com
   Environment: Production, Preview
   ```

2. Si necesitas editarla, haz clic en los **tres puntos** (⋯) a la derecha y selecciona "Edit"

## 📍 Paso 6: Redesplegar (Importante)

**IMPORTANTE**: Después de agregar variables de entorno, necesitas redesplegar:

1. Ve a la pestaña **"Deployments"** (arriba)
2. Encuentra el último deployment
3. Haz clic en los **tres puntos** (⋯) a la derecha
4. Selecciona **"Redeploy"**
5. Confirma el redeploy

**O simplemente:**
- Haz un pequeño cambio en tu código
- Haz commit y push
- Vercel desplegará automáticamente con las nuevas variables

## 🎯 Variables que Necesitas Agregar

Para ViajeIA, solo necesitas **UNA** variable de entorno en el frontend:

```
VITE_API_URL = https://viajeia-backend-c83j.onrender.com
```

**Nota**: Las variables que empiezan con `VITE_` son las que Vite expone al frontend.

## 🔍 Ubicación Visual

```
1. https://vercel.com (NO github.com)
   └── Dashboard de Vercel
       └── Tu Proyecto (viajeia)
           └── Settings ⚙️ (pestaña superior)
               └── Environment Variables (menú lateral izquierdo)
                   └── [Agregar nueva variable aquí]
```

## 🆚 Diferencia: GitHub vs Vercel

**GitHub (github.com):**
- Donde guardas tu código
- Settings → Secrets and variables (para GitHub Actions)
- ❌ NO es donde configuras variables de Vercel

**Vercel (vercel.com):**
- Donde está desplegado tu frontend
- Settings → Environment Variables (para tu app)
- ✅ SÍ, aquí es donde configuras las variables

## ⚠️ Notas Importantes

1. **Las variables de entorno del backend** (GEMINI_API_KEY, etc.) van en **Render**, NO en Vercel
2. **Vercel solo necesita** la URL del backend (`VITE_API_URL`)
3. **Después de agregar variables**, siempre redeploya para que surtan efecto
4. **Las variables son sensibles**: No las compartas públicamente

## 🧪 Verificar que Funciona

1. Después del redeploy, abre tu app en Vercel
2. Abre la consola del navegador (F12)
3. Deberías ver que las peticiones van a: `https://viajeia-backend-c83j.onrender.com/api/planificar`

## 📸 Ruta Completa (Texto)

1. **Abre nueva pestaña** → **https://vercel.com** (NO github.com)
2. **Inicia sesión** (con GitHub o email)
3. **Dashboard de Vercel** → Verás tus proyectos
4. **Clic en tu proyecto** "viajeia"
5. **Settings** (pestaña superior, ícono ⚙️)
6. **Environment Variables** (menú lateral izquierdo)
7. **"Add New"** o botón para agregar variable
8. **Completar campos** → **Save**
9. **Deployments** → **Redeploy** (importante!)

## ❓ ¿No tienes cuenta en Vercel todavía?

Si no has desplegado en Vercel aún:

1. Ve a: **https://vercel.com/signup**
2. Haz clic en **"Continue with GitHub"**
3. Autoriza Vercel a acceder a tus repositorios
4. Luego sigue los pasos del archivo `DEPLOY.md` para desplegar tu proyecto
5. Una vez desplegado, podrás configurar las variables de entorno

