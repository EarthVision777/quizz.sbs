"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { ArrowLeft, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PHOTOS, Scene } from "@/components/scene"
import { Offer } from "@/components/offer"
import { dateError, displayName, nameError } from "@/lib/reading"
import {
  getEmptySave,
  readSave,
  subscribeSave,
  writeSave,
  type Answers,
} from "@/lib/storage"

const HURT = [
  { label: "Me dolió desde el primer día", scene: "regret" },
  { label: "Al principio intenté aceptarlo, pero pronto empecé a extrañarlo", scene: "soon" },
  { label: "Tardé en sentirlo, y hoy siento un vacío grande", scene: "late" },
  { label: "No le di mucha importancia", scene: "shrug" },
]

const REGRET = [
  { label: "Me arrepentí enseguida", scene: "regret" },
  { label: "Intenté seguir, pero pronto me arrepentí", scene: "soon" },
  { label: "Tardé en sentirlo, pero hoy me arrepiento", scene: "late" },
  { label: "No le di mucha importancia", scene: "shrug" },
]

export function Quiz() {
  const save = useSyncExternalStore(subscribeSave, readSave, getEmptySave)
  const sound = useSound()
  const scroller = useRef<HTMLDivElement>(null)
  const index = save.index
  const answers = save.answers

  function jump(nextIndex: number, nextAnswers: Answers = answers) {
    writeSave({ index: nextIndex, answers: nextAnswers })
    scroller.current?.scrollTo({ top: 0 })
    sound.play()
  }

  function pick(key: string, value: string) {
    const next = { ...answers, [key]: value }
    if (key === "who") delete next.after
    jump(index + 1, next)
  }

  useEffect(() => {
    for (const src of Object.values(PHOTOS)) {
      const img = new Image()
      img.src = src
    }
  }, [])

  const showTools = index < 21
  const showBack = index > 0 && index < 21
  const progress = barValue(index)

  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-950">
      <div className="flex h-dvh w-full flex-col overflow-hidden md:h-[844px] md:max-h-[90vh] md:w-[390px] md:rounded-3xl md:border md:border-white/10 md:shadow-[0_0_60px_rgba(0,0,0,0.5)]">
        <div ref={scroller} className="quiz-bg relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {showTools ? (
            <div
              className="absolute inset-x-0 top-0 z-20 h-2 bg-white/10"
              role="progressbar"
              aria-label="Progreso del cuestionario"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
            >
              <div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${progress}%` }} />
            </div>
          ) : null}
          {showTools ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={sound.enabled ? "Desactivar sonido" : "Activar sonido"}
              className="absolute top-4 right-4 z-30 rounded-full bg-black/50 text-muted-foreground backdrop-blur-sm hover:text-foreground"
              onClick={sound.toggle}
            >
              {sound.enabled ? <Volume2 /> : <VolumeX />}
            </Button>
          ) : null}
          {showBack ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Volver"
              className="absolute top-4 left-4 z-30 rounded-full bg-black/50 text-muted-foreground backdrop-blur-sm hover:text-foreground"
              onClick={() => jump(index - 1)}
            >
              <ArrowLeft />
            </Button>
          ) : null}

          <div key={index} className="animate-slide-up flex min-h-full flex-1 flex-col">
            <Step
              index={index}
              answers={answers}
              onPick={pick}
              onJump={jump}
            />
            <footer className="mt-auto flex flex-col items-center gap-1 border-t border-white/10 bg-black/40 px-6 py-3 text-muted-foreground/70 backdrop-blur-xl">
              <img src="/logo.png" alt="" className="h-10 w-auto" />
              <span className="font-heading text-lg text-foreground/80">Llama Eterna</span>
              <span className="text-xs">© 2026 - Ritual de la Llama Eterna.</span>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}

function barValue(index: number) {
  if (index <= 0) return 0
  return Math.min(100, (index / 20) * 100)
}

function Step({
  index,
  answers,
  onPick,
  onJump,
}: {
  index: number
  answers: Answers
  onPick: (key: string, value: string) => void
  onJump: (index: number, answers?: Answers) => void
}) {
  const you = displayName(answers.you, "")

  switch (index) {
    case 0:
      return <Landing onStart={() => onJump(1)} />
    case 1:
      return (
        <ImageStep
          title="¿Cuál de estas situaciones describe mejor por qué se separaron?"
          options={[
            { label: "Discutíamos mucho", scene: "argue" },
            { label: "La relación se fue enfriando", scene: "fade" },
            { label: "Se fue con otra persona", scene: "other" },
            { label: "Los celos nos ganaron", scene: "jealousy" },
          ]}
          allowOther
          onPick={(value) => onPick("reason", value)}
        />
      )
    case 2:
      return (
        <EmojiStep
          scene="clock"
          title="¿Hace cuánto intentas acercarte de nuevo?"
          options={[
            ["Hace algunos días", "🤦"],
            ["Hace algunas semanas", "😩"],
            ["Hace algunos meses", "😭"],
            ["Hace más de un año", "💔"],
          ]}
          onPick={(value) => onPick("time", value)}
        />
      )
    case 3:
      return (
        <ImageStep
          title="¿Cómo está el contacto entre ustedes hoy?"
          options={[
            { label: "No, me bloqueó de todas partes", scene: "blocked" },
            { label: "Perdimos el contacto", scene: "lost" },
            { label: "Hablamos muy rara vez", scene: "rare" },
            { label: "A veces hablamos, pero de forma fría", scene: "chilly" },
            { label: "Aún hablamos con frecuencia", scene: "often" },
          ]}
          onPick={(value) => onPick("contact", value)}
        />
      )
    case 4:
      return (
        <EmojiStep
          scene="couple"
          title="¿Cómo se sentía la relación al principio?"
          options={[
            ["Era intenso y siempre tuvimos mucha conexión", "🔥"],
            ["Inestable, a veces cercano, a veces frío", "❌"],
            ["Él casi no mostraba lo que sentía", "🧊"],
          ]}
          onPick={(value) => onPick("beginning", value)}
        />
      )
    case 5:
      return (
        <EmojiStep
          scene="door"
          title="¿Quién decidió terminar?"
          options={[
            ["Yo", "👩"],
            ["Él", "👨"],
            ["Fue una decisión de ambos", "💔"],
          ]}
          onPick={(value) => onPick("who", value)}
        />
      )
    case 6:
      return (
        <ImageStep
          title="¿Qué sentiste después de la ruptura?"
          options={answers.who === "Él" ? HURT : REGRET}
          onPick={(value) => onPick("after", value)}
        />
      )
    case 7:
      return (
        <EmojiStep
          scene="candle"
          title="¿Ya habías buscado una simpatía o un ritual para esta historia?"
          options={[
            ["Sí, probé rituales que vi en internet", "🧙"],
            ["Sí, pagué otros trabajos y no sentí un cambio", "🕯️"],
            ["Todavía no. Es la primera vez que busco algo así", "💔"],
          ]}
          onPick={(value) => onPick("tried", value)}
        />
      )
    case 8:
      return (
        <TextStep
          scene="spirit"
          title="¿Cómo te llamas?"
          placeholder="Tu nombre"
          initial={answers.you ?? ""}
          validate={nameError}
          onSubmit={(value) => onPick("you", value)}
        />
      )
    case 9:
      return (
        <TextStep
          scene="beloved"
          title="¿Cómo se llama la persona que amas?"
          placeholder="Su nombre"
          initial={answers.love ?? ""}
          validate={nameError}
          onSubmit={(value) => onPick("love", value)}
        />
      )
    case 10:
      return (
        <TextStep
          title="¿Cuál es tu fecha de nacimiento?"
          placeholder="DD/MM/AAAA"
          initial={answers.birth ?? ""}
          mask="date"
          validate={dateError}
          onSubmit={(value) => onPick("birth", value)}
        />
      )
    case 11:
      return <Guide onNext={() => onJump(12)} />
    case 12:
      return (
        <EmojiStep
          title="¿Qué es lo que más te duele de esta historia?"
          note={
            <>
              {you || "Tú"}, faltan unas preguntas para preparar el video de tu ritual.
            </>
          }
          options={[
            ["Me ignora, como si lo nuestro no hubiera existido", "😢"],
            ["Está con otra persona y eso me duele", "💔"],
            ["Intento acercarme y siento que nada cambia", "💥"],
            ["El miedo a que me rechace me detiene", "😩"],
            ["Un poco de todo eso", "🤦‍♀️"],
          ]}
          onPick={(value) => onPick("pain", value)}
        />
      )
    case 13:
      return (
        <EmojiStep
          scene="pair"
          title="¿Qué crees que está impidiendo un acercamiento?"
          options={[
            ["Nos falta hablar con calma", "❌"],
            ["Quedaron heridas del pasado", "💔"],
            ["Hay otras personas en medio", "👫"],
            ["No tengo claro el motivo", "😢"],
          ]}
          onPick={(value) => onPick("why", value)}
        />
      )
    case 14:
      return (
        <ImageStep
          title={`${you || "Tú"}, ¿qué sientes cuando recuerdas el final?`}
          options={[
            { label: "Tristeza profunda", scene: "sad" },
            { label: "Ansiedad", scene: "anxious" },
            { label: "Rabia", scene: "anger" },
            { label: "No siento nada", scene: "empty" },
          ]}
          onPick={(value) => onPick("feeling", value)}
        />
      )
    case 15:
      return (
        <EmojiStep
          scene="replay"
          title="¿Vuelves a revivir momentos de la relación en tu cabeza?"
          options={[
            ["Sí, todos los días", "💭"],
            ["Sí, a veces", "🤔"],
            ["Rara vez", "🤔"],
            ["Casi nunca", "❌"],
          ]}
          onPick={(value) => onPick("replay", value)}
        />
      )
    case 16:
      return (
        <EmojiStep
          scene="phone"
          title="¿Revisas las redes de tu ex?"
          options={[
            ["Sí, todos los días", "📱"],
            ["Sí, a veces", "🤔"],
            ["Rara vez", "🤔"],
            ["No, no estoy pendiente", "❌"],
          ]}
          onPick={(value) => onPick("social", value)}
        />
      )
    case 17:
      return (
        <ImageStep
          title="¿Esta situación está tocando otras partes de tu vida?"
          options={[
            { label: "Sí, mi ánimo", scene: "health" },
            { label: "Sí, mi trabajo", scene: "work" },
            { label: "Sí, duermo mal", scene: "sleep" },
            { label: "Sí, en varias de esas áreas", scene: "all" },
          ]}
          onPick={(value) => onPick("areas", value)}
        />
      )
    case 18:
      return (
        <EmojiStep
          scene="wish"
          title="¿Qué intención quieres poner en este ritual?"
          options={[
            ["Volver a sentir cercanía con él", ""],
            ["Poder hablar de lo que pasó", ""],
            ["Soltar el miedo a que esté con otra persona", ""],
            ["Las tres cosas", ""],
          ]}
          onPick={(value) => onPick("wish", value)}
        />
      )
    case 19:
      return (
        <EmojiStep
          scene="today"
          title="Si hoy pudieras tener una conversación honesta con él, ¿la tendrías?"
          options={[
            ["Sí, la tendría ahora", "😍"],
            ["Sí, pero quiero ir con calma", "👫"],
            ["Ahora no me siento lista", "🥱"],
          ]}
          onPick={(value) => onPick("today", value)}
        />
      )
    case 20:
      return <Finale you={you || "Tú"} onDone={() => onJump(21)} />
    default:
      return <Offer you={you || "Querida"} answers={answers} />
  }
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <img
        src="/ritual.webp"
        alt="Vela roja, manzana y pétalos de rosa"
        className="min-h-0 w-full flex-1 object-cover object-[center_55%]"
      />
      <div className="flex shrink-0 flex-col items-center px-4 pt-4 pb-3 text-center">
        <h1 className="font-heading text-2xl leading-snug font-bold">
          Cuéntame qué estás viviendo con la <span className="text-primary">persona que amas</span>
        </h1>
        <p className="mt-2 max-w-md text-base text-muted-foreground">
          Unas preguntas cortas para preparar el Ritual de la Llama Eterna con lo que tú respondas.
        </p>
        <div className="mt-3 w-full">
          <GlowButton onClick={onStart}>Empieza ahora</GlowButton>
        </div>
        <p className="mt-3 text-xs">Tus respuestas se quedan en este dispositivo.</p>
      </div>
    </div>
  )
}

function Title({ children }: { children: string }) {
  return (
    <h2 className="mb-5 text-center font-heading text-xl leading-snug font-semibold tracking-tight text-white">
      {children}
    </h2>
  )
}

function ImageStep({
  title,
  options,
  onPick,
  allowOther = false,
}: {
  title: string
  options: { label: string; scene: string }[]
  onPick: (value: string) => void
  allowOther?: boolean
}) {
  const [other, setOther] = useState("")
  const [error, setError] = useState<string | null>(null)

  function submitOther() {
    const text = other.replace(/\s+/g, " ").trim()
    if (text.length < 3) {
      setError("Cuéntalo en unas palabras.")
      return
    }
    onPick(text)
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 pt-16 pb-16">
      <Title>{title}</Title>
      <div className="grid w-full grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            className="overflow-hidden rounded-xl text-left transition-transform active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            onClick={() => onPick(option.label)}
          >
            <span className="relative block aspect-square">
              <Scene id={option.scene} />
              <span className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 bg-black/80 px-2 py-2 text-center text-sm leading-tight font-medium text-white">
                {option.label}
              </span>
            </span>
          </button>
        ))}
      </div>
      {allowOther ? (
        <div className="mt-4 w-full">
          <p className="mb-3 text-center text-sm text-muted-foreground">o</p>
          <div className="flex gap-2">
            <Input
              value={other}
              placeholder="Otro motivo"
              aria-label="Otro motivo"
              aria-invalid={error ? true : undefined}
              className="h-14 flex-1 px-3 text-center text-base"
              onChange={(event) => {
                setOther(event.target.value)
                setError(null)
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") submitOther()
              }}
            />
            <Button type="button" className="h-14 px-4" onClick={submitOther}>
              Seguir
            </Button>
          </div>
          {error ? (
            <p role="alert" className="mt-2 text-center text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function EmojiStep({
  title,
  options,
  onPick,
  scene,
  note,
}: {
  title: string
  options: [string, string][]
  onPick: (value: string) => void
  scene?: string
  note?: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col">
      {scene ? <Scene id={scene} className="aspect-square w-full" /> : null}
      <div className={`flex flex-col items-center px-4 py-6 ${scene ? "" : "flex-1 justify-center pt-16 pb-16"}`}>
        {note ? (
          <p className="mb-5 rounded-xl border border-border bg-muted/60 px-4 py-3 text-center text-sm leading-relaxed text-muted-foreground">
            {note}
          </p>
        ) : null}
        <Title>{title}</Title>
        <div className="w-full space-y-3">
          {options.map(([label, emoji]) => (
            <div
              key={label}
              role="button"
              tabIndex={0}
              className="emoji-card"
              onClick={() => onPick(label)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  onPick(label)
                }
              }}
            >
              <div className="emoji-card__content flex items-center gap-3 px-5 py-4">
                {emoji ? <span className="text-xl">{emoji}</span> : null}
                <span className="text-base font-light">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TextStep({
  title,
  placeholder,
  initial,
  onSubmit,
  validate,
  scene,
  mask,
}: {
  title: string
  placeholder: string
  initial: string
  onSubmit: (value: string) => void
  validate: (value: string) => string | null
  scene?: string
  mask?: "date"
}) {
  const [value, setValue] = useState(initial)
  const [error, setError] = useState<string | null>(null)

  function change(next: string) {
    if (mask === "date") {
      const digits = next.replace(/\D/g, "").slice(0, 8)
      const masked =
        digits.length > 4
          ? `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
          : digits.length > 2
            ? `${digits.slice(0, 2)}/${digits.slice(2)}`
            : digits
      setValue(masked)
    } else {
      setValue(next)
    }
    setError(null)
  }

  function submit() {
    const nextError = validate(value)
    if (nextError) {
      setError(nextError)
      return
    }
    onSubmit(value.replace(/\s+/g, " ").trim())
  }

  return (
    <div className="flex flex-1 flex-col">
      {scene ? <Scene id={scene} className="aspect-square w-full" /> : null}
      <div className={`flex w-full flex-col items-center px-4 ${scene ? "flex-1 justify-center py-4" : "flex-1 justify-center pt-16 pb-16"}`}>
        <Title>{title}</Title>
        <div className="w-full space-y-3">
          <Input
            value={value}
            inputMode={mask === "date" ? "numeric" : "text"}
            placeholder={placeholder}
            aria-label={title}
            aria-invalid={error ? true : undefined}
            className="h-14 px-3 text-center text-base focus-visible:border-red-400"
            onChange={(event) => change(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit()
            }}
          />
          {error ? (
            <p role="alert" className="text-center text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <div
            role="button"
            tabIndex={0}
            className="emoji-card"
            onClick={submit}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit()
            }}
          >
            <div className="emoji-card__content flex items-center justify-center px-5 py-4 font-medium">
              Continuar
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PROOFS = [
  { src: "/proof/maria.webp", name: "María" },
  { src: "/proof/sofia.webp", name: "Sofía" },
  { src: "/proof/isabella.webp", name: "Isabella" },
  { src: "/proof/luana.webp", name: "Luana" },
  { src: "/proof/laura.webp", name: "Laura" },
]

function Guide({ onNext }: { onNext: () => void }) {
  const [slide, setSlide] = useState(0)
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const slideRef = useRef(0)
  slideRef.current = slide

  useEffect(() => {
    const node = frame.current
    if (!node) return
    const el: HTMLDivElement = node
    let startX = 0
    let startY = 0
    let tracking = false
    let horizontal = false
    let moved = 0

    function claim(dx: number, dy: number) {
      if (!horizontal) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return false
        if (Math.abs(dy) >= Math.abs(dx)) {
          tracking = false
          return false
        }
        horizontal = true
        setDragging(true)
      }
      return true
    }

    function offset(dx: number) {
      const current = slideRef.current
      const atStart = current === 0 && dx > 0
      const atEnd = current === PROOFS.length - 1 && dx < 0
      return atStart || atEnd ? dx * 0.3 : dx
    }

    function finish() {
      if (!tracking) return
      tracking = false
      if (horizontal) {
        const width = el.clientWidth || 1
        const current = slideRef.current
        if (moved <= -width * 0.18 && current < PROOFS.length - 1) setSlide(current + 1)
        else if (moved >= width * 0.18 && current > 0) setSlide(current - 1)
      }
      horizontal = false
      moved = 0
      setDrag(0)
      setDragging(false)
    }

    function onTouchStart(event: TouchEvent) {
      if (event.touches.length !== 1) return
      startX = event.touches[0].clientX
      startY = event.touches[0].clientY
      tracking = true
      horizontal = false
      moved = 0
    }

    function onTouchMove(event: TouchEvent) {
      if (!tracking) return
      const dx = event.touches[0].clientX - startX
      const dy = event.touches[0].clientY - startY
      if (!claim(dx, dy)) return
      event.preventDefault()
      moved = dx
      setDrag(offset(dx))
    }

    function onPointerDown(event: PointerEvent) {
      if (event.pointerType === "touch") return
      startX = event.clientX
      startY = event.clientY
      tracking = true
      horizontal = false
      moved = 0
      const move = (pointer: PointerEvent) => {
        const dx = pointer.clientX - startX
        const dy = pointer.clientY - startY
        if (!claim(dx, dy)) return
        moved = dx
        setDrag(offset(dx))
      }
      const up = () => {
        window.removeEventListener("pointermove", move)
        window.removeEventListener("pointerup", up)
        finish()
      }
      window.addEventListener("pointermove", move)
      window.addEventListener("pointerup", up)
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true })
    el.addEventListener("touchmove", onTouchMove, { passive: false })
    el.addEventListener("touchend", finish)
    el.addEventListener("touchcancel", finish)
    el.addEventListener("pointerdown", onPointerDown)
    return () => {
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
      el.removeEventListener("touchend", finish)
      el.removeEventListener("touchcancel", finish)
      el.removeEventListener("pointerdown", onPointerDown)
    }
  }, [])

  return (
    <div className="flex flex-1 flex-col items-center px-4 pt-16 pb-16 text-center">
      <img
        src="/rosa.webp"
        alt="Rosa Moreno"
        className="aspect-square w-full max-w-[220px] rounded-lg object-cover object-top"
      />
      <p className="mt-5 text-lg font-bold text-foreground">Rosa Moreno</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Desde hace más de 9 años acompaño a mujeres que están dolidas por una historia de amor. El ritual que vas a ver es
        simbólico: ordena tu intención. No obliga a la otra persona a volver.
      </p>
      <div className="mt-4 w-full">
        <p className="mb-3 text-sm text-muted-foreground">Desliza para ver mensajes que Rosa ha compartido.</p>
          <div ref={frame} data-proofs className="overflow-hidden" style={{ touchAction: "pan-y" }}>
            <div
              className={dragging ? "flex" : "flex transition-transform duration-300 ease-out"}
              style={{ transform: `translateX(calc(-${slide * 100}% + ${drag}px))` }}
            >
              {PROOFS.map((proof) => (
                <img
                  key={proof.src}
                  src={proof.src}
                  alt={`Conversación con ${proof.name}`}
                  draggable={false}
                  className="h-[min(68dvh,520px)] w-full shrink-0 rounded-lg object-contain object-top select-none"
                />
              ))}
            </div>
          </div>
          <div className="mt-3 flex justify-center gap-1.5">
            {PROOFS.map((proof, index) => (
              <button
                key={proof.src}
                type="button"
                aria-label={`Ver conversación de ${proof.name}`}
                className={`h-2 rounded-full transition-all ${index === slide ? "w-4 bg-primary" : "w-2 bg-white/30"}`}
                onClick={() => setSlide(index)}
              />
            ))}
          </div>
          <div className="mt-6 w-full">
            <GlowButton onClick={onNext}>Continuar mi ritual</GlowButton>
          </div>
      </div>
    </div>
  )
}

function Finale({ you, onDone }: { you: string; onDone: () => void }) {
  const onDoneRef = useRef(onDone)
  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])
  useEffect(() => {
    const timer = window.setTimeout(() => onDoneRef.current(), 4200)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      <Scene id="finale" className="aspect-square" />
      <div className="flex flex-1 flex-col items-center px-4 py-6 pb-16 text-center">
        <h2 className="font-heading text-xl font-bold tracking-tight">
          <span className="text-red-300">{you}</span>
          <br />
          <span>Tu video está por abrir</span>
        </h2>
        <div className="relative mt-6 grid size-28 place-items-center text-primary">
          <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden>
            <circle cx="18" cy="18" r="15" fill="none" className="stroke-primary/25" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              className="finale-ring stroke-primary"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-3xl">❤️</span>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          El círculo marca unos segundos reales. Al terminar, el video empieza solo.
        </p>
      </div>
    </div>
  )
}

function GlowButton({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <div className="glow-button-wrapper">
      <button type="button" className="glow-button" onClick={onClick}>
        <span className="glow-button__text">{children}</span>
        <svg className="glow-button__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}

function useSound() {
  const [enabled, setEnabled] = useState(true)
  const context = useRef<AudioContext | null>(null)

  function play() {
    if (!enabled) return
    try {
      const audio = context.current ?? new AudioContext()
      context.current = audio
      if (audio.state === "suspended") void audio.resume()
      const oscillator = audio.createOscillator()
      const gain = audio.createGain()
      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(800, audio.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audio.currentTime + 0.08)
      gain.gain.setValueAtTime(0.08, audio.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.1)
      oscillator.connect(gain).connect(audio.destination)
      oscillator.start()
      oscillator.stop(audio.currentTime + 0.1)
    } catch {
      /* autoplay limits should not block the quiz */
    }
  }

  return {
    enabled,
    play,
    toggle: () => setEnabled((value) => !value),
  }
}
