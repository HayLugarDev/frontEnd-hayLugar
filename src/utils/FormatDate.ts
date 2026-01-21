export type DateFormatType = 'datetime' | 'date' | 'time';

export const formatDateSmart = (value: string | Date): string => {
  const date = new Date(value);
  const now = new Date();

  const sameDay = date.toDateString() === now.toDateString();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const time = date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  if (sameDay) return `Hoy · ${time} hs`;
  if (isTomorrow) return `Mañana · ${time} hs`;

  return date.toLocaleDateString('es-AR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }) + ` · ${time} hs`;
};

export const formatDate = (value: string | Date, type: DateFormatType = 'datetime'): string => {
  const date = typeof value === 'string' ? new Date(value) : value;

  if (isNaN(date.getTime())) return 'Fecha inválida';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  switch (type) {
    case 'time':
      return date.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'date':
      return date.toLocaleDateString('es-AR', options);
    default:
      return date.toLocaleString('es-AR', {
        ...options,
        hour: '2-digit',
        minute: '2-digit',
      });
  }
};


export function formatLocalDateTime(date: Date) {
  const pad = (n: any) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

export const toLocalMysqlDatetime = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
         `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
