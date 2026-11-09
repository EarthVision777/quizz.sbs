export type Answers = Record<string, string>

export type Save = {
  index: number
  answers: Answers
}

export const STEP_COUNT = 22
const KEY = "brasa-quiz-v1"
const EMPTY: Save = { index: 0, answers: {} }

let cacheRaw: string | null = null
let cacheValue: Save = EMPTY

function parse(raw: string): Save {
  if (!raw) return EMPTY
  try {
    const saved = JSON.parse(raw) as Partial<Save>
    if (
      saved &&
      typeof saved.index === "number" &&
      saved.index >= 0 &&
      saved.index < STEP_COUNT &&
      saved.answers &&
      typeof saved.answers === "object"
    ) {
      return { index: saved.index, answers: saved.answers }
    }
  } catch {
    /* ignore broken drafts */
  }
  return EMPTY
}

export function readSave(): Save {
  const raw = localStorage.getItem(KEY) ?? ""
  if (raw === cacheRaw) return cacheValue
  cacheRaw = raw
  cacheValue = parse(raw)
  return cacheValue
}

export function getEmptySave(): Save {
  return EMPTY
}

export function subscribeSave(onChange: () => void) {
  window.addEventListener("brasa-sync", onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener("brasa-sync", onChange)
    window.removeEventListener("storage", onChange)
  }
}

export function writeSave(save: Save) {
  const raw = JSON.stringify(save)
  localStorage.setItem(KEY, raw)
  cacheRaw = raw
  cacheValue = save
  window.dispatchEvent(new Event("brasa-sync"))
}

export function clearSave() {
  localStorage.removeItem(KEY)
  cacheRaw = ""
  cacheValue = EMPTY
  window.dispatchEvent(new Event("brasa-sync"))
}
