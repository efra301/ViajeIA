/**
 * ============================================
 * UTILIDADES DE VALIDACIÓN - VIAJEIA
 * ============================================
 * 
 * Este archivo contiene funciones para validar datos del usuario
 * antes de enviarlos al backend o guardarlos en Firebase.
 * 
 * ¿Por qué es importante?
 * - Previene errores en el servidor
 * - Mejora la experiencia del usuario
 * - Protege contra datos maliciosos
 */

/**
 * Valida que un email tenga formato correcto
 * @param {string} email - El email a validar
 * @returns {object} - { isValid: boolean, error: string }
 */
export function validateEmail(email) {
  // Si está vacío
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'El correo electrónico es obligatorio'
    }
  }

  // Expresión regular para validar formato de email
  // Esta regex verifica que tenga: texto@texto.texto
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Por favor, ingresa un correo electrónico válido (ej: usuario@email.com)'
    }
  }

  // Validar longitud máxima (evitar emails extremadamente largos)
  if (email.length > 254) {
    return {
      isValid: false,
      error: 'El correo electrónico es demasiado largo'
    }
  }

  return {
    isValid: true,
    error: null
  }
}

/**
 * Valida una contraseña
 * @param {string} password - La contraseña a validar
 * @param {number} minLength - Longitud mínima (por defecto 6)
 * @returns {object} - { isValid: boolean, error: string }
 */
export function validatePassword(password, minLength = 6) {
  if (!password || password.trim() === '') {
    return {
      isValid: false,
      error: 'La contraseña es obligatoria'
    }
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `La contraseña debe tener al menos ${minLength} caracteres`
    }
  }

  // Validar longitud máxima (evitar contraseñas extremadamente largas)
  if (password.length > 128) {
    return {
      isValid: false,
      error: 'La contraseña es demasiado larga'
    }
  }

  return {
    isValid: true,
    error: null
  }
}

/**
 * Valida un nombre
 * @param {string} nombre - El nombre a validar
 * @returns {object} - { isValid: boolean, error: string }
 */
export function validateNombre(nombre) {
  if (!nombre || nombre.trim() === '') {
    return {
      isValid: false,
      error: 'El nombre es obligatorio'
    }
  }

  // Validar longitud mínima
  if (nombre.trim().length < 2) {
    return {
      isValid: false,
      error: 'El nombre debe tener al menos 2 caracteres'
    }
  }

  // Validar longitud máxima
  if (nombre.length > 100) {
    return {
      isValid: false,
      error: 'El nombre es demasiado largo (máximo 100 caracteres)'
    }
  }

  // Validar que solo contenga letras, espacios y algunos caracteres especiales
  // Esto previene inyección de código
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/
  if (!nombreRegex.test(nombre.trim())) {
    return {
      isValid: false,
      error: 'El nombre solo puede contener letras, espacios y guiones'
    }
  }

  return {
    isValid: true,
    error: null
  }
}

/**
 * Valida un destino de viaje
 * @param {string} destino - El destino a validar
 * @returns {object} - { isValid: boolean, error: string }
 */
export function validateDestino(destino) {
  if (!destino || destino.trim() === '') {
    return {
      isValid: false,
      error: 'El destino es obligatorio'
    }
  }

  // Validar longitud mínima
  if (destino.trim().length < 2) {
    return {
      isValid: false,
      error: 'El destino debe tener al menos 2 caracteres'
    }
  }

  // Validar longitud máxima
  if (destino.length > 100) {
    return {
      isValid: false,
      error: 'El destino es demasiado largo (máximo 100 caracteres)'
    }
  }

  // Validar que no contenga caracteres peligrosos
  // Esto previene inyección de código o SQL injection
  const dangerousChars = /[<>{}[\]\\\/]/
  if (dangerousChars.test(destino)) {
    return {
      isValid: false,
      error: 'El destino contiene caracteres no permitidos'
    }
  }

  return {
    isValid: true,
    error: null
  }
}

/**
 * Valida una fecha de viaje
 * @param {string} fecha - La fecha en formato YYYY-MM-DD
 * @returns {object} - { isValid: boolean, error: string }
 */
export function validateFecha(fecha) {
  if (!fecha || fecha.trim() === '') {
    return {
      isValid: false,
      error: 'La fecha es obligatoria'
    }
  }

  // Validar formato de fecha
  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!fechaRegex.test(fecha)) {
    return {
      isValid: false,
      error: 'Formato de fecha inválido'
    }
  }

  // Convertir a objeto Date
  const fechaObj = new Date(fecha)
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0) // Resetear horas para comparar solo fechas

  // Validar que la fecha no sea en el pasado
  if (fechaObj < hoy) {
    return {
      isValid: false,
      error: 'La fecha de viaje no puede ser en el pasado'
    }
  }

  // Validar que la fecha no sea demasiado lejana (ej: más de 10 años)
  const maxFecha = new Date()
  maxFecha.setFullYear(maxFecha.getFullYear() + 10)
  if (fechaObj > maxFecha) {
    return {
      isValid: false,
      error: 'La fecha de viaje no puede ser más de 10 años en el futuro'
    }
  }

  return {
    isValid: true,
    error: null
  }
}

/**
 * Valida una pregunta para el asistente
 * @param {string} pregunta - La pregunta a validar
 * @param {number} minLength - Longitud mínima (por defecto 10)
 * @param {number} maxLength - Longitud máxima (por defecto 500)
 * @returns {object} - { isValid: boolean, error: string }
 */
export function validatePregunta(pregunta, minLength = 10, maxLength = 500) {
  if (!pregunta || pregunta.trim() === '') {
    return {
      isValid: false,
      error: 'Por favor, escribe tu pregunta'
    }
  }

  if (pregunta.trim().length < minLength) {
    return {
      isValid: false,
      error: `La pregunta debe tener al menos ${minLength} caracteres`
    }
  }

  if (pregunta.length > maxLength) {
    return {
      isValid: false,
      error: `La pregunta es demasiado larga (máximo ${maxLength} caracteres)`
    }
  }

  return {
    isValid: true,
    error: null
  }
}

/**
 * Sanitiza (limpia) un texto para prevenir inyección de código
 * @param {string} texto - El texto a sanitizar
 * @returns {string} - El texto limpio
 */
export function sanitizeText(texto) {
  if (!texto) return ''
  
  // Remover caracteres peligrosos pero mantener espacios y caracteres normales
  return texto
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover eventos como onclick=
    .trim()
}

