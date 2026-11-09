import { connection } from "next/server"
import { NextResponse } from "next/server"
import { DEFAULT_CTA } from "@/lib/cta"
import { readCta } from "@/lib/checkout-store"

export async function GET() {
  await connection()
  try {
    return NextResponse.json(await readCta())
  } catch {
    return NextResponse.json(DEFAULT_CTA)
  }
}
