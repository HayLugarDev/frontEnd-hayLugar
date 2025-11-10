// Servicio frontend para la vertical Eventos (Vue 3 + TS)
// Autocontenido (crea su propio axios). Si ya tenés un apiService global,
// podés reemplazar "api" por tu instancia existente.

import api from "./apiService";

// ===== Tipos =====
export type EventType = 'festival'|'concert'|'sports'|'fair'|'municipal'|'university'|'other';

export interface EventAsset {
  asset_type: 'pmtiles'|'svg_overlay'|'geojson'|'brochure'|'other';
  url: string;
  version: string;
  meta?: Record<string, any> | null;
}
export interface EventItem {
  id: number;
  name: string;
  type: EventType;
  organizer?: string | null;
  start_date: string;
  end_date: string;
  banner_url?: string | null;
  brand_theme?: Record<string, any> | null;
  assets?: EventAsset[];
}
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface EventZone {
  id: number;
  event_id: number;
  code: string;
  name?: string | null;
  capacity_total: number;
  access_rules?: Record<string, any> | null;
  priority: number;
  is_restricted: boolean;
}
export interface EventAccessPoint {
  id: number;
  event_id: number;
  zone_id?: number | null;
  type: 'vehicle'|'pedestrian'|'vip'|'staff'|'emergency';
  name?: string | null;
  // geom no se usa en UI directamente (lo entrega el backend si hiciera falta)
}
export interface EventDetail extends EventItem {
  description?: string | null;
  zones: EventZone[];
  access_points: EventAccessPoint[];
  assets: EventAsset[];
  public_keys?: { kid: string; alg: 'ES256'|'EdDSA'; public_jwk: Record<string, any>; active?: boolean }[];
}
export interface TicketValidateReq {
  ticket_code: string;
  email?: string;
}
export interface TicketValidateRes {
  valid: boolean;
  provider?: string;
  email?: string | null;
}
export interface CreateReservationReq {
  zone_id: number;
  vehicle_id?: number;
  ticket_code?: string;
  ticket_provider?: 'passline'|'entradauno'|'manual'|'other';
  valid_from: string | Date; // ISO o Date
  valid_to: string | Date;
}
export interface CreateReservationRes {
  id: number;
  event_id: number;
  zone_id: number;
  status: 'pending'|'verified'|'in_progress'|'completed'|'cancelled';
  qr_jti: string;
  qr_token: string; // JWT
}
export interface CheckinReq {
  reservation_id: number;
  mode: 'entry'|'exit';
  zone_id?: number;
  ts?: string | Date;
}
export interface OfflineBatchItem {
  reservation_id: number;
  qr_jti: string;
  mode: 'entry'|'exit';
  zone_id?: number;
  ts: string | Date;
  device_id?: string;
}
export interface ImpactSnapshot {
  event_id: number;
  ts: string;
  occupancy_pct: string;      // viene DECIMAL del backend
  vehicles_active: number;
  avg_wait_seconds: number;
  co2_saved_kg: string;
  local_income_ars: string;
  offline_ops_pct: string;
}

// ===== Helpers =====
const toISO = (d: string | Date | undefined) =>
  d ? (d instanceof Date ? d.toISOString() : d) : undefined;

// ===== Endpoints =====

// Lista paginada de eventos activos (para el dashboard)
export async function listEvents(params?: { page?: number; pageSize?: number }) {
  const { page = 1, pageSize = 50 } = params ?? {};
  const { data } = await api.get<Paginated<EventItem>>('/events', { params: { page, pageSize } });
  return data;
}

// Detalle completo del evento (zonas, accesos, assets, claves)
export async function getEvent(eventId: number) {
  const { data } = await api.get<EventDetail>(`/events/${eventId}`);
  return data;
}

// Zonas
export async function getZones(eventId: number) {
  const { data } = await api.get<EventZone[]>(`/events/${eventId}/zones`);
  return data;
}

// Assets (maps, overlays)
export async function getAssets(eventId: number) {
  const { data } = await api.get<EventAsset[]>(`/events/${eventId}/assets`);
  return data;
}

// Claves públicas (para validación offline client-side si hiciera falta)
export async function getPublicKeys(eventId: number) {
  const { data } = await api.get<{ kid: string; alg: 'ES256'|'EdDSA'; public_jwk: Record<string, any> }[]>(
    `/events/${eventId}/public-keys`
  );
  return data;
}

// Revocaciones de QR (para validación offline)
export async function getRevocations(eventId: number) {
  const { data } = await api.get<{ qr_jti: string; reason?: string; created_at: string }[]>(
    `/events/${eventId}/revocations`
  );
  return data;
}

// Validar ticket (API partner o whitelist)
export async function validateTicket(eventId: number, body: TicketValidateReq) {
  const { data } = await api.post<TicketValidateRes>(`/events/${eventId}/tickets/validate`, body);
  return data;
}

// Crear reserva y obtener QR JWT (la respuesta te dio OK recién)
export async function createReservation(eventId: number, body: CreateReservationReq) {
  const payload = {
    ...body,
    valid_from: toISO(body.valid_from),
    valid_to: toISO(body.valid_to),
  };
  const { data } = await api.post<CreateReservationRes>(`/events/${eventId}/reservations`, payload, {
    headers: { 'Idempotency-Key': crypto.randomUUID() },
  });
  return data;
}

// Check-in online (staff)
export async function checkinOnline(eventId: number, body: CheckinReq) {
  const payload = { ...body, ts: toISO(body.ts) };
  const { data } = await api.post<{ ok: boolean; reservation_id: number; status: string }>(
    `/events/${eventId}/checkin`,
    payload,
    { headers: { 'Idempotency-Key': crypto.randomUUID() } }
  );
  return data;
}

// Check-in offline en lote (sincronización)
export async function checkinOfflineBatch(eventId: number, items: OfflineBatchItem[]) {
  const norm = items.map(i => ({ ...i, ts: toISO(i.ts) }));
  const { data } = await api.post<{ ok: boolean; results: { reservation_id: number; ok: boolean; status?: string; reason?: string }[] }>(
    `/events/${eventId}/checkin/offline`,
    { items: norm },
    { headers: { 'Idempotency-Key': crypto.randomUUID() } }
  );
  return data;
}

// Impacto (último snapshot)
export async function getImpact(eventId: number) {
  const { data } = await api.get<ImpactSnapshot | null>(`/events/${eventId}/impact`);
  return data;
}

// Serie de impacto (para charts)
export async function getImpactSeries(eventId: number, opts?: { from?: string|Date; to?: string|Date }) {
  const params: any = {};
  if (opts?.from) params.from = toISO(opts.from);
  if (opts?.to)   params.to   = toISO(opts.to);
  const { data } = await api.get<ImpactSnapshot[]>(`/events/${eventId}/impact/series`, { params });
  return data;
}
