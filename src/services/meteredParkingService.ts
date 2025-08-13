// services/meteredParkingService.ts
import api from './apiService';

export type MeteredStatus = 'free' | 'limited' | 'full' | 'unknown';

export type MeteredBlockDTO = {
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
  availability_pct: number | null; // 0..100
  length_m: number;
  pricing: { price_per_hour: number; currency: string | null } | null;
  sensors: { count: number; source: string | null };
  active: boolean;
  updated_at: string;
};

type ListFilters = {
  country_code?: string;
  admin1?: string;
  city?: string;
  status?: MeteredStatus;
  active?: boolean;
  q?: string;
  limit?: number;
  offset?: number;
};

type UpdateBlockPayload = {
  id: number;
  status?: MeteredStatus;
  availability_pct?: number | null;
  sensor_count?: number;
  price_per_hour?: number | null;
  currency?: string | null;
};

function toQuery(params: Record<string, any>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    q.append(k, String(v));
  });
  return q.toString();
}

export const meteredParkingService = {
  /**
   * Lista bloques de estacionamiento medido (filtrable por región/estado/búsqueda)
   * GET /api/metered/blocks
   */
  async getBlocks(filters: ListFilters = {}): Promise<MeteredBlockDTO[]> {
    const qs = toQuery(filters);
    const { data } = await api.get(`/metered/blocks${qs ? `?${qs}` : ''}`);
    return data?.data ?? [];
  },

  /**
   * Actualiza un bloque (estado, disponibilidad, sensores, pricing)
   * POST /api/metered/update  { id, ... }
   * Emite evento socket: "metered.block_status_updated"
   */
  async updateBlock(payload: UpdateBlockPayload): Promise<MeteredBlockDTO> {
    const { data } = await api.post('/metered/update', payload);
    return data?.data;
  },

  /**
   * Actualiza varios bloques en batch
   * POST /api/metered/update  [ { id, ... }, ... ]
   * Emite N eventos socket: "metered.block_status_updated"
   */
  async updateBlocksBatch(updates: UpdateBlockPayload[]): Promise<MeteredBlockDTO[]> {
    const { data } = await api.post('/metered/update', updates);
    return data?.data ?? [];
  },

  /**
   * Suscripción a tiempo real (Socket.IO)
   * - Llama a socket.emit('subscribe', { metered: true, region })
   * - Registra handler para 'metered.block_status_updated'
   * Devuelve una función para desuscribir handlers.
   */
  subscribeToRealtime(options: {
    socket: any; // instancia de socket.io-client ya conectada
    region?: { country_code?: string; admin1?: string; city?: string };
    onUpdate: (dto: MeteredBlockDTO) => void;
  }) {
    const { socket, region, onUpdate } = options;

    const handler = (dto: MeteredBlockDTO) => onUpdate(dto);

    // unirse a rooms (global y/o region)
    socket.emit('subscribe', {
      metered: true,
      region: {
        country_code: region?.country_code,
        admin1: region?.admin1,
        city: region?.city,
      },
    });

    socket.on('metered.block_status_updated', handler);

    // función de cleanup
    return () => {
      socket.off('metered.block_status_updated', handler);
      // opcional: también podrías emitir 'unsubscribe' si implementaste ese handler en backend
      // socket.emit('unsubscribe', { metered: true, region });
    };
  },
};
