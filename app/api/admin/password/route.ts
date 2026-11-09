import { connection } from "next/server"
import { NextResponse } from "next/server"
import {
  envPassword,
  hashPassword,
  passwordError,
  readSession,
  sameOrigin,
  verifyPassword,
} from "@/lib/admin-auth"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  await connection()
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origem recusada." }, { status: 403 })
  if (!(await readSession())) return NextResponse.json({ error: "Entre de novo." }, { status: 401 })
  if (envPassword()) {
    return NextResponse.json(
      { error: "A senha ativa é o segredo ADMIN_PASSWORD. Troque esse segredo para mudá-la." },
      { status: 409 },
    )
  }
  const body = (await request.json().catch(() => null)) as { current?: unknown; next?: unknown } | null
  const current = typeof body?.current === "string" ? body.current : ""
  const next = typeof body?.next === "string" ? body.next : ""
  const error = passwordError(next)
  if (error) return NextResponse.json({ error }, { status: 400 })
  const rows = await sql<{ password_hash: string }>("select password_hash from admin_secret where id = 1")
  if (!rows[0] || !(await verifyPassword(current, rows[0].password_hash))) {
    return NextResponse.json({ error: "A senha atual não confere." }, { status: 401 })
  }
  await sql("update admin_secret set password_hash = $1, updated_at = now() where id = 1", [
    await hashPassword(next),
  ])
  return NextResponse.json({ ok: true })
}
