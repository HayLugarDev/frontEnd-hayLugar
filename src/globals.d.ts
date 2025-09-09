// src/types/globals.d.ts
export {};

declare global {
  interface Window {
    MercadoPago: any;
    cardPaymentBrickController?: any; // ← tipo único y consistente
  }
}
