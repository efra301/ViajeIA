"""
============================================
SISTEMA DE RATE LIMITING - VIAJEIA
============================================

Este módulo controla cuántas consultas puede hacer un usuario
para prevenir abuso y uso excesivo del servicio.

¿Por qué es importante?
- Protege contra abuso del servicio
- Controla costos de API
- Asegura que todos los usuarios tengan acceso justo
"""

from datetime import datetime, timedelta
from collections import defaultdict
import time

# ============================================
# CONFIGURACIÓN DE LÍMITES
# ============================================
# Estos valores definen cuántas consultas puede hacer un usuario

# Límite por minuto (evita spam rápido)
REQUESTS_PER_MINUTE = 5

# Límite por hora (evita uso excesivo)
REQUESTS_PER_HOUR = 30

# Límite por día (límite diario)
REQUESTS_PER_DAY = 100

# ============================================
# ALMACENAMIENTO EN MEMORIA
# ============================================
# En producción, deberías usar Redis o una base de datos
# Para este ejemplo, usamos un diccionario en memoria

# Estructura: { user_id: { 'minute': [...timestamps], 'hour': [...], 'day': [...] } }
user_requests = defaultdict(lambda: {
    'minute': [],
    'hour': [],
    'day': []
})


def limpiar_requests_antiguas(user_id):
    """
    Limpia las timestamps antiguas que ya no cuentan para los límites.
    Esto previene que la memoria crezca indefinidamente.
    """
    ahora = time.time()
    requests = user_requests[user_id]
    
    # Limpiar requests de hace más de 1 minuto
    requests['minute'] = [
        ts for ts in requests['minute'] 
        if ahora - ts < 60
    ]
    
    # Limpiar requests de hace más de 1 hora
    requests['hour'] = [
        ts for ts in requests['hour'] 
        if ahora - ts < 3600
    ]
    
    # Limpiar requests de hace más de 1 día
    requests['day'] = [
        ts for ts in requests['day'] 
        if ahora - ts < 86400
    ]


def verificar_limite(user_id):
    """
    Verifica si un usuario puede hacer una consulta.
    
    Args:
        user_id: ID del usuario (puede ser email, IP, o UID de Firebase)
    
    Returns:
        dict: {
            'allowed': bool,
            'reason': str (si no está permitido),
            'retry_after': int (segundos para esperar)
        }
    """
    # Limpiar requests antiguas primero
    limpiar_requests_antiguas(user_id)
    
    ahora = time.time()
    requests = user_requests[user_id]
    
    # Verificar límite por minuto
    if len(requests['minute']) >= REQUESTS_PER_MINUTE:
        # Calcular cuánto tiempo falta para el siguiente request permitido
        tiempo_mas_antiguo = min(requests['minute'])
        retry_after = int(60 - (ahora - tiempo_mas_antiguo))
        return {
            'allowed': False,
            'reason': f'Has alcanzado el límite de {REQUESTS_PER_MINUTE} consultas por minuto',
            'retry_after': retry_after,
            'limit_type': 'minute'
        }
    
    # Verificar límite por hora
    if len(requests['hour']) >= REQUESTS_PER_HOUR:
        tiempo_mas_antiguo = min(requests['hour'])
        retry_after = int(3600 - (ahora - tiempo_mas_antiguo))
        return {
            'allowed': False,
            'reason': f'Has alcanzado el límite de {REQUESTS_PER_HOUR} consultas por hora',
            'retry_after': retry_after,
            'limit_type': 'hour'
        }
    
    # Verificar límite por día
    if len(requests['day']) >= REQUESTS_PER_DAY:
        tiempo_mas_antiguo = min(requests['day'])
        retry_after = int(86400 - (ahora - tiempo_mas_antiguo))
        return {
            'allowed': False,
            'reason': f'Has alcanzado el límite de {REQUESTS_PER_DAY} consultas por día',
            'retry_after': retry_after,
            'limit_type': 'day'
        }
    
    # Si pasa todas las verificaciones, permitir el request
    return {
        'allowed': True,
        'reason': None,
        'retry_after': 0,
        'limit_type': None
    }


def registrar_request(user_id):
    """
    Registra que un usuario hizo una consulta.
    Esto debe llamarse DESPUÉS de verificar que está permitido.
    
    Args:
        user_id: ID del usuario
    """
    ahora = time.time()
    requests = user_requests[user_id]
    
    # Agregar timestamp a todas las listas
    requests['minute'].append(ahora)
    requests['hour'].append(ahora)
    requests['day'].append(ahora)


def obtener_estadisticas(user_id):
    """
    Obtiene estadísticas de uso del usuario.
    Útil para mostrar al usuario cuántas consultas ha hecho.
    
    Returns:
        dict: {
            'minute': int,
            'hour': int,
            'day': int,
            'limits': {
                'minute': int,
                'hour': int,
                'day': int
            }
        }
    """
    limpiar_requests_antiguas(user_id)
    requests = user_requests[user_id]
    
    return {
        'minute': len(requests['minute']),
        'hour': len(requests['hour']),
        'day': len(requests['day']),
        'limits': {
            'minute': REQUESTS_PER_MINUTE,
            'hour': REQUESTS_PER_HOUR,
            'day': REQUESTS_PER_DAY
        }
    }

