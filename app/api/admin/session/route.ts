import { connection } from "next/server"
import { NextResponse } from "next/server"
import { clientKey, envPassword, readSession } from "@/lib/admin-auth"

export async function GET() {
  await connection()
  await clientKey()
  return NextResponse.json({
    authenticated: await readSession(),
    configured: envPassword() !== "",
  })
}
