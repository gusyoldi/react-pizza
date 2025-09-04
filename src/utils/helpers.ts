export function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export function calcMinutesLeft(dateStr: string) {
  const d1 = new Date().getTime();
  const d2 = new Date(dateStr).getTime();
  return Math.round((d2 - d1) / 60000);
}

export function translateStatus(status: string): string {
  switch (status) {
    case 'preparing':
      return 'En preparación';
    case 'on the way':
      return 'En camino';
    case 'delivered':
      return 'Entregado';
    default:
      return 'Desconocido';
  }
}
