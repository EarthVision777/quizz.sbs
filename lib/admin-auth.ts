import { randomBytes, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

const SESSION = "llama_admin"
const CLIENT = "llama_client"
const SESSION_DAYS = 14

export function envPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? ""
}

export function passwordsMatch(password: string, expected: string) {
  const left = Buffer.from(password)
  const right = Buffer.from(expected)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  }
}

export async function clientKey() {
  const jar = await cookies()
  const current = jar.get(CLIENT)?.value
  if (current && /^[a-f0-9]{32}$/.test(current)) return current
  const key = randomBytes(16).toString("hex")
  jar.set(CLIENT, key, cookieOptions(60 * 60 * 24 * 30))
  return key
}

export async function tooManyAttempts(key: string) {
  await sql("delete from admin_attempt where created_at < now() - interval '15 minutes'")
  const rows = await sql<{ total: number }>(
    "select count(*)::int as total from admin_attempt where client_key = $1",
    [key],
  )
  return Number(rows[0]?.total ?? 0) >= 8
}

export async function recordAttempt(key: string) {
  await sql("insert into admin_attempt (created_at, client_key) values (now(), $1)", [key])
}

export async function clearAttempts(key: string) {
  await sql("delete from admin_attempt where client_key = $1", [key])
}

export async function openSession() {
  const token = randomBytes(32).toString("hex")
  await sql("delete from admin_session where expires_at < now()")
  await sql(
    "insert into admin_session (token, expires_at) values ($1, now() + interval '14 days')",
    [token],
  )
  const jar = await cookies()
  jar.set(SESSION, token, cookieOptions(60 * 60 * 24 * SESSION_DAYS))
}

export async function readSession() {
  const jar = await cookies()
  const token = jar.get(SESSION)?.value
  if (!token) return false
  const rows = await sql<{ token: string }>(
    "select token from admin_session where token = $1 and expires_at > now()",
    [token],
  )
  return rows.length > 0
}

export async function closeSession() {
  const jar = await cookies()
  const token = jar.get(SESSION)?.value
  if (token) await sql("delete from admin_session where token = $1", [token])
  jar.set(SESSION, "", cookieOptions(0))
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
