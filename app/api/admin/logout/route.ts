import { connection } from "next/server"
import { NextResponse } from "next/server"
import { closeSession, sameOrigin } from "@/lib/admin-auth"

export async function POST(request: Request) {
  await connection()
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origem recusada." }, { status: 403 })
  await closeSession()
  return NextResponse.json({ ok: true })
}
