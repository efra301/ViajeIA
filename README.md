# ViajeIA - Tu Asistente Personal de Viajes

Aplicación web moderna para planificación de viajes con arquitectura separada entre frontend (React) y backend (Python/Flask).

## 🚀 Características

- **Frontend**: React con Vite
- **Backend**: Python con Flask
- **IA**: Integración con Google Gemini
- **Diseño**: Interfaz moderna con colores azules y blancos
- **Arquitectura**: Frontend y backend completamente separados
- **Historial inteligente**: Alex recuerda el contexto de tus últimas preguntas
- **PDF profesional**: Descarga tu itinerario con un clic
- **Favoritos**: Guarda y reutiliza tus viajes preferidos
- **Panel lateral**: Clima, hora local y tipo de cambio del destino
- **Métricas en vivo**: Contadores locales de uso, destinos y consultas por día
- **Banner Pro**: Previsualización de las capacidades premium de ViajeIA

## 📁 Estructura del Proyecto

```
ViajeIA/
├── frontend/          # Aplicación React
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/           # API Flask
│   ├── app.py
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

## 🛠️ Instalación y Configuración

### Backend (Python)

1. Navega a la carpeta backend:
```bash
cd backend
```

2. Crea un entorno virtual (recomendado):
```bash
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. Instala las dependencias:
```bash
pip install -r requirements.txt
```

4. **Configura tu API Key de Google Gemini** (IMPORTANTE):
   - Copia el archivo de ejemplo: `cp .env.example .env`
   - Edita el archivo `.env` y agrega tu API key de Gemini:
     ```
     GEMINI_API_KEY=tu-api-key-real-aqui
     ```
   - **¿Cómo obtener tu API key?**
     1. Ve a https://makersuite.google.com/app/apikey
     2. Inicia sesión con tu cuenta de Google
     3. Haz clic en "Create API Key" o "Get API Key"
     4. Copia la clave y pégala en el archivo `.env`
     5. ⚠️ **Importante**: Nunca compartas tu API key públicamente
     6. 💡 **Ventaja**: Gemini ofrece un plan gratuito generoso para empezar

5. Ejecuta el servidor:
```bash
python app.py
```

El backend estará disponible en `http://localhost:5001`

### Frontend (React)

1. Navega a la carpeta frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📝 Uso

1. Asegúrate de que ambos servidores estén ejecutándose (backend en puerto **5001** y frontend en puerto 5173)
2. Abre tu navegador en `http://localhost:5173`
3. Escribe tu pregunta sobre tu viaje en el campo de texto
4. Haz clic en "Planificar mi viaje"
5. La respuesta aparecerá en el área de respuestas

## 🤖 Integración con Google Gemini

La aplicación está configurada para usar Google Gemini para responder las preguntas sobre viajes. 

- **Modelo usado**: Gemini Pro (potente y gratuito para empezar)
- **Configuración**: El sistema está optimizado para respuestas sobre viajes
- **Costo**: Gemini ofrece un plan gratuito generoso. Consulta los límites en https://ai.google.dev/pricing

## 📊 Panel de Métricas y Favoritos

- **Historial**: se guardan las últimas conversaciones para que Alex mantenga el contexto.
- **Métricas locales**: número de usuarios, total de consultas, destinos más solicitados y consultas por día (se almacenan en el navegador mediante `localStorage`).
- **Favoritos**: guarda viajes completos con un clic y recupéralos desde la sección "Mis Viajes Guardados".
- **Exportación a PDF**: descarga todo tu itinerario con logo, detalles y recomendaciones.

> Las métricas se calculan localmente como referencia visual. Para métricas globales reales deberás conectar una base de datos o un servicio analítico.

## 💎 ViajeIA Pro (Próximamente)

Se añadió un banner informativo que anticipa las funcionalidades premium:
- Itinerarios día por día hiper detallados
- Reservas directas de hoteles
- Alertas de precios de vuelos
- Consultas ilimitadas con Alex

Puedes personalizar el CTA para captar leads o abrir un formulario de interés.

## 🌐 Despliegue en Vercel (Frontend)

1. **Prepara el repositorio**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Crea una cuenta en Vercel** (https://vercel.com) e instala la CLI opcionalmente:
   ```bash
   npm i -g vercel
   ```

3. **Despliega el frontend**
   - Desde la CLI: `vercel` (elige el directorio `frontend`, framework Vite y responde “Yes” a `npm run build`).
   - O desde la web: conecta el repositorio y selecciona `frontend/` como raíz.

4. **Configura el backend**
   - Vercel solo hospeda el frontend. Sube el backend Flask a un servicio como [Render](https://render.com), [Railway](https://railway.app) o [Fly.io](https://fly.io).
   - Asegúrate de exponer el backend por HTTPS y actualiza la URL en `frontend/src/App.jsx` y en el `proxy` de `vite.config.js`.

5. **Variables de entorno en producción**
   - En tu hosting del backend configura: `GEMINI_API_KEY`, `OPENWEATHER_API_KEY`, `UNSPLASH_API_KEY`.
   - Si usas algún servicio externo para métricas globales, agrega las claves correspondientes.

6. **Verifica**
   - Abre la URL generada por Vercel (ej. `https://viajeia.vercel.app`).
   - Confirma que la UI carga y que el backend responde (ajusta CORS si es necesario).

> Tip: puedes proteger el backend con HTTPS usando Render (Plan gratuito) y apuntar Vercel al dominio que Render te entregue.

## 🔧 Próximos Pasos

- Agregar persistencia de datos (guardar historial de conversaciones)
- Implementar autenticación de usuarios
- Agregar más funcionalidades de planificación de viajes
- Mejorar la interfaz con más opciones de personalización

## 🌐 Despliegue en Producción

### Desplegar Frontend en Vercel (GRATIS)

1. **Preparar el proyecto:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Subir a GitHub:**
   - Crea un repositorio en GitHub
   - Sube tu código

3. **Desplegar en Vercel:**
   - Ve a https://vercel.com
   - Conecta tu repositorio de GitHub
   - Configura:
     - **Root Directory**: `frontend`
     - **Framework**: Vite
   - Haz clic en "Deploy"

4. **Configurar variables de entorno:**
   - En Vercel → Settings → Environment Variables
   - Agrega: `VITE_API_URL=https://tu-backend-url.com`

### Desplegar Backend en Render (GRATIS)

1. **Crear cuenta en Render:**
   - Ve a https://render.com
   - Regístrate con GitHub

2. **Crear Web Service:**
   - New → Web Service
   - Conecta tu repositorio
   - Configura:
     - **Root Directory**: `backend`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `python app.py`

3. **Variables de entorno:**
   - Agrega todas tus API keys en Render
   - `GEMINI_API_KEY`, `OPENWEATHER_API_KEY`, `UNSPLASH_API_KEY`

📖 **Guía completa**: Ver `DEPLOY.md` para instrucciones detalladas paso a paso.

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal y educativo.

# ViajeIA
