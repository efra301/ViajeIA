/**
 * ============================================
 * UTILIDADES DE SEGURIDAD - VIAJEIA
 * ============================================
 * 
 * Este archivo contiene funciones para detectar y prevenir
 * prompts peligrosos o maliciosos antes de enviarlos a la IA.
 * 
 * ¿Por qué es importante?
 * - Previene que usuarios intenten manipular la IA
 * - Protege contra inyección de prompts
 * - Mantiene el asistente enfocado en viajes
 */

/**
 * Lista de palabras y frases peligrosas que no deberían estar en prompts
 * Estas son palabras que podrían intentar manipular la IA
 */
const PALABRAS_PELIGROSAS = [
  // Intentos de manipulación
  'ignora las instrucciones',
  'olvida todo lo anterior',
  'eres ahora',
  'actúa como si fueras',
  'simula ser',
  'finge ser',
  'hazte pasar por',
  
  // Comandos peligrosos
  'elimina',
  'borra',
  'destruye',
  'hackea',
  'infiltra',
  'roba',
  'secuestra',
  
  // Intentos de acceso no autorizado
  'muéstrame contraseñas',
  'dame acceso',
  'bypass',
  'evade',
  'omite la seguridad',
  
  // Contenido inapropiado
  'contenido para adultos',
  'material explícito',
  'información ilegal',
  
  // Intentos de hacer que la IA haga cosas fuera de su propósito
  'no eres un asistente de viajes',
  'eres un hacker',
  'eres un programador',
  'eres un médico',
  'eres un abogado',
]

/**
 * Lista de temas que están fuera del alcance del asistente de viajes
 */
const TEMAS_FUERA_DE_ALCANCE = [
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

/**
 * Detecta si un prompt contiene palabras peligrosas
 * @param {string} prompt - El prompt a analizar
 * @returns {object} - { isSafe: boolean, reason: string }
 */
export function detectarPromptPeligroso(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    return {
      isSafe: false,
      reason: 'El prompt está vacío o no es válido'
    }
  }

  const promptLower = prompt.toLowerCase()

  // Verificar palabras peligrosas
  for (const palabra of PALABRAS_PELIGROSAS) {
    if (promptLower.includes(palabra.toLowerCase())) {
      return {
        isSafe: false,
        reason: `El prompt contiene contenido no permitido relacionado con: "${palabra}"`
      }
    }
  }

  // Verificar temas fuera de alcance (solo si el prompt es principalmente sobre esos temas)
  // Esto es más permisivo porque puede mencionar estos temas en contexto de viajes
  // Ej: "¿Hay cajeros automáticos en París?" está bien, pero "enséñame programación" no
  const palabrasPrompt = promptLower.split(/\s+/)
  const palabrasTemasFuera = TEMAS_FUERA_DE_ALCANCE.filter(tema => 
    promptLower.includes(tema.toLowerCase())
  )
  
  // Si más del 30% del prompt es sobre temas fuera de alcance, rechazar
  if (palabrasTemasFuera.length > 0 && palabrasPrompt.length < 10) {
    // Para prompts cortos, ser más estricto
    return {
      isSafe: false,
      reason: 'Este asistente solo puede ayudarte con temas relacionados a viajes'
    }
  }

  // Verificar que el prompt esté relacionado con viajes
  // Palabras clave relacionadas con viajes
  const palabrasViaje = [
    'viaje', 'viajar', 'destino', 'hotel', 'vuelo', 'avión',
    'ciudad', 'país', 'turismo', 'turista', 'itinerario',
    'restaurante', 'comida', 'cultura', 'museo', 'playa',
    'montaña', 'aventura', 'relajación', 'presupuesto',
    'moneda', 'clima', 'temperatura', 'visa', 'pasaporte'
  ]

  const tieneRelacionViaje = palabrasViaje.some(palabra => 
    promptLower.includes(palabra)
  )

  // Si el prompt es muy corto y no menciona nada de viajes, podría ser sospechoso
  if (promptLower.length < 20 && !tieneRelacionViaje) {
    return {
      isSafe: false,
      reason: 'Por favor, haz preguntas relacionadas con viajes y planificación'
    }
  }

  return {
    isSafe: true,
    reason: null
  }
}

/**
 * Limpia un prompt de caracteres peligrosos y lo prepara para enviar
 * @param {string} prompt - El prompt a limpiar
 * @returns {string} - El prompt limpio
 */
export function limpiarPrompt(prompt) {
  if (!prompt) return ''

  return prompt
    .trim()
    // Remover múltiples espacios
    .replace(/\s+/g, ' ')
    // Limitar longitud
    .substring(0, 500)
}

