// src/services/meteredRealtime.ts
import { getSocket } from './socket';

export type MeteredStatus = 'free' | 'limited' | 'full' | 'unknown';

export interface MeteredBlockDTO {
  id: number;
  geo: {
    center: { lat: number; lng: number } | null;
    path: Array<{ lat: number; lng: number }>;
  };
  region: {
    country_code: string;
    admin1: string | null;
    admin2: string | null;
    city: string | null;
    neighborhood: string | null;
  };
  street: string;
  segment_ref: string | null;
  status: MeteredStatus;
  availability_pct: number | null;
  length_m: number;
  pricing: { price_per_hour: number; currency: string } | null;
  sensors: { count: number; source: string | null };
  active: boolean;
  updated_at: string | Date;
}

type RegionKey = {
  country_code: string;
  admin1?: string | null;
  city?: string | null;
};

export function subscribeToMeteredRealtime(opts: {
  region: RegionKey;
  onUpdate: (dto: MeteredBlockDTO) => void;
  onBulk?: (dtos: MeteredBlockDTO[]) => void;
  onConnected?: (info?: any) => void;
  onDisconnected?: () => void;
}) {
  const socket = getSocket();

  // Normalizamos la región (server agrupa por minúsculas)
  const region = {
    country_code: (opts.region.country_code || '').toLowerCase(),
    admin1: (opts.region.admin1 || '')?.toLowerCase() || undefined,
    city: (opts.region.city || '')?.toLowerCase() || undefined,
  };

  // Normaliza status a minúsculas por si viene 'FULL'
  const normalizeStatus = (dto: any): MeteredBlockDTO => ({
    ...dto,
    status: String(dto?.status || 'unknown').toLowerCase() as MeteredStatus,
  });

  const handleSingle = (raw: MeteredBlockDTO) => {
    if (!raw?.geo?.path || raw.geo.path.length < 2) return;
    opts.onUpdate(normalizeStatus(raw));
  };

  const handleBulk = (payload: { data: MeteredBlockDTO[] } | MeteredBlockDTO[]) => {
    const arr = Array.isArray((payload as any)?.data)
      ? (payload as any).data
      : Array.isArray(payload)
      ? (payload as any)
      : [];
    const list = arr
      .filter((b: any) => b?.geo?.path?.length >= 2)
      .map(normalizeStatus);

    if (list.length) {
      if (opts.onBulk) opts.onBulk(list);
      else list.forEach(handleSingle);
    }
  };

  const onConnect = () => {
    // En tu backend actual: 'subscribe' (no 'metered.subscribe')
    socket.emit(
      'subscribe',
      { metered: true, region },
      (ack?: any) => opts.onConnected?.(ack)
    );
  };

  const onDisconnect = () => {
    opts.onDisconnected?.();
  };

  // listeners (alineados con tu servidor)
  socket.on('connect', onConnect);
  socket.on('disconnect', onDisconnect);
  socket.on('metered.block_status_updated', handleSingle);
  socket.on('metered.block_bulk', handleBulk); // opcional si lo emites

  // si ya estaba conectado (hot-reload)
  if (socket.connected) onConnect();

  // función de limpieza
  return () => {
    socket.off('connect', onConnect);
    socket.off('disconnect', onDisconnect);
    socket.off('metered.block_status_updated', handleSingle);
    socket.off('metered.block_bulk', handleBulk);
    // si implementas en backend un 'unsubscribe', podrías emitirlo aquí:
    // socket.emit('unsubscribe', { metered: true, region });
  };
}
