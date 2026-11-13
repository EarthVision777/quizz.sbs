"use client"

import { useEffect, useRef, useState } from "react"
import { Pause } from "lucide-react"
import { OfferCard } from "@/components/offer-card"
import { DEFAULT_CTA } from "@/lib/cta"
import { displayName } from "@/lib/reading"
import type { Answers } from "@/lib/storage"

const VSL_SRC =
  "https://res.cloudinary.com/dyvzcsbc/video/upload/q_auto:best,br_900k,vc_h264:high,w_540,c_limit/v1794200638/VSL_LHAMA_ETERNA.mp4"

export function Offer({ you, answers }: { you: string; answers: Answers }) {
  const love = displayName(answers.love, "esa persona")
  const contact = answers.contact
  const player = useRef<HTMLVideoElement>(null)
  const [listening, setListening] = useState(false)
  const [checkoutReady, setCheckoutReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [pending, setPending] = useState(false)
  const cta = DEFAULT_CTA

  useEffect(() => {
    const video = player.current
    if (!video) return
    video.muted = true
    void video.play().catch(() => {})
  }, [])

  useEffect(() => {
    if (!listening) return
    const timer = window.setTimeout(() => setCheckoutReady(true), cta.delaySeconds * 1000)
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
    if (video.paused) {
      void video.play().catch(() => {})
      setPaused(false)
    } else {
      video.pause()
      setPaused(true)
    }
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
        <span className="text-foreground">esto sigue con {love}</span>
      </h1>
      <div className="mb-8 w-full space-y-3 text-left">
        <p className="text-base leading-relaxed text-muted-foreground">
          El video explica el Ritual de la Llama Eterna: qué incluye y cómo se paga. Es una guía simbólica. No obliga a {love} a volver.
        </p>
        {contact ? (
          <p className="text-base leading-relaxed text-muted-foreground">
            Tú contaste que el contacto hoy es este: {contact.charAt(0).toLocaleLowerCase("es")}
            {contact.slice(1)}.
          </p>
        ) : null}
        <p className="text-base font-medium leading-relaxed text-foreground">
          Activa el sonido. El botón de pago aparece unos segundos después.
        </p>
      </div>
      <div className="mb-8 w-full max-w-[400px]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-black">
          <video
            ref={player}
            className="size-full object-contain"
            src={VSL_SRC}
            poster="/vsl-poster.webp"
            autoPlay
            muted
            playsInline
            preload="auto"
            onTimeUpdate={tick}
            onPlay={() => setPaused(false)}
            onPause={() => setPaused(true)}
            onClick={listening ? togglePlayback : undefined}
          />
          {listening && paused ? (
            <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden>
              <span className="grid size-16 place-items-center rounded-full bg-black/55 text-white">
                <Pause className="size-8 fill-white" />
              </span>
            </div>
          ) : null}
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
        <OfferCard
          cta={cta}
          notice={pending ? cta.pendingMessage : undefined}
          onCheckout={() => {
            if (cta.checkoutUrl) {
              window.location.assign(cta.checkoutUrl)
              return
            }
            setPending(true)
          }}
        />
      ) : null}
    </div>
  )
}
