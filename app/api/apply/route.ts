import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { foundingMembers } from "@/lib/db/schema"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body?.name || !body?.email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 })
    }

    const payload = {
      fullName: String(body.name).slice(0, 200),
      email: String(body.email).slice(0, 320),
      phone: body.phone ? String(body.phone).slice(0, 50) : null,
      propFirms: Array.isArray(body.firms) ? body.firms.join(", ").slice(0, 500) : "",
      fundedAccounts: String(body.accountsRun ?? "").slice(0, 100),
      capitalType: [body.fundedStatus, body.capitalAvailable].filter(Boolean).join(" · ").slice(0, 50),
      whyNow: "",
      status: "applied",
    }

    try {
      await db.insert(foundingMembers).values(payload)
    } catch (err) {
      // Never lose a lead: if the DB is unavailable, log the payload for manual recovery.
      console.error("[apply] insert failed, application payload:", { ...payload, err })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }
}
