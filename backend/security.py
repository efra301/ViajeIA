"""
============================================
UTILIDADES DE SEGURIDAD - BACKEND VIAJEIA
============================================

Este módulo contiene funciones para validar y sanitizar
datos antes de procesarlos, y detectar prompts peligrosos.

¿Por qué es importante?
- Previene inyección de código
- Protege contra prompts maliciosos
- Valida datos antes de enviarlos a la IA
"""

import re
from typing import Dict, Tuple

# ============================================
# LISTA DE PALABRAS Y FRASES PELIGROSAS
# ============================================
PALABRAS_PELIGROSAS = [
    'ignora las instrucciones',
    'olvida todo lo anterior',
    'eres ahora',
    'actúa como si fueras',
    'simula ser',
    'finge ser',
    'hazte pasar por',
    'elimina',
    'borra',
    'destruye',
    'hackea',
    'infiltra',
    'roba',
    'secuestra',
    'muéstrame contraseñas',
    'dame acceso',
    'bypass',
    'evade',
    'omite la seguridad',
]

TEMAS_FUERA_DE_ALCANCE = [
    'programación',
    'código',
    'hacking',
    'medicina',
    'diagnóstico médico',
    'consejo legal',
    'asesoría financiera',
    'trading',
    'criptomonedas',
    'armas',
    'drogas ilegales',
]

PALABRAS_VIAJE = [
    'viaje', 'viajar', 'destino', 'hotel', 'vuelo', 'avión',
    'ciudad', 'país', 'turismo', 'turista', 'itinerario',
    'restaurante', 'comida', 'cultura', 'museo', 'playa',
    'montaña', 'aventura', 'relajación', 'presupuesto',
    'moneda', 'clima', 'temperatura', 'visa', 'pasaporte'
]


def validar_pregunta(pregunta: str, min_length: int = 10, max_length: int = 500) -> Tuple[bool, str]:
    """
    Valida que una pregunta sea segura y apropiada.
    
    Args:
        pregunta: La pregunta a validar
        min_length: Longitud mínima
        max_length: Longitud máxima
    
    Returns:
        Tuple[bool, str]: (es_valida, mensaje_error)
    """
    if not pregunta or not isinstance(pregunta, str):
        return False, 'La pregunta no puede estar vacía'
    
    pregunta = pregunta.strip()
    
    # Validar longitud
    if len(pregunta) < min_length:
        return False, f'La pregunta debe tener al menos {min_length} caracteres'
    
    if len(pregunta) > max_length:
        return False, f'La pregunta no puede tener más de {max_length} caracteres'
    
    # Detectar prompts peligrosos
    es_segura, razon = detectar_prompt_peligroso(pregunta)
    if not es_segura:
        return False, razon
    
    return True, ''


def detectar_prompt_peligroso(prompt: str) -> Tuple[bool, str]:
    """
    Detecta si un prompt contiene contenido peligroso o fuera de alcance.
    
    Args:
        prompt: El prompt a analizar
    
    Returns:
        Tuple[bool, str]: (es_seguro, razon)
    """
    if not prompt:
        return False, 'El prompt está vacío'
    
    prompt_lower = prompt.lower()
    
    # Verificar palabras peligrosas
    for palabra in PALABRAS_PELIGROSAS:
        if palabra.lower() in prompt_lower:
            return False, f'El prompt contiene contenido no permitido: "{palabra}"'
    
    # Verificar temas fuera de alcance (solo si el prompt es principalmente sobre esos temas)
    palabras_prompt = prompt_lower.split()
    palabras_temas_fuera = [tema for tema in TEMAS_FUERA_DE_ALCANCE if tema.lower() in prompt_lower]
    
    # Si el prompt es corto y menciona temas fuera de alcance, rechazar
    if palabras_temas_fuera and len(palabras_prompt) < 10:
        return False, 'Este asistente solo puede ayudarte con temas relacionados a viajes'
    
    # Verificar que el prompt esté relacionado con viajes (para prompts muy cortos)
    tiene_relacion_viaje = any(palabra in prompt_lower for palabra in PALABRAS_VIAJE)
    
    if len(prompt_lower) < 20 and not tiene_relacion_viaje:
        return False, 'Por favor, haz preguntas relacionadas con viajes y planificación'
    
    return True, ''


def sanitizar_texto(texto: str) -> str:
    """
    Limpia un texto de caracteres peligrosos.
    
    Args:
        texto: El texto a sanitizar
    
    Returns:
        str: El texto limpio
    """
    if not texto:
        return ''
    
    # Remover caracteres peligrosos
    texto = texto.replace('<', '').replace('>', '')
    texto = re.sub(r'javascript:', '', texto, flags=re.IGNORECASE)
    texto = re.sub(r'on\w+=', '', texto, flags=re.IGNORECASE)
    
    # Limitar longitud
    texto = texto[:1000]
    
    return texto.strip()


def validar_destino(destino: str) -> Tuple[bool, str]:
    """
    Valida que un destino sea seguro.
    
    Args:
        destino: El destino a validar
    
    Returns:
        Tuple[bool, str]: (es_valido, mensaje_error)
    """
    if not destino or not destino.strip():
        return False, 'El destino es obligatorio'
    
    destino = destino.strip()
    
    if len(destino) < 2:
        return False, 'El destino debe tener al menos 2 caracteres'
    
    if len(destino) > 100:
        return False, 'El destino es demasiado largo'
    
    # Verificar caracteres peligrosos
    if re.search(r'[<>{}[\]\\\/]', destino):
        return False, 'El destino contiene caracteres no permitidos'
    
    return True, ''


def validar_fecha(fecha: str) -> Tuple[bool, str]:
    """
    Valida que una fecha sea válida y no esté en el pasado.
    
    Args:
        fecha: La fecha en formato YYYY-MM-DD
    
    Returns:
        Tuple[bool, str]: (es_valida, mensaje_error)
    """
    if not fecha:
        return False, 'La fecha es obligatoria'
    
    # Validar formato
    if not re.match(r'^\d{4}-\d{2}-\d{2}$', fecha):
        return False, 'Formato de fecha inválido'
    
    try:
        from datetime import datetime
        fecha_obj = datetime.strptime(fecha, '%Y-%m-%d')
        hoy = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Verificar que no sea en el pasado
        if fecha_obj < hoy:
            return False, 'La fecha de viaje no puede ser en el pasado'
        
        # Verificar que no sea demasiado lejana (más de 10 años)
        from datetime import timedelta
        max_fecha = hoy + timedelta(days=3650)  # 10 años
        if fecha_obj > max_fecha:
            return False, 'La fecha de viaje no puede ser más de 10 años en el futuro'
        
        return True, ''
    except ValueError:
        return False, 'Fecha inválida'

