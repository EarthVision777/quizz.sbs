"use client"

import { useEffect, useState, type ReactNode } from "react"
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react"
import { OfferCard } from "@/components/offer-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DEFAULT_CTA, type CheckoutCta } from "@/lib/cta"

type Session = { authenticated: boolean; configured: boolean }

export function AdminPanel() {
  const [session, setSession] = useState<Session | null>(null)
  const [cta, setCta] = useState<CheckoutCta>(DEFAULT_CTA)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [saved, setSaved] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void refresh()
  }, [])

  async function refresh() {
    const response = await fetch("/api/admin/session")
    const body = (await response.json()) as Session
    setSession(body)
    if (body.authenticated) {
      const ctaResponse = await fetch("/api/admin/cta")
      if (ctaResponse.ok) setCta((await ctaResponse.json()) as CheckoutCta)
    }
  }

  async function enter() {
    setBusy(true)
    setError("")
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    })
    const body = (await response.json().catch(() => ({}))) as { error?: string }
    setBusy(false)
    if (!response.ok) {
      setError(body.error || "Não foi possível entrar.")
      return
    }
    setPassword("")
    await refresh()
  }

  async function saveCta() {
    setBusy(true)
    setError("")
    setSaved("")
    const response = await fetch("/api/admin/cta", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(cta),
    })
    const body = (await response.json().catch(() => ({}))) as CheckoutCta & { error?: string }
    setBusy(false)
    if (!response.ok) {
      setError(body.error || "Não foi possível salvar a tabela.")
      return
    }
    setCta(body)
    setSaved("Tabela do checkout salva. O quiz já usa esses textos.")
  }

  function updateItem(index: number, value: string) {
    setCta((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => (itemIndex === index ? value : item)),
    }))
  }

  function moveItem(index: number, direction: -1 | 1) {
    setCta((current) => {
      const next = [...current.items]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      return { ...current, items: next }
    })
  }

  if (!session) {
    return <Shell><p className="text-sm text-muted-foreground">Carregando a área admin…</p></Shell>
  }

  if (!session.authenticated) {
    return (
      <Shell>
        <h1 className="font-heading text-2xl font-bold">Admin do checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {session.configured
            ? "Entre com a senha configurada para editar a tabela do checkout."
            : "A senha do admin ainda não está disponível nesta cópia."}
        </p>
        {session.configured ? (
          <>
            <label className="mt-6 block text-sm font-medium" htmlFor="admin-password">Senha</label>
            <Input
              id="admin-password"
              className="mt-2 h-10"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
            <Button className="mt-4 h-10 w-full" disabled={busy} onClick={() => void enter()}>
              Entrar
            </Button>
          </>
        ) : null}
      </Shell>
    )
  }

  return (
    <Shell wide>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">Tabela do checkout</h1>
        <Button variant="outline" onClick={() => void fetch("/api/admin/logout", { method: "POST" }).then(() => refresh())}>
          Sair
        </Button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Tudo que aparece no card do ritual. O card continua surgindo depois do clique para ouvir o vídeo.
      </p>
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            void saveCta()
          }}
        >
          <Field label="Título" value={cta.title} onChange={(title) => setCta({ ...cta, title })} />
          <Field label="Preço antigo" value={cta.comparePrice} onChange={(comparePrice) => setCta({ ...cta, comparePrice })} />
          <Field label="Preço" value={cta.price} onChange={(price) => setCta({ ...cta, price })} />
          <Field label="Linha abaixo do preço" value={cta.note} onChange={(note) => setCta({ ...cta, note })} />
          <Field label="Título da lista" value={cta.itemsLabel} onChange={(itemsLabel) => setCta({ ...cta, itemsLabel })} />
          <div>
            <p className="text-sm font-medium">Itens</p>
            <div className="mt-2 space-y-2">
              {cta.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input className="h-10" value={item} onChange={(event) => updateItem(index, event.target.value)} />
                  <Button type="button" variant="outline" size="icon" aria-label="Subir item" onClick={() => moveItem(index, -1)}>
                    <ArrowUp />
                  </Button>
                  <Button type="button" variant="outline" size="icon" aria-label="Descer item" onClick={() => moveItem(index, 1)}>
                    <ArrowDown />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Remover item"
                    onClick={() => setCta({ ...cta, items: cta.items.filter((_, itemIndex) => itemIndex !== index) })}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={() => setCta({ ...cta, items: [...cta.items, ""] })}
            >
              <Plus /> Adicionar item
            </Button>
          </div>
          <Field label="Texto do botão" value={cta.buttonLabel} onChange={(buttonLabel) => setCta({ ...cta, buttonLabel })} />
          <Field label="Link do checkout" value={cta.checkoutUrl} onChange={(checkoutUrl) => setCta({ ...cta, checkoutUrl })} />
          <p className="-mt-2 text-xs text-muted-foreground">
            Só links https. Vazio: o botão não cobra e mostra a mensagem abaixo.
          </p>
          <Field label="Mensagem sem link" value={cta.pendingMessage} onChange={(pendingMessage) => setCta({ ...cta, pendingMessage })} />
          <label className="block text-sm font-medium" htmlFor="delay">Segundos depois do clique</label>
          <Input
            id="delay"
            className="h-10"
            inputMode="numeric"
            value={String(cta.delaySeconds)}
            onChange={(event) => setCta({ ...cta, delaySeconds: Number(event.target.value.replace(/\D/g, "") || 0) })}
          />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {saved ? <p className="text-sm text-[#00DA37]">{saved}</p> : null}
          <Button type="submit" className="h-10" disabled={busy}>Salvar tabela</Button>
        </form>
        <div>
          <p className="mb-3 text-sm font-medium">Prévia</p>
          <OfferCard cta={cta} onCheckout={() => undefined} />
        </div>
      </div>
    </Shell>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-")
  return (
    <label className="block text-sm font-medium" htmlFor={id}>
      {label}
      <Input
        id={id}
        className="mt-2 h-10"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function Shell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <main className={`mx-auto min-h-dvh px-4 py-8 ${wide ? "max-w-5xl" : "max-w-md"}`}>{children}</main>
  )
}
