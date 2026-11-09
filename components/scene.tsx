const PHOTOS: Record<string, string> = {
  clock: "/scenes/clock.jpg",
  couple: "/scenes/couple.jpg",
  door: "/scenes/door.jpg",
  candle: "/scenes/candle.jpg",
  spirit: "/scenes/spirit.jpg",
  beloved: "/scenes/beloved.jpg",
  pair: "/scenes/pair.jpg",
  replay: "/scenes/replay.jpg",
  phone: "/scenes/phone.jpg",
  wish: "/scenes/wish.jpg",
  today: "/scenes/today.jpg",
  finale: "/ritual.webp",
  argue: "/scenes/argue.jpg",
  fade: "/scenes/fade.jpg",
  other: "/scenes/other.jpg",
  jealousy: "/scenes/jealousy.jpg",
  blocked: "/scenes/blocked.jpg",
  lost: "/scenes/lost.jpg",
  rare: "/scenes/rare.jpg",
  chilly: "/scenes/chilly.jpg",
  often: "/scenes/often.jpg",
  regret: "/scenes/regret.jpg",
  soon: "/scenes/soon.jpg",
  late: "/scenes/late.jpg",
  shrug: "/scenes/shrug.jpg",
  sad: "/scenes/sad.jpg",
  anxious: "/scenes/anxious.jpg",
  anger: "/scenes/anger.jpg",
  empty: "/scenes/empty.jpg",
  health: "/scenes/health.jpg",
  work: "/scenes/work.jpg",
  sleep: "/scenes/sleep.jpg",
  all: "/scenes/all.jpg",
}

export function Scene({ id, className = "" }: { id: string; className?: string }) {
  const photo = PHOTOS[id]
  if (!photo) return null
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <img src={photo} alt="" className="absolute inset-0 size-full object-cover" />
    </div>
  )
}
