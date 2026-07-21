import { getFoundingSeats } from "@/app/actions/founding"
import { FunnelProvider } from "@/components/funnel/funnel-context"
import { GridBackdrop } from "@/components/funnel/grid-backdrop"
import { ScrollProgress } from "@/components/funnel/scroll-progress"
import { HeroSection } from "@/components/funnel/hero-section"
import { ProblemSection } from "@/components/funnel/problem-section"
import { TaasIntroSection } from "@/components/funnel/taas-intro-section"
import { SuiteSection } from "@/components/funnel/suite-section"
import { ProofSection } from "@/components/funnel/proof-section"
import { InfrastructureSection } from "@/components/funnel/infrastructure-section"
import { PlaybookSection } from "@/components/funnel/playbook-section"
import { GuaranteeSection } from "@/components/funnel/guarantee-section"
import { FaqSection } from "@/components/funnel/faq-section"
import { EntrySection } from "@/components/funnel/entry-section"
import { FooterSection } from "@/components/funnel/footer-section"
import { StickyCta } from "@/components/funnel/sticky-cta"
import { ApplicationForm } from "@/components/funnel/application-form"

// Seat counts come from the database; refresh at most once a minute.
export const revalidate = 60

export default async function Page() {
  const { seatCap, seatsRemaining } = await getFoundingSeats()

  return (
    <FunnelProvider seatCap={seatCap} seatsRemaining={seatsRemaining}>
      <ScrollProgress />
      <GridBackdrop />
      <main className="relative w-full">
        {/* Narrative order: interrupt → recognition → mechanism → claims → evidence → environment → support → confidence → action */}
        <HeroSection />
        <ProblemSection />
        <TaasIntroSection />
        <SuiteSection />
        <ProofSection />
        <InfrastructureSection />
        <PlaybookSection />
        <GuaranteeSection />
        <FaqSection />
        <EntrySection />
        <FooterSection />
      </main>
      <StickyCta />
      <ApplicationForm />
    </FunnelProvider>
  )
}
