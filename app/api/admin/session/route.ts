import { connection } from "next/server"
import { NextResponse } from "next/server"
import { envPassword, hasStoredPassword, readSession } from "@/lib/admin-auth"

export async function GET() {
  await connection()
  const usesSecret = envPassword() !== ""
  const [authenticated, stored] = await Promise.all([readSession(), hasStoredPassword()])
  return NextResponse.json({
    authenticated,
    needsSetup: !usesSecret && !stored,
    usesSecret,
  })
}
