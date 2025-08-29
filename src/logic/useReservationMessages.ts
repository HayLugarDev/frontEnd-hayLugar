export type ReservationMessageStatus =
  | "pending"
  | "approved"
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
    client: "Debes aguardar a que el anfitrión apruebe tu reserva para poder utilizar el espacio en la fecha seleccionada.",
    owner: "Tienes una nueva solicitud de reserva pendiente de aprobación.",
  },
  approved: {
    label: "Confirmado",
    client: "Todo está listo para que guardes tu vehículo en el horario seleccionado. Recuerda ser puntual para evitar penalidades.",
    owner: "Has aprobado la reserva. El cliente podrá utilizar el espacio en el horario seleccionado.",
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
    client: "Tu código de acceso ya fue verificado y puedes ingresar al espacio.",
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
  approved: "bg-green-100 text-green-800 border border-green-300",
  cancelled: "bg-red-100 text-red-800 border border-red-300",
  failed: "bg-gray-200 text-gray-700 border border-gray-300",
  verified: "bg-blue-100 text-blue-800 border border-blue-300",
  in_progress: "bg-indigo-100 text-indigo-800 border border-indigo-300",
  completed: "bg-emerald-100 text-emerald-800 border border-emerald-300",
};