"use server"

import { db } from "@/lib/db"
import { foundingConfig, foundingMembers } from "@/lib/db/schema"
import { count, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

const DEFAULT_CAP = 25

export async function getFoundingSeats(): Promise<{ seatCap: number; seatsRemaining: number }> {
  const [capRow] = await db
    .select({ valueInt: foundingConfig.valueInt })
    .from(foundingConfig)
    .where(eq(foundingConfig.key, "founding_seat_cap"))

  const seatCap = capRow?.valueInt ?? DEFAULT_CAP

  const [confirmed] = await db
    .select({ value: count() })
    .from(foundingMembers)
    .where(eq(foundingMembers.status, "confirmed"))

  const seatsRemaining = Math.max(0, seatCap - (confirmed?.value ?? 0))
  return { seatCap, seatsRemaining }
}

export type FoundingApplicationState = {
  ok: boolean
  message: string
  waitlisted?: boolean
} | null

export async function submitFoundingApplication(
  _prev: FoundingApplicationState,
  formData: FormData,
): Promise<FoundingApplicationState> {
  const fullName = String(formData.get("fullName") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const propFirms = String(formData.get("propFirms") ?? "").trim()
  const fundedAccounts = String(formData.get("fundedAccounts") ?? "").trim()
  const capitalType = String(formData.get("capitalType") ?? "").trim()
  const whyNow = String(formData.get("whyNow") ?? "").trim()

  if (!fullName || fullName.length > 200) {
    return { ok: false, message: "Please enter your full name." }
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
    return { ok: false, message: "Please enter a valid email address." }
  }
  if (!fundedAccounts) {
    return { ok: false, message: "Please tell us how many funded accounts you run." }
  }
  if (!capitalType) {
    return { ok: false, message: "Please select cash or prop." }
  }

  const { seatsRemaining } = await getFoundingSeats()
  const waitlisted = seatsRemaining <= 0

  await db.insert(foundingMembers).values({
    fullName,
    email,
    phone: phone || null,
    propFirms: propFirms.slice(0, 500),
    fundedAccounts: fundedAccounts.slice(0, 100),
    capitalType: capitalType.slice(0, 50),
    whyNow: whyNow.slice(0, 2000),
    status: waitlisted ? "waitlisted" : "applied",
  })

  revalidatePath("/institutional")

  return {
    ok: true,
    waitlisted,
    message: waitlisted
      ? "Founding seats are full. You're on the waitlist — we'll reach out if a seat opens or when the next tier goes live."
      : "Application received. If you're a fit for the founding cohort, we'll reach out to schedule a call. Applying does not guarantee a seat.",
  }
}
