import { randomBytes, scrypt, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

const scryptAsync = promisify(scrypt)
const COOKIE = "llama_admin"
const SESSION_DAYS = 14

export function envPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? ""
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = (await scryptAsync(password, salt, 32)) as Buffer
  return `${salt}:${hash.toString("hex")}`
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hex] = stored.split(":")
  if (!salt || !hex) return false
  const hash = (await scryptAsync(password, salt, 32)) as Buffer
  const expected = Buffer.from(hex, "hex")
  if (hash.length !== expected.length) return false
  return timingSafeEqual(hash, expected)
}

export function passwordsMatch(password: string, expected: string) {
  const left = Buffer.from(password)
  const right = Buffer.from(expected)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export async function hasStoredPassword() {
  const rows = await sql<{ password_hash: string }>("select password_hash from admin_secret where id = 1")
  return Boolean(rows[0]?.password_hash)
}

export async function tooManyAttempts() {
  await sql("delete from admin_attempt where created_at < now() - interval '15 minutes'")
  const rows = await sql<{ total: number }>("select count(*)::int as total from admin_attempt")
  return Number(rows[0]?.total ?? 0) >= 8
}

export async function recordAttempt() {
  await sql("insert into admin_attempt (created_at) values (now())")
}

export async function clearAttempts() {
  await sql("delete from admin_attempt")
}

export async function openSession() {
  const token = randomBytes(32).toString("hex")
  await sql("delete from admin_session where expires_at < now()")
  await sql(
    "insert into admin_session (token, expires_at) values ($1, now() + interval '14 days')",
    [token],
  )
  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
  })
}

export async function readSession() {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return false
  const rows = await sql<{ token: string }>(
    "select token from admin_session where token = $1 and expires_at > now()",
    [token],
  )
  return rows.length > 0
}

export async function closeSession() {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (token) await sql("delete from admin_session where token = $1", [token])
  jar.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 })
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin")
  const host = request.headers.get("host")
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export function passwordError(password: string) {
  if (password.length < 8) return "A senha precisa de pelo menos 8 caracteres."
  if (password.length > 72) return "A senha pode ter no máximo 72 caracteres."
  return ""
}
