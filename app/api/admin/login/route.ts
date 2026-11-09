import { connection } from "next/server"
import { NextResponse } from "next/server"
import {
  clearAttempts,
  clientKey,
  envPassword,
  openSession,
  passwordsMatch,
  recordAttempt,
  sameOrigin,
  tooManyAttempts,
} from "@/lib/admin-auth"

export async function POST(request: Request) {
  await connection()
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origem recusada." }, { status: 403 })
  const secret = envPassword()
  if (!secret) {
    return NextResponse.json({ error: "A senha do admin não está configurada." }, { status: 503 })
  }
  const key = await clientKey()
  if (await tooManyAttempts(key)) {
    return NextResponse.json({ error: "Muitas tentativas neste navegador. Espere 15 minutos." }, { status: 429 })
  }
  const body = (await request.json().catch(() => null)) as { password?: unknown } | null
  const password = typeof body?.password === "string" ? body.password : ""
  if (!passwordsMatch(password, secret)) {
    await recordAttempt(key)
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 })
  }
  await clearAttempts(key)
  await openSession()
  return NextResponse.json({ ok: true })
}
