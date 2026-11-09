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
  comparePrice: "$150",
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
  checkoutUrl: "",
  pendingMessage: "El enlace de pago está pendiente. No se realizó ningún cobro.",
  delaySeconds: 10,
}

type CtaRow = {
  title: string
  compare_price: string
  price: string
  note: string
  items_label: string
  items: unknown
  button_label: string
  checkout_url: string
  pending_message: string
  delay_seconds: number
}

export function ctaFromRow(row: CtaRow): CheckoutCta {
  return {
    title: row.title,
    comparePrice: row.compare_price,
    price: row.price,
    note: row.note,
    itemsLabel: row.items_label,
    items: parseItems(row.items),
    buttonLabel: row.button_label,
    checkoutUrl: row.checkout_url,
    pendingMessage: row.pending_message,
    delaySeconds: Number(row.delay_seconds),
  }
}

function parseItems(value: unknown) {
  const source = typeof value === "string" ? safeJson(value) : value
  if (!Array.isArray(source)) return []
  return source.filter((item): item is string => typeof item === "string")
}

function safeJson(value: string) {
  try {
    return JSON.parse(value) as unknown
  } catch {
    return []
  }
}

export function parseCta(input: unknown): CheckoutCta | string {
  if (!input || typeof input !== "object") return "Os dados do checkout não chegaram."
  const body = input as Record<string, unknown>
  const title = text(body.title, 120)
  const comparePrice = text(body.comparePrice, 40)
  const price = text(body.price, 40)
  const note = text(body.note, 200)
  const itemsLabel = text(body.itemsLabel, 80)
  const buttonLabel = text(body.buttonLabel, 80)
  const pendingMessage = text(body.pendingMessage, 240)
  const checkoutUrl = text(body.checkoutUrl, 500)
  if (!title || !price || !buttonLabel) return "Título, preço e botão precisam de texto."
  if (!Array.isArray(body.items) || body.items.length > 20) return "A lista aceita até 20 itens."
  const items = body.items.map((item) => text(item, 160))
  if (items.some((item) => !item)) return "Cada item da lista precisa de texto."
  const delaySeconds = Number(body.delaySeconds)
  if (!Number.isInteger(delaySeconds) || delaySeconds < 0 || delaySeconds > 600) {
    return "Os segundos do checkout ficam entre 0 e 600."
  }
  if (checkoutUrl && !isHttpUrl(checkoutUrl)) return "O link do checkout precisa começar com https://."
  return {
    title,
    comparePrice,
    price,
    note,
    itemsLabel,
    items,
    buttonLabel,
    checkoutUrl,
    pendingMessage,
    delaySeconds,
  }
}

function text(value: unknown, max: number) {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, max)
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "https:"
  } catch {
    return false
  }
}
