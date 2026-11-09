"use client"

import { useEffect, useRef, useState } from "react"
import Hls from "hls.js"
import { Check } from "lucide-react"

const VSL_SRC =
  "https://cdn.converteai.net/31957ec3-9250-4adb-93eb-bb2b4086c66f/69bc5bdaacddada823a9149b/main.m3u8"

const INCLUDED = [
  "Tu ritual 100% personalizado",
  "3 regalos especiales",
  "1 regalo secreto",
  "Garantía incondicional de 30 días",
  "Acceso de por vida",
]

export function Offer({ you }: { you: string }) {
  const [pending, setPending] = useState(false)
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const player = video.current
    if (!player) return
    if (player.canPlayType("application/vnd.apple.mpegurl")) {
      player.src = VSL_SRC
      return
    }
    if (!Hls.isSupported()) return
    const hls = new Hls()
    hls.loadSource(VSL_SRC)
    hls.attachMedia(player)
    return () => hls.destroy()
  }, [])

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
      <video
        ref={video}
        className="mb-8 aspect-[3/4] w-full max-w-[400px] rounded-xl bg-black object-cover"
        controls
        playsInline
        preload="metadata"
      />
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
    </div>
  )
}
