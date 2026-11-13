export const PHOTOS: Record<string, string> = {
  clock: "/scenes/clock.webp",
  couple: "/scenes/couple.webp",
  door: "/scenes/door.webp",
  candle: "/scenes/candle.webp",
  spirit: "/scenes/spirit.webp",
  beloved: "/scenes/beloved.webp",
  pair: "/scenes/pair.webp",
  replay: "/scenes/replay.webp",
  phone: "/scenes/phone.webp",
  wish: "/scenes/wish.webp",
  today: "/scenes/today.webp",
  finale: "/ritual.webp",
  argue: "/scenes/argue.webp",
  fade: "/scenes/fade.webp",
  other: "/scenes/other.webp",
  jealousy: "/scenes/jealousy.webp",
  blocked: "/scenes/blocked.webp",
  lost: "/scenes/lost.webp",
  rare: "/scenes/rare.webp",
  chilly: "/scenes/chilly.webp",
  often: "/scenes/often.webp",
  regret: "/scenes/regret.webp",
  soon: "/scenes/soon.webp",
  late: "/scenes/late.webp",
  shrug: "/scenes/shrug.webp",
  sad: "/scenes/sad.webp",
  anxious: "/scenes/anxious.webp",
  anger: "/scenes/anger.webp",
  empty: "/scenes/empty.webp",
  health: "/scenes/health.webp",
  work: "/scenes/work.webp",
  sleep: "/scenes/sleep.webp",
  all: "/scenes/all.webp",
}

export function Scene({ id, className = "" }: { id: string; className?: string }) {
  const photo = PHOTOS[id]
  if (!photo) return null
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <img src={photo} alt="" decoding="async" className="absolute inset-0 size-full object-cover" />
    </div>
  )
}
