export const CBU_REGEX = /^\d{22}$/
export const ALIAS_REGEX = /^[a-zA-Z0-9.-]{6,20}$/

export function detectAliasType(value: string) {
  if (CBU_REGEX.test(value)) return 'CBU/CVU'
  if (ALIAS_REGEX.test(value)) return 'Alias'
  return null
}

export function isValidCUIT(cuit: string) {
  const digits = cuit.replace(/-/g, '')
  if (!/^\d{11}$/.test(digits)) return false

  const mult = [5,4,3,2,7,6,5,4,3,2]
  let sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * mult[i]
  }
  const mod = 11 - (sum % 11)
  const check = mod === 11 ? 0 : mod === 10 ? 9 : mod
  return check === parseInt(digits[10])
}
