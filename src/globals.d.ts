export {};

declare global {
  interface Window {
    MercadoPago: any;
    cardPaymentBrickController: any;
  }
}
