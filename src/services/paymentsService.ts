// src/services/paymentsService.ts
import api from './apiService';

export async function getCaptureQuote(reservationId: number) {
  const { data } = await api.get(`/reservations/${reservationId}/capture-quote`, { withCredentials: true });
  return data as {
    reservation_id: number;
    currency: "ARS";
    base_cents: number;
    penalty_cents: number;
    final_cents: number;
    hold_cents: number;
    remainder_cents: number;
    config: { grace_min: number; multiplier: number; max_factor: number };
    info: string;
  };
}

export async function captureReservationPayment(
  reservationId: number,
  opts?: { final_amount_cents?: number; reason?: string }
) {
  const body: any = {};
  if (typeof opts?.final_amount_cents === 'number') body.final_amount_cents = opts.final_amount_cents;
  if (opts?.reason) body.reason = opts.reason;

  const { data } = await api.post(`/payments/${reservationId}/capture`, body, { withCredentials: true });
  return data; // { message, capture, info? }
}
