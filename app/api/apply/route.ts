import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body?.name || !body?.email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 })
    }

    // In production, persist this to your CRM / database and trigger review.
    // Kept server-side and logged here; no client secrets exposed.
    console.log("[v0] New Founder Pro application:", {
      name: body.name,
      email: body.email,
      phone: body.phone,
      fundedStatus: body.fundedStatus,
      firms: body.firms,
      accountsRun: body.accountsRun,
      capitalAvailable: body.capitalAvailable,
      receivedAt: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }
}
