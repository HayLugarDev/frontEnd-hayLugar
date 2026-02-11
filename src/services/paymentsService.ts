import api from './apiService';

// =======================
// CAPTURE QUOTE (UUID)
// =======================
export async function getCaptureQuote(uuid: string) {
  const { data } = await api.get(
    `/reservations/u/${uuid}/capture-quote`,
    { withCredentials: true }
  );

  return data as {
    reservation_uuid: string;
    currency: "ARS";
    base_cents: number;
    penalty_cents: number;
    final_cents: number;
    hold_cents: number;
    remainder_cents: number;
    config: {
      grace_min: number;
      multiplier: number;
      max_factor: number;
    };
    info: string;
  };
}

// =======================
// CAPTURAR PAGO (UUID)
// =======================
export async function captureReservationPayment(
  uuid: string,
  opts?: {
    final_amount_cents?: number;
    reason?: string;
  }
) {
  const body: any = {};

  if (typeof opts?.final_amount_cents === 'number') {
    body.final_amount_cents = opts.final_amount_cents;
  }

  if (opts?.reason) {
    body.reason = opts.reason;
  }

  const { data } = await api.post(
    `/payments/u/${uuid}/capture`,
    body,
    { withCredentials: true }
  );

  return data; // { message, capture, info? }
}
