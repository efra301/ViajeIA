# 🚀 Cómo Actualizar la Aplicación en Producción

## 📋 Resumen Rápido

Cuando haces cambios en local y quieres llevarlos a producción:

1. **Verificar que todo funciona en local** ✅
2. **Hacer commit y push a GitHub** 📤
3. **Vercel y Render desplegarán automáticamente** 🔄
4. **Verificar que funcione en producción** ✅

---

## 🔍 PASO 1: Verificar Cambios en Local

Antes de subir, asegúrate de que:

- [ ] La aplicación funciona correctamente en `http://localhost:5173`
- [ ] Puedes registrarte e iniciar sesión
- [ ] Las consultas al asistente funcionan
- [ ] Los datos se guardan en Firebase
- [ ] No hay errores en la consola del navegador

---

## 📤 PASO 2: Subir Cambios a GitHub

### 2.1 Verificar qué archivos cambiaron

```bash
# Desde la raíz del proyecto
git status
```

Esto te mostrará todos los archivos que modificaste.

### 2.2 Agregar los archivos al staging

```bash
# Agregar todos los archivos modificados
git add .

# O agregar archivos específicos
git add frontend/src/
git add backend/
```

### 2.3 Hacer commit (guardar los cambios)

```bash
git commit -m "Agregar validaciones de seguridad y mejoras"
```

**💡 Tip**: Usa mensajes descriptivos:
- `"Agregar validación de formularios"`
- `"Implementar rate limiting"`
- `"Mejorar manejo de errores"`
- `"Agregar filtros de seguridad"`

### 2.4 Subir a GitHub

```bash
git push origin main
```

O si tu rama se llama `master`:

```bash
git push origin master
```

**✅ Verificación**: Ve a tu repositorio en GitHub y verifica que los cambios estén ahí.

---

## 🔄 PASO 3: Despliegue Automático

### 3.1 Vercel (Frontend) - Automático

1. **Vercel detecta automáticamente** el push a GitHub
2. **Inicia el despliegue** automáticamente (1-2 minutos)
3. **Puedes ver el progreso** en:
   - Vercel Dashboard → Tu proyecto → Deployments
   - O en GitHub → Tu repositorio → Verás un checkmark de Vercel

**⏱️ Tiempo**: 1-2 minutos

### 3.2 Render (Backend) - Automático

1. **Render detecta automáticamente** el push a GitHub
2. **Inicia el despliegue** automáticamente (5-10 minutos)
3. **Puedes ver el progreso** en:
   - Render Dashboard → Tu servicio → Logs

**⏱️ Tiempo**: 5-10 minutos (más lento que Vercel)

---

## ✅ PASO 4: Verificar Despliegue

### 4.1 Verificar Frontend en Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en tu proyecto
3. Ve a la pestaña **"Deployments"**
4. Verifica que el último deployment tenga estado **"Ready"** ✅
5. Haz clic en el deployment para ver la URL
6. Abre la URL en el navegador

### 4.2 Verificar Backend en Render

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en tu servicio `viajeia-backend`
3. Ve a la pestaña **"Logs"**
4. Verifica que no haya errores
5. Prueba el endpoint: `https://tu-backend.onrender.com/api/health`

### 4.3 Probar la Aplicación en Producción

1. **Abre tu URL de Vercel** (ej: `https://tu-app.vercel.app`)
2. **Prueba**:
   - ✅ La aplicación carga correctamente
   - ✅ Puedes registrarte
   - ✅ Puedes iniciar sesión
   - ✅ Puedes hacer consultas al asistente
   - ✅ Los datos se guardan en Firebase

---

## 🔧 Si Algo Sale Mal

### El despliegue falla en Vercel

1. Ve a Vercel → Tu proyecto → Deployments
2. Haz clic en el deployment fallido
3. Revisa los **"Build Logs"** para ver el error
4. **Errores comunes**:
   - `npm install` falla → Verifica `package.json`
   - Build falla → Revisa errores de sintaxis en el código
   - Variables de entorno faltantes → Verifica en Settings → Environment Variables

### El despliegue falla en Render

1. Ve a Render → Tu servicio → Logs
2. Revisa los logs para ver el error
3. **Errores comunes**:
   - `pip install` falla → Verifica `requirements.txt`
   - Variables de entorno faltantes → Verifica en Environment
   - Puerto incorrecto → Verifica que `PORT` esté configurado

### La aplicación no funciona en producción

1. **Abre la consola del navegador** (F12)
2. **Revisa errores** en la pestaña Console
3. **Revisa la pestaña Network** para ver si hay peticiones fallidas
4. **Verifica**:
   - Que `VITE_API_URL` esté configurada en Vercel
   - Que `CORS_ORIGINS` incluya tu URL de Vercel en Render
   - Que las credenciales de Firebase sean correctas

---

## 📝 Comandos Rápidos

### Ver estado de Git

```bash
git status
```

### Ver cambios específicos

```bash
git diff
```

### Agregar y commitear todo

```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

### Ver historial de commits

```bash
git log --oneline
```

---

## 🎯 Flujo Completo de Actualización

```
1. Hacer cambios en local
   ↓
2. Probar que funciona en local
   ↓
3. git add .
   ↓
4. git commit -m "Descripción"
   ↓
5. git push origin main
   ↓
6. Vercel despliega automáticamente (1-2 min)
   ↓
7. Render despliega automáticamente (5-10 min)
   ↓
8. Verificar en producción
   ↓
9. ¡Listo! 🎉
```

---

## ⚠️ Importante: Variables de Entorno

### Si agregaste nuevas variables de entorno

**Frontend (Vercel):**
1. Ve a Vercel → Tu proyecto → Settings → Environment Variables
2. Agrega la nueva variable
3. Haz clic en **"Redeploy"** en el último deployment

**Backend (Render):**
1. Ve a Render → Tu servicio → Environment
2. Agrega la nueva variable
3. Render redeployará automáticamente

### Si cambiaste variables existentes

Solo actualiza el valor en Vercel/Render y haz redeploy.

---

## 🔍 Verificar que los Cambios se Aplicaron

### Frontend

1. Abre tu URL de Vercel
2. Presiona **Ctrl + Shift + R** (o Cmd + Shift + R en Mac) para forzar recarga
3. Verifica que los cambios estén visibles

### Backend

1. Prueba el endpoint: `https://tu-backend.onrender.com/api/health`
2. O prueba hacer una consulta desde el frontend
3. Revisa los logs en Render para verificar que funciona

---

## 📊 Monitoreo

### Vercel Analytics

- Ve a Vercel → Tu proyecto → Analytics
- Puedes ver estadísticas de uso

### Render Logs

- Ve a Render → Tu servicio → Logs
- Puedes ver logs en tiempo real

### Firebase Console

- Ve a Firebase Console → Tu proyecto
- Puedes ver usuarios y datos en tiempo real

---

## 🎉 ¡Listo!

Después de hacer `git push`, tus cambios estarán en producción en:

- **Frontend**: 1-2 minutos
- **Backend**: 5-10 minutos

**No necesitas hacer nada más**, Vercel y Render se encargan automáticamente.

---

## 💡 Tips

1. **Haz commits pequeños y frecuentes** en lugar de uno grande
2. **Prueba siempre en local** antes de hacer push
3. **Revisa los logs** si algo falla
4. **Mantén un backup** de tus API keys en un lugar seguro
5. **Documenta cambios importantes** en los mensajes de commit

---

**📖 Guía completa de despliegue**: Ver `DEPLOY_FIREBASE.md`

