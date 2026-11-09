import { connection } from "next/server"
import { NextResponse } from "next/server"
import {
  clearAttempts,
  envPassword,
  openSession,
  passwordsMatch,
  recordAttempt,
  sameOrigin,
  tooManyAttempts,
  verifyPassword,
} from "@/lib/admin-auth"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  await connection()
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origem recusada." }, { status: 403 })
  if (await tooManyAttempts()) {
    return NextResponse.json({ error: "Muitas tentativas. Espere 15 minutos." }, { status: 429 })
  }
  const body = (await request.json().catch(() => null)) as { password?: unknown } | null
  const password = typeof body?.password === "string" ? body.password : ""
  const secret = envPassword()
  let ok = false
  if (secret) {
    ok = passwordsMatch(password, secret)
  } else {
    const rows = await sql<{ password_hash: string }>("select password_hash from admin_secret where id = 1")
    if (!rows[0]) return NextResponse.json({ error: "Crie a senha primeiro." }, { status: 409 })
    ok = await verifyPassword(password, rows[0].password_hash)
  }
  if (!ok) {
    await recordAttempt()
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 })
  }
  await clearAttempts()
  await openSession()
  return NextResponse.json({ ok: true })
}
