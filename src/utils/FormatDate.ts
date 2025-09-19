export const formatDate = (value: string): string => {
  const date = new Date(value);
  return date.toLocaleString();
};

export function formatLocalDateTime(date: Date) {
  const pad = (n: any) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}