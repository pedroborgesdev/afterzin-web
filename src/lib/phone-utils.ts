/**
 * Utilitários para manipulação e validação de números de telefone
 * Suporta formato brasileiro com DDD e internacional
 */

/**
 * Remove caracteres não numéricos de um telefone
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Formata número de telefone para exibição
 * 999999999 → 99999-9999 (celular)
 * 88888888 → 8888-8888 (fixo)
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = sanitizePhone(phone);

  if (cleaned.length === 9) {
    // Celular: 9XXXX-XXXX
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  } else if (cleaned.length === 8) {
    // Fixo: XXXX-XXXX
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }

  return cleaned;
}

/**
 * Formata telefone completo para exibição
 * ("55", "11", "999999999") → "+55 (11) 99999-9999"
 */
export function formatFullPhone(
  countryCode: string,
  areaCode: string,
  number: string
): string {
  const formattedNumber = formatPhoneNumber(number);
  return `+${countryCode} (${areaCode}) ${formattedNumber}`;
}

/**
 * Valida DDD brasileiro (11-99)
 */
export function isValidBrazilianAreaCode(areaCode: string): boolean {
  const code = parseInt(areaCode, 10);
  return !isNaN(code) && code >= 11 && code <= 99;
}

/**
 * Valida telefone completo (country code, area code, number)
 * Retorna objeto com resultado da validação e mensagem de erro se houver
 */
export function validatePhone(
  countryCode: string,
  areaCode: string,
  number: string
): {
  valid: boolean;
  error?: string;
} {
  // Valida country code
  if (!countryCode || countryCode.length === 0) {
    return { valid: false, error: 'Código do país é obrigatório' };
  }

  // Valida area code
  if (!areaCode || areaCode.length !== 2) {
    return { valid: false, error: 'DDD deve ter 2 dígitos' };
  }

  // Validação específica para Brasil (55)
  if (countryCode === '55') {
    if (!isValidBrazilianAreaCode(areaCode)) {
      return { valid: false, error: 'DDD inválido (deve estar entre 11 e 99)' };
    }

    const cleanNumber = sanitizePhone(number);
    if (cleanNumber.length !== 8 && cleanNumber.length !== 9) {
      return { valid: false, error: 'Número deve ter 8 ou 9 dígitos' };
    }
  } else {
    // Internacional: validação mais flexível
    const cleanNumber = sanitizePhone(number);
    if (cleanNumber.length < 6) {
      return { valid: false, error: 'Número muito curto' };
    }
  }

  return { valid: true };
}
