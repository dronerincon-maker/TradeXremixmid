import type { Metadata } from "next"
import { getFoundingSeats } from "@/app/actions/founding"
import { InstHero } from "@/components/institutional/inst-hero"
import { InstProblem } from "@/components/institutional/inst-problem"
import { InstSuite } from "@/components/institutional/inst-suite"
import { InstEngine } from "@/components/institutional/inst-engine"
import { InstInfrastructure } from "@/components/institutional/inst-infrastructure"
import { InstValueStack } from "@/components/institutional/inst-value-stack"
import { InstPricing } from "@/components/institutional/inst-pricing"
import { InstApply } from "@/components/institutional/inst-apply"
import { FooterSection } from "@/components/funnel/footer-section"
import { GridBackdrop } from "@/components/funnel/grid-backdrop"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "TradeX Institutional: Founding Access | TradeXLabs",
  description:
    "The complete agentic trading system: ten algorithms, the Prop Oracle allocation engine, and done-for-you infrastructure. Founding cohort, 50 seats, grandfathered into the full Institutional tier.",
}

export default async function InstitutionalPage() {
  const { seatCap, seatsRemaining } = await getFoundingSeats()

  return (
    <main className="relative w-full">
      <GridBackdrop />
      <InstHero seatsRemaining={seatsRemaining} seatCap={seatCap} />
      <InstProblem />
      <InstSuite />
      <InstEngine />
      <InstInfrastructure />
      <InstValueStack />
      <InstPricing seatsRemaining={seatsRemaining} seatCap={seatCap} />
      <InstApply seatsRemaining={seatsRemaining} />
      <FooterSection />
    </main>
  )
}
