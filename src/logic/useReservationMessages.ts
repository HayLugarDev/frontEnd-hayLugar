export type ReservationMessageStatus =
  | "pending"
  | "payment_pending"
  | "payment_approved"
  | "failed"
  | "verified"
  | "in_progress"
  | "completed"
  | "cancelled";

type ReservationRole = "client" | "owner";

export const reservationMessages: Record<
  ReservationMessageStatus,
  {
    label: string;
    client: string;
    owner: string;
  }
> = {
  pending: {
    label: "Pendiente",
    client: "Debes aguardar a que el anfitrión apruebe tu reserva para poder utilizar el espacio en la fecha y hora seleccionada.",
    owner: "Tienes una nueva solicitud de reserva pendiente de aprobación.\n\nRevisa los detalles y aprueba o rechaza la solicitud.",
  },
  payment_pending: {
    label: "Pago pendiente",
    client: "Tu reserva ha sido aprobada por el anfitrión. Debes realizar el pago para confirmar tu reserva y recibir el código de check-in.",
    owner: "El cliente debe realizar el pago para confirmar la reserva.\n\nUna vez que el pago sea aprobado, el usuario recibirá el código de check-in para ingresar a tu espacio.",
  },
  payment_approved: {
    label: "Confirmado",
    client: "Todo está listo para que guardes tu vehículo en el horario selecc",
    owner: "Has aprobado la reserva. El cliente podrá utilizar el espacio en el horario seleccionado una vez que realice el check-in.",
  },
  cancelled: {
    label: "Rechazado",
    client: "Lamentablemente el anfitrión no podrá recibir tu vehículo en la fecha seleccionada.",
    owner: "Has rechazado la reserva. El cliente ha sido notificado.",
  },
  failed: {
    label: "Fallida",
    client: "Hubo un error al procesar la solicitud de la reserva. Intenta nuevamente o comunícate con soporte.",
    owner: "No se pudo procesar la reserva del cliente.",
  },
  verified: {
    label: "Verificada",
    client: "Tu código de acceso ya fue verificado y puedes ingresar al espacio en cuanto el Anfitrión te de acceso.",
    owner: "El cliente ha realizado el check-in correctamente.",
  },
  in_progress: {
    label: "En progreso",
    client: "Tu vehículo se encuentra estacionado en el espacio reservado.",
    owner: "El cliente está utilizando el espacio en este momento.",
  },
  completed: {
    label: "Finalizada",
    client: "Completaste correctamente tu retiro de vehículo.",
    owner: "La reserva ha finalizado correctamente.",
  },
};

export const statusColors: Record<ReservationMessageStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  payment_pending: "bg-orange-100 text-orange-800 border border-orange-300",
  payment_approved: "bg-green-100 text-green-800 border border-green-300",
  cancelled: "bg-red-100 text-red-800 border border-red-300",
  failed: "bg-gray-200 text-gray-700 border border-gray-300",
  verified: "bg-blue-100 text-blue-800 border border-blue-300",
  in_progress: "bg-indigo-100 text-indigo-800 border border-indigo-300",
  completed: "bg-emerald-100 text-emerald-800 border border-emerald-300",
};