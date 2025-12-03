from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import requests
import time
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

# 🔒 SEGURIDAD: Importar módulos de seguridad
from security import validar_pregunta, sanitizar_texto, validar_destino, validar_fecha
from rate_limiter import verificar_limite, registrar_request

# Cargar variables de entorno desde el archivo .env
load_dotenv()

app = Flask(__name__)
# Configurar CORS para permitir peticiones desde el frontend
# En producción, permite solo dominios específicos; en desarrollo, permite todos
cors_origins = os.getenv('CORS_ORIGINS', '*').split(',')
CORS(app, resources={r"/api/*": {"origins": cors_origins}})

# Inicializar el cliente de Gemini
gemini_api_key = os.getenv('GEMINI_API_KEY')
if not gemini_api_key:
    print("⚠️  ADVERTENCIA: GEMINI_API_KEY no está configurada. Asegúrate de crear un archivo .env con tu API key.")
    model = None
else:
    genai.configure(api_key=gemini_api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')

# Constantes de optimización
SYSTEM_PROMPT = "Asistente experto en viajes. Respuestas prácticas y concisas."
RESPONSE_FORMAT = """Formato obligatorio (5 secciones con saltos de línea):
» ALOJAMIENTO: [recomendaciones]
Þ COMIDA LOCAL: [recomendaciones]
 LUGARES IMPERDIBLES: [recomendaciones]
ä CONSEJOS LOCALES: [tips]
ø ESTIMACIÓN DE COSTOS: [breakdown]"""
MAX_QUESTION_LENGTH = 500
MIN_QUESTION_LENGTH = 10

# Inicializar OpenWeatherMap API
openweather_api_key = os.getenv('OPENWEATHER_API_KEY')
if not openweather_api_key:
    print("⚠️  ADVERTENCIA: OPENWEATHER_API_KEY no está configurada. La funcionalidad del clima no estará disponible.")

# Inicializar Unsplash API
unsplash_api_key = os.getenv('UNSPLASH_API_KEY')
if not unsplash_api_key:
    print("⚠️  ADVERTENCIA: UNSPLASH_API_KEY no está configurada. Las fotos no estarán disponibles.")

def obtener_clima_ciudad(nombre_ciudad):
    """
    Obtiene el clima actual de una ciudad usando OpenWeatherMap API
    """
    if not openweather_api_key:
        return None
    
    try:
        # URL de la API de OpenWeatherMap
        url = f"http://api.openweathermap.org/data/2.5/weather"
        params = {
            'q': nombre_ciudad,
            'appid': openweather_api_key,
            'units': 'metric',  # Para obtener temperatura en Celsius
            'lang': 'es'  # Respuestas en español
        }
        
        response = requests.get(url, params=params, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            
            # Obtener zona horaria (offset en segundos)
            timezone_offset = data.get('timezone', 0)  # Offset en segundos
            
            # Extraer información relevante
            clima_info = {
                'ciudad': data['name'],
                'pais': data['sys']['country'],
                'temperatura': round(data['main']['temp']),
                'sensacion_termica': round(data['main']['feels_like']),
                'descripcion': data['weather'][0]['description'].capitalize(),
                'humedad': data['main']['humidity'],
                'viento': round(data['wind']['speed'] * 3.6),  # Convertir m/s a km/h
                'presion': data['main']['pressure'],
                'visibilidad': data.get('visibility', 0) / 1000 if data.get('visibility') else None,  # Convertir a km
                'timezone_offset': timezone_offset  # Offset en segundos
            }
            return clima_info
        else:
            print(f"Error al obtener clima: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Error al obtener clima: {str(e)}")
        return None

def obtener_tipo_cambio(base_currency='USD', target_currency='EUR'):
    """
    Obtiene el tipo de cambio usando exchangerate-api.com (gratis, no requiere API key)
    """
    try:
        url = f"https://api.exchangerate-api.com/v4/latest/{base_currency}"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            rates = data.get('rates', {})
            
            if target_currency in rates:
                return {
                    'base': base_currency,
                    'target': target_currency,
                    'rate': rates[target_currency],
                    'fecha': data.get('date', '')
                }
        return None
    except Exception as e:
        print(f"Error al obtener tipo de cambio: {str(e)}")
        return None

def obtener_moneda_pais(codigo_pais):
    """
    Mapea códigos de país a sus monedas principales
    """
    monedas_paises = {
        'US': 'USD', 'MX': 'MXN', 'AR': 'ARS', 'CL': 'CLP', 'CO': 'COP', 'PE': 'PEN',
        'BR': 'BRL', 'ES': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'DE': 'EUR', 'GB': 'GBP',
        'JP': 'JPY', 'CN': 'CNY', 'IN': 'INR', 'AU': 'AUD', 'CA': 'CAD', 'CH': 'CHF',
        'NZ': 'NZD', 'KR': 'KRW', 'TH': 'THB', 'SG': 'SGD', 'MY': 'MYR', 'ID': 'IDR',
        'PH': 'PHP', 'VN': 'VND', 'TR': 'TRY', 'EG': 'EGP', 'ZA': 'ZAR', 'AE': 'AED',
        'SA': 'SAR', 'IL': 'ILS', 'RU': 'RUB', 'PL': 'PLN', 'NL': 'EUR', 'BE': 'EUR',
        'PT': 'EUR', 'GR': 'EUR', 'IE': 'EUR', 'AT': 'EUR', 'FI': 'EUR', 'SE': 'SEK',
        'NO': 'NOK', 'DK': 'DKK', 'CZ': 'CZK', 'HU': 'HUF', 'RO': 'RON', 'BG': 'BGN'
    }
    return monedas_paises.get(codigo_pais.upper(), 'USD')

def obtener_fotos_destino(nombre_destino, cantidad=3):
    """
    Obtiene fotos hermosas de un destino usando Unsplash API
    """
    if not unsplash_api_key:
        return []
    
    try:
        # URL de la API de Unsplash
        url = "https://api.unsplash.com/search/photos"
        headers = {
            'Authorization': f'Client-ID {unsplash_api_key}'
        }
        params = {
            'query': nombre_destino,
            'per_page': cantidad,
            'orientation': 'landscape',  # Fotos horizontales
            'order_by': 'popularity'  # Las más populares
        }
        
        response = requests.get(url, headers=headers, params=params, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            fotos = []
            
            for photo in data.get('results', [])[:cantidad]:
                fotos.append({
                    'url': photo['urls']['regular'],  # Tamaño regular (buena calidad)
                    'url_pequeña': photo['urls']['small'],  # Para carga rápida
                    'url_grande': photo['urls']['full'],  # Para ver en grande
                    'autor': photo['user']['name'],
                    'descripcion': photo.get('description', '') or photo.get('alt_description', '')
                })
            
            return fotos
        else:
            print(f"Error al obtener fotos de Unsplash: {response.status_code}")
            return []
            
    except Exception as e:
        print(f"Error al obtener fotos: {str(e)}")
        return []

@app.route('/api/planificar', methods=['POST'])
def planificar_viaje():
    try:
        data = request.get_json()
        pregunta = data.get('pregunta', '')
        datos_viaje = data.get('datosViaje', {})
        historial_conversaciones = data.get('historial', [])
        usuario_id = data.get('usuarioId', request.remote_addr)  # Usar IP si no hay usuarioId
        
        # 🔒 SEGURIDAD: Rate Limiting - Verificar límites de uso
        limite_check = verificar_limite(usuario_id)
        if not limite_check['allowed']:
            return jsonify({
                'error': limite_check['reason'],
                'retry_after': limite_check['retry_after'],
                'limit_type': limite_check['limit_type']
            }), 429  # 429 = Too Many Requests
        
        # 🔒 SEGURIDAD: Validar pregunta
        es_valida, mensaje_error = validar_pregunta(pregunta)
        if not es_valida:
            return jsonify({'error': mensaje_error}), 400
        
        # 🔒 SEGURIDAD: Sanitizar pregunta antes de procesarla
        pregunta = sanitizar_texto(pregunta.strip())
        
        # 🔒 SEGURIDAD: Validar datos del viaje si están presentes
        if datos_viaje:
            destino = datos_viaje.get('destino', '')
            fecha = datos_viaje.get('fecha', '')
            
            if destino:
                es_valido, mensaje = validar_destino(destino)
                if not es_valido:
                    return jsonify({'error': mensaje}), 400
            
            if fecha:
                es_valida, mensaje = validar_fecha(fecha)
                if not es_valida:
                    return jsonify({'error': mensaje}), 400
        
        # Verificar que Gemini esté configurado
        if not model:
            return jsonify({
                'error': 'Gemini no está configurado. Por favor, crea un archivo .env con tu GEMINI_API_KEY.'
            }), 500
        
        # Llamar a la API de Gemini
        try:
            # Obtener el destino (de datos_viaje o intentar extraerlo de la pregunta)
            destino = datos_viaje.get('destino', '') if datos_viaje else ''
            
            # Si no hay destino en datos_viaje, intentar extraerlo de la pregunta
            if not destino:
                # Buscar nombres de ciudades comunes en la pregunta (esto es básico, se puede mejorar)
                palabras = pregunta.split()
                # Si la pregunta menciona "viaje a", "ir a", "visitar", etc.
                for i, palabra in enumerate(palabras):
                    if palabra.lower() in ['a', 'a:', 'viaje', 'viajar', 'visitar', 'ir'] and i + 1 < len(palabras):
                        destino = palabras[i + 1].strip('.,!?')
                        break
            
            # Debug: imprimir el destino detectado
            print(f"🔍 Destino detectado: {destino}")
            
            # Obtener información del clima si hay un destino
            info_clima = None
            info_destino = None  # Información completa del destino para el panel lateral
            if destino and destino.strip():
                print(f"🌤️ Buscando clima para: {destino}")
                info_clima = obtener_clima_ciudad(destino)
                if info_clima:
                    print(f"✅ Clima obtenido para {info_clima['ciudad']}: {info_clima['temperatura']}°C")
                    
                    # Preparar información para el panel lateral
                    # Calcular diferencia horaria
                    destino_offset = info_clima.get('timezone_offset', 0)  # Offset del destino en segundos desde UTC
                    
                    # Obtener offset local desde UTC (en segundos)
                    local_utc_offset = -time.timezone if time.daylight == 0 else -time.altzone
                    
                    # Calcular diferencia entre destino y local
                    diferencia_segundos = destino_offset - local_utc_offset
                    diferencia_horas = diferencia_segundos / 3600
                    
                    # Calcular hora del destino (UTC + offset del destino)
                    hora_utc = datetime.now(timezone.utc)
                    hora_destino = hora_utc + timedelta(seconds=destino_offset)
                    
                    # Obtener tipo de cambio
                    moneda_destino = obtener_moneda_pais(info_clima['pais'])
                    tipo_cambio = obtener_tipo_cambio('USD', moneda_destino)
                    
                    info_destino = {
                        'ciudad': info_clima['ciudad'],
                        'pais': info_clima['pais'],
                        'temperatura': info_clima['temperatura'],
                        'descripcion': info_clima['descripcion'],
                        'diferencia_horaria': round(diferencia_horas, 1),
                        'hora_destino': hora_destino.strftime('%H:%M'),
                        'moneda': moneda_destino,
                        'tipo_cambio': tipo_cambio['rate'] if tipo_cambio else None,
                        'simbolo_moneda': tipo_cambio['target'] if tipo_cambio else moneda_destino
                    }
                else:
                    print(f"⚠️ No se pudo obtener el clima para: {destino}")
            
            # Obtener fotos del destino
            fotos_destino = []
            if destino and destino.strip():
                print(f"📸 Buscando fotos para: {destino}")
                fotos_destino = obtener_fotos_destino(destino, cantidad=3)
                if fotos_destino:
                    print(f"✅ {len(fotos_destino)} fotos obtenidas para {destino}")
                else:
                    print(f"⚠️ No se pudieron obtener fotos para: {destino}")
            
            # Construir contexto optimizado (solo información esencial)
            contexto = []
            
            # Datos del viaje (solo si existen)
            if datos_viaje and (destino or datos_viaje.get('fecha') or datos_viaje.get('presupuesto')):
                viaje_info = []
                if destino:
                    viaje_info.append(f"Destino: {destino}")
                if datos_viaje.get('fecha'):
                    viaje_info.append(f"Fecha: {datos_viaje['fecha']}")
                if datos_viaje.get('presupuesto'):
                    viaje_info.append(f"Presupuesto: {datos_viaje['presupuesto']}")
                if viaje_info:
                    contexto.append("Viaje: " + " | ".join(viaje_info))
            
            # Clima (solo datos esenciales)
            if info_clima:
                contexto.append(f"Clima: {info_clima['temperatura']}°C, {info_clima['descripcion']}")
            
            # Historial (solo última conversación relevante)
            if historial_conversaciones:
                ultima = historial_conversaciones[-1]
                contexto.append(f"Contexto previo: {ultima.get('pregunta', '')[:50]}...")
            
            # Construir prompt optimizado: sistema + formato + contexto + pregunta
            contexto_texto = "\n".join(contexto) if contexto else ""
            prompt = f"{SYSTEM_PROMPT}\n\n{RESPONSE_FORMAT}"
            if contexto_texto:
                prompt += f"\n\nContexto:\n{contexto_texto}"
            prompt += f"\n\nPregunta: {pregunta}\n\nResponde usando el formato especificado con saltos de línea entre secciones."
            
            # Generar respuesta con Gemini
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=800,
                    temperature=0.8,  # Un poco más creativo para ser más entusiasta
                )
            )
            
            # Extraer la respuesta de Gemini
            respuesta = response.text
            
        except Exception as gemini_error:
            error_msg = str(gemini_error)
            # Mensajes más amigables para errores comunes
            if "quota" in error_msg.lower() or "quota_exceeded" in error_msg.lower():
                error_msg = "Has excedido la cuota de la API de Gemini. Por favor, verifica tu plan en https://makersuite.google.com/app/apikey"
            elif "invalid_api_key" in error_msg.lower() or "authentication" in error_msg.lower() or "API_KEY_INVALID" in error_msg:
                error_msg = "La API key de Gemini no es válida. Por favor, verifica tu archivo .env"
            elif "rate_limit" in error_msg.lower() or "RESOURCE_EXHAUSTED" in error_msg:
                error_msg = "Has excedido el límite de solicitudes. Por favor, espera un momento e intenta de nuevo."
            
            return jsonify({
                'error': f'Error con Gemini: {error_msg}'
            }), 500
        
        # 🔒 SEGURIDAD: Registrar que el usuario hizo una consulta (después de éxito)
        registrar_request(usuario_id)
        
        return jsonify({
            'respuesta': respuesta,
            'fotos': fotos_destino,
            'info_destino': info_destino  # Información para el panel lateral
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'status': 'ok',
        'message': 'ViajeIA Backend API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health',
            'planificar': '/api/planificar (POST)'
        }
    }), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Backend funcionando correctamente'}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(debug=debug, host='0.0.0.0', port=port)

