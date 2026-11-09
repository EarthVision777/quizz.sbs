import { connection } from "next/server"
import { NextResponse } from "next/server"
import { readSession, sameOrigin } from "@/lib/admin-auth"
import { parseCta } from "@/lib/cta"
import { readCta, writeCta } from "@/lib/checkout-store"

export async function GET() {
  await connection()
  if (!(await readSession())) return NextResponse.json({ error: "Entre de novo." }, { status: 401 })
  return NextResponse.json(await readCta())
}

export async function PUT(request: Request) {
  await connection()
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origem recusada." }, { status: 403 })
  if (!(await readSession())) return NextResponse.json({ error: "Entre de novo." }, { status: 401 })
  const parsed = parseCta(await request.json().catch(() => null))
  if (typeof parsed === "string") return NextResponse.json({ error: parsed }, { status: 400 })
  await writeCta(parsed)
  return NextResponse.json(await readCta())
}
