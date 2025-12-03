# ⚡ Inicio Rápido - ViajeIA Local

## 🚀 Ejecutar en 3 Pasos

### 1️⃣ Backend (Terminal 1)

```bash
cd backend
source venv/bin/activate
python app.py
```

**✅ Listo cuando veas:** `Running on http://0.0.0.0:5001`

---

### 2️⃣ Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

**✅ Listo cuando veas:** `Local: http://localhost:5173/`

---

### 3️⃣ Abrir Navegador

```
http://localhost:5173
```

---

## ⚙️ Configuración Inicial (Solo la primera vez)

### Backend - Crear `.env`

Crea `backend/.env`:

```env
GEMINI_API_KEY=tu-key
OPENWEATHER_API_KEY=tu-key
UNSPLASH_API_KEY=tu-key
PORT=5001
FLASK_ENV=development
CORS_ORIGINS=http://localhost:5173
```

### Backend - Instalar dependencias

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend - Instalar dependencias

```bash
cd frontend
npm install
```

---

## 🔍 Verificar que Funciona

1. **Backend**: `http://localhost:5001/api/health` → Debe responder `{"status": "ok"}`
2. **Frontend**: `http://localhost:5173` → Debe mostrar Login
3. **Firebase**: Registra un usuario → Debe aparecer en Firebase Console

---

## 🛑 Detener

- **Ctrl + C** en ambas terminales

---

**📖 Guía completa**: Ver `EJECUTAR_LOCAL.md`

