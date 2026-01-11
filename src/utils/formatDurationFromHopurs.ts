export function formatDurationFromHours(totalHours: number): string {
  if (!totalHours || totalHours <= 0) return "0 minutos"

  const totalMinutes = Math.round(totalHours * 60)

  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60

  const parts: string[] = []

  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'día' : 'días'}`)
  }

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hora' : 'horas'}`)
  }

  if (minutes > 0 && days === 0) {
    // 👈 solo mostramos minutos si no es una duración enorme
    parts.push(`${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`)
  }

  return parts.join(' ')
}
