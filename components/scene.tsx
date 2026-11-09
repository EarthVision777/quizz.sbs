const SCENES: Record<string, { from: string; to: string; mark: string }> = {
  landing: { from: "#4a1020", to: "#1a0a0c", mark: "🕯️" },
  clock: { from: "#3a2414", to: "#120e0c", mark: "🕰️" },
  couple: { from: "#5a1830", to: "#140810", mark: "💞" },
  door: { from: "#2a2438", to: "#100e14", mark: "🚪" },
  candle: { from: "#5c1a22", to: "#1a0c0e", mark: "🌹" },
  spirit: { from: "#2a1848", to: "#100814", mark: "✨" },
  beloved: { from: "#4a2030", to: "#140810", mark: "💌" },
  pair: { from: "#3a2030", to: "#120c10", mark: "🫂" },
  replay: { from: "#243048", to: "#0c1018", mark: "🌙" },
  phone: { from: "#1c2430", to: "#0c1014", mark: "📱" },
  wish: { from: "#4a1828", to: "#14080e", mark: "🔥" },
  today: { from: "#5a2018", to: "#160c0a", mark: "⏳" },
  finale: { from: "#4a1024", to: "#12060c", mark: "❤️" },
  argue: { from: "#6a1a1a", to: "#1a0a0a", mark: "💬" },
  fade: { from: "#2a3344", to: "#10141c", mark: "❄️" },
  other: { from: "#4a1840", to: "#140810", mark: "👤" },
  jealousy: { from: "#3a2848", to: "#100c14", mark: "👁️" },
  blocked: { from: "#2a2a2a", to: "#101010", mark: "🚫" },
  lost: { from: "#243040", to: "#0c1014", mark: "🌫️" },
  rare: { from: "#2a3038", to: "#101214", mark: "📭" },
  chilly: { from: "#1e3040", to: "#0c1218", mark: "🧊" },
  often: { from: "#5a2030", to: "#160c10", mark: "💬" },
  regret: { from: "#4a2830", to: "#140c10", mark: "😔" },
  soon: { from: "#3a2430", to: "#120c10", mark: "🥀" },
  late: { from: "#2a2438", to: "#100e14", mark: "🕳️" },
  shrug: { from: "#2a2a30", to: "#101014", mark: "🤷" },
  sad: { from: "#1e3058", to: "#0c1018", mark: "😢" },
  anxious: { from: "#4a3a18", to: "#14100a", mark: "😰" },
  anger: { from: "#6a1818", to: "#180808", mark: "💢" },
  empty: { from: "#2a2a2a", to: "#101010", mark: "⬛" },
  health: { from: "#4a1830", to: "#14080e", mark: "💗" },
  work: { from: "#243040", to: "#0c1014", mark: "💼" },
  sleep: { from: "#1a2040", to: "#0a0c16", mark: "🌙" },
  all: { from: "#4a1428", to: "#14060e", mark: "🌊" },
}

export function Scene({ id, className = "" }: { id: string; className?: string }) {
  const scene = SCENES[id] ?? SCENES.landing
  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ background: `linear-gradient(165deg, ${scene.from}, ${scene.to})` }}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_42%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.35),transparent_46%)]" />
      <span className="absolute inset-0 grid place-items-center text-6xl drop-shadow-lg">{scene.mark}</span>
      <span className="scan-line pointer-events-none absolute left-0 h-px w-full bg-white/25" />
    </div>
  )
}
