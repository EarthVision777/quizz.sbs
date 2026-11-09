"use client"

import { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"

const VSL_SRC = "https://res.cloudinary.com/dyvzcsbc/video/upload/v1794200638/VSL_LHAMA_ETERNA.mp4"

const INCLUDED = [
  "Tu ritual 100% personalizado",
  "3 regalos especiales",
  "1 regalo secreto",
  "Garantía incondicional de 30 días",
  "Acceso de por vida",
]

export function Offer({ you }: { you: string }) {
  const player = useRef<HTMLVideoElement>(null)
  const [listening, setListening] = useState(false)
  const [checkoutReady, setCheckoutReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    const video = player.current
    if (!video) return
    video.muted = true
    void video.play().catch(() => {})
  }, [])

  useEffect(() => {
    if (!listening) return
    const timer = window.setTimeout(() => setCheckoutReady(true), 37000)
    return () => window.clearTimeout(timer)
  }, [listening])

  function listen() {
    const video = player.current
    if (!video || listening) return
    video.muted = false
    void video.play().catch(() => {})
    setListening(true)
  }

  function togglePlayback() {
    const video = player.current
    if (!video) return
    if (video.paused) void video.play().catch(() => {})
    else video.pause()
  }

  function tick() {
    const video = player.current
    if (!video || !video.duration) return
    setProgress((video.currentTime / video.duration) * 100)
  }

  return (
    <div className="flex flex-col items-center px-6 pt-10 pb-8 text-center">
      <h1 className="mb-6 text-2xl font-bold">
        <span className="text-red-400">{you}</span>
        <br />
        <span className="text-foreground">tu ritual está listo!</span>
      </h1>
      <div className="mb-8 w-full space-y-3">
        <p className="text-base text-muted-foreground">🔥 No importa si te bloqueó.</p>
        <p className="text-base text-muted-foreground">🔥 No importa si está con otra.</p>
        <p className="text-base text-muted-foreground">
          ❌ Sin karma negativo ni ninguna consecuencia mala para ti ni para él.
        </p>
      </div>
      <p className="mb-4 text-base font-medium leading-relaxed text-foreground">
        Mira el video a continuación y descubre cómo acceder a tu ritual y comenzar ahora mismo 👇
      </p>
      <div className="mb-8 w-full max-w-[400px]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-black">
          <video
            ref={player}
            className="size-full object-contain"
            src={VSL_SRC}
            autoPlay
            muted
            playsInline
            preload="metadata"
            onTimeUpdate={tick}
            onClick={listening ? togglePlayback : undefined}
          />
          {listening ? null : (
            <button
              type="button"
              className="absolute inset-0 grid place-items-center"
              onClick={listen}
            >
              <span className="grid w-[78%] max-w-[280px] justify-items-center bg-white px-5 py-6">
                <span className="vsl-stroke text-[1.7rem] leading-[1.05]">
                  Tu video
                  <br />
                  ya comenzó
                </span>
                <svg viewBox="0 0 24 24" className="my-3 size-14 text-[#3b0764]" aria-hidden>
                  <path fill="currentColor" d="M4 2.5 4 17.2 8.4 12.8 12.2 20.2 15.1 18.9 11.2 11.4 17.2 11.2Z" />
                </svg>
                <span className="vsl-stroke text-[1.7rem] leading-[1.05]">
                  Haz clic
                  <br />
                  para escuchar
                </span>
              </span>
            </button>
          )}
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20" aria-hidden>
          <div className="h-full bg-white" style={{ width: `${progress}%` }} />
        </div>
      </div>
      {checkoutReady ? (
        <div className="emoji-card emoji-card--no-glow w-full" style={{ ["--emoji-rounded" as string]: "16px" }}>
          <div className="emoji-card__content flex flex-col overflow-hidden">
            <div className="px-5 py-6">
              <h2 className="mb-5 text-center text-xl font-bold text-foreground">Ritual de la Llama Eterna</h2>
              <p className="mb-5 text-center text-sm text-[hsl(0_0%_40%)]">Pago único, sin cuotas mensuales</p>
              <div className="mb-5 space-y-2.5 text-left">
                <p className="text-sm font-semibold text-foreground">Recibirás:</p>
                {INCLUDED.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#00DA37]" aria-hidden />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="glow-button-wrapper">
                <button type="button" className="glow-button" onClick={() => setPending(true)}>
                  <span className="glow-button__text">Continuar al pago</span>
                </button>
              </div>
              {pending ? (
                <p role="status" className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  El enlace de pago está pendiente. No se realizó ningún cobro.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
