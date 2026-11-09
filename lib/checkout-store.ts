import { ctaFromRow, type CheckoutCta } from "@/lib/cta"
import { sql } from "@/lib/db"

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

export async function readCta(): Promise<CheckoutCta> {
  const rows = await sql<CtaRow>(
    `select title, compare_price, price, note, items_label, items, button_label, checkout_url, pending_message, delay_seconds
     from checkout_cta where id = 1`,
  )
  const row = rows[0]
  if (!row) throw new Error("checkout vazio")
  return ctaFromRow(row)
}

export async function writeCta(cta: CheckoutCta) {
  await sql(
    `update checkout_cta set
      title = $1,
      compare_price = $2,
      price = $3,
      note = $4,
      items_label = $5,
      items = $6,
      button_label = $7,
      checkout_url = $8,
      pending_message = $9,
      delay_seconds = $10,
      updated_at = now()
     where id = 1`,
    [
      cta.title,
      cta.comparePrice,
      cta.price,
      cta.note,
      cta.itemsLabel,
      JSON.stringify(cta.items),
      cta.buttonLabel,
      cta.checkoutUrl,
      cta.pendingMessage,
      cta.delaySeconds,
    ],
  )
}
