"use client"

import { Check } from "lucide-react"
import type { CheckoutCta } from "@/lib/cta"

export function OfferCard({
  cta,
  onCheckout,
  notice,
}: {
  cta: CheckoutCta
  onCheckout: () => void
  notice?: string
}) {
  return (
    <div className="emoji-card emoji-card--no-glow w-full" style={{ ["--emoji-rounded" as string]: "16px" }}>
      <div className="emoji-card__content flex flex-col overflow-hidden">
        <div className="px-5 py-6">
          <h2 className="mb-4 text-center text-xl font-bold text-foreground">{cta.title}</h2>
          {cta.comparePrice ? (
            <p className="text-center text-base text-[hsl(0_0%_62%)] line-through decoration-[hsl(0_0%_78%)] decoration-2">
              {cta.comparePrice}
            </p>
          ) : null}
          <p className="mb-1 text-center text-4xl font-bold tracking-tight text-foreground">{cta.price}</p>
          {cta.note ? (
            <p className="mb-5 text-center text-sm text-[hsl(0_0%_40%)]">{cta.note}</p>
          ) : (
            <div className="mb-5" />
          )}
          <div className="mb-5 space-y-2.5 text-left">
            {cta.itemsLabel ? <p className="text-sm font-semibold text-foreground">{cta.itemsLabel}</p> : null}
            {cta.items.map((item, index) => (
              <div key={`${index}-${item}`} className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-[#00DA37]" aria-hidden />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
          <div className="glow-button-wrapper">
            <button type="button" className="glow-button" onClick={onCheckout}>
              <span className="glow-button__text">{cta.buttonLabel}</span>
            </button>
          </div>
          {notice ? (
            <p role="status" className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {notice}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
