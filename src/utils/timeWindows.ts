type WindowHHMM = { from: string; to: string };

const PEAK_WINDOWS: WindowHHMM[] = [
  { from: "07:30", to: "09:30" },
  { from: "12:30", to: "14:30" },
  { from: "18:00", to: "20:30" },
];

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function isPeakNow(date = new Date()): boolean {
  const now = date.getHours() * 60 + date.getMinutes();
  return PEAK_WINDOWS.some(w => now >= toMinutes(w.from) && now <= toMinutes(w.to));
}

export function peakText(date = new Date()): string {
  if (!isPeakNow(date)) return "Fuera de horario pico";
  return "Horario pico activo";
}
