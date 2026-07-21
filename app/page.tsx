import { FunnelProvider } from "@/components/funnel/funnel-context"
import { GridBackdrop } from "@/components/funnel/grid-backdrop"
import { ScrollProgress } from "@/components/funnel/scroll-progress"
import { HeroSection } from "@/components/funnel/hero-section"
import { TaasIntroSection } from "@/components/funnel/taas-intro-section"
import { ProblemSection } from "@/components/funnel/problem-section"
import { SuiteSection } from "@/components/funnel/suite-section"
import { InfrastructureSection } from "@/components/funnel/infrastructure-section"
import { PlaybookSection } from "@/components/funnel/playbook-section"
import { GuaranteeSection } from "@/components/funnel/guarantee-section"
import { EntrySection } from "@/components/funnel/entry-section"
import { FooterSection } from "@/components/funnel/footer-section"
import { StickyCta } from "@/components/funnel/sticky-cta"
import { ApplicationForm } from "@/components/funnel/application-form"

export default function Page() {
  return (
    <FunnelProvider>
      <ScrollProgress />
      <GridBackdrop />
      <main className="relative w-full">
        <HeroSection />
        <TaasIntroSection />
        <ProblemSection />
        <SuiteSection />
        <InfrastructureSection />
        <PlaybookSection />
        <GuaranteeSection />
        <EntrySection />
        <FooterSection />
      </main>
      <StickyCta />
      <ApplicationForm />
    </FunnelProvider>
  )
}
