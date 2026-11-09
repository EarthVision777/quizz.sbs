import { connection } from "next/server"
import { NextResponse } from "next/server"
import {
  clearAttempts,
  envPassword,
  hasStoredPassword,
  hashPassword,
  openSession,
  passwordError,
  sameOrigin,
} from "@/lib/admin-auth"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  await connection()
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origem recusada." }, { status: 403 })
  if (envPassword() || (await hasStoredPassword())) {
    return NextResponse.json({ error: "A senha já existe." }, { status: 409 })
  }
  const body = (await request.json().catch(() => null)) as { password?: unknown } | null
  const password = typeof body?.password === "string" ? body.password : ""
  const error = passwordError(password)
  if (error) return NextResponse.json({ error }, { status: 400 })
  const saved = await sql<{ id: number }>(
    "insert into admin_secret (id, password_hash) values (1, $1) on conflict (id) do nothing returning id",
    [await hashPassword(password)],
  )
  if (!saved[0]) return NextResponse.json({ error: "A senha já existe." }, { status: 409 })
  await clearAttempts()
  await openSession()
  return NextResponse.json({ ok: true })
}
