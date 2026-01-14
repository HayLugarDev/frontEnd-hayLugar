import api from "./apiService";

// =======================
// GET RESERVA POR UUID
// =======================
export async function getReservationByUuid(uuid: string) {
  const { data } = await api.get(
    `/reservations/u/${uuid}`,
    { withCredentials: true }
  );
  return data;
}

// =======================
// CREAR RESERVA
// =======================
export async function createReservation(payload: any) {
  const { data } = await api.post(
    "/reservations/create",
    payload,
    { withCredentials: true }
  );

  return data.reservation;
}

// =======================
// INFO PARA PAGO (UUID)
// =======================
export async function getReservationForPayment(uuid: string) {
  const { data } = await api.get(
    `/reservations/u/${uuid}/payment`,
    { withCredentials: true }
  );

  return data;
}

// =======================
// ACTUALIZAR DATOS DE PAGO
// =======================
interface PaymentData {
  payment_method: string,
  payment_data: {
      invoice_name: string,
      invoice_dni: string,
      invoice_address: string,
      invoice_email: string,
    },
  service_fee_cents: number,
  guest_total_cents: number
}

export async function updateReservationPaymentData(uuid: string, paymentData: PaymentData) {
  const { data } = await api.put(
    `/reservations/u/${uuid}/payment-data`, paymentData,
    { withCredentials: true }
  );

  return data;
}
