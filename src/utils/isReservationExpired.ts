export default function isReservationExpired(reservation: any) {
  const now = Date.now();
  const end = new Date(reservation.end_time).getTime();
  return now > end;
}
