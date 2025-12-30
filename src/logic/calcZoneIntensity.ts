import type { PeakStatus } from './usePeakSchedule'

export type ZoneIntensity = {
  level: 'green' | 'yellow' | 'red'
  weight: number // 1..5
}

export function calcZoneIntensity(
  baseLevel: 'green' | 'yellow' | 'red',
  peak: PeakStatus
): ZoneIntensity {

  if (peak === 'peak') {
    if (baseLevel === 'red') return { level: 'red', weight: 5 }
    if (baseLevel === 'yellow') return { level: 'red', weight: 4 }
    return { level: 'yellow', weight: 3 }
  } 

  // Fuera de pico
  if (baseLevel === 'red') return { level: 'yellow', weight: 3 }
  if (baseLevel === 'yellow') return { level: 'yellow', weight: 2 }
  return { level: 'green', weight: 1 }
}
