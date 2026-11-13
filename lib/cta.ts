export type CheckoutCta = {
  title: string
  comparePrice: string
  price: string
  note: string
  itemsLabel: string
  items: string[]
  buttonLabel: string
  checkoutUrl: string
  pendingMessage: string
  delaySeconds: number
}

export const DEFAULT_CTA: CheckoutCta = {
  title: "Ritual de la Llama Eterna",
  comparePrice: "$650",
  price: "$17.85",
  note: "Pago único, sin cuotas mensuales",
  itemsLabel: "Recibirás:",
  items: [
    "Tu ritual 100% personalizado",
    "3 regalos especiales",
    "1 regalo secreto",
    "Garantía incondicional de 30 días",
    "Acceso de por vida",
  ],
  buttonLabel: "Continuar al pago",
  checkoutUrl: "https://go.centerpag.com/PPU38CQHNTS",
  pendingMessage: "El enlace de pago está pendiente. No se realizó ningún cobro.",
  delaySeconds: 10,
}
