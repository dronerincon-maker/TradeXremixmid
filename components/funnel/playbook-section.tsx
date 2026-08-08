"use client"

import { motion } from "framer-motion"
import { FileText, PhoneCall, LineChart } from "lucide-react"
import { DecodeText, Reveal, SlideIn } from "./motion"

const COLUMNS = [
  {
    icon: FileText,
    title: "SOPs & firm playbooks",
    body: "Standard operating procedures tuned to each firm's rules, so nothing gets breached by accident.",
  },
  {
    icon: PhoneCall,
    title: "Weekly live desk call",
    body: "A recurring operator call to review conditions, deployment, and account management.",
  },
  {
    icon: LineChart,
    title: "Track-record portal",
    body: "Documented member results, logged and labeled: never presented as typical or guaranteed.",
  },
]

export function PlaybookSection() {
  return (
    <section className="relative w-full py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <DecodeText text="THE PLAYBOOK" className="block text-xs font-medium uppercase text-zinc-500" duration={500} />
        <DecodeText
          as="h2"
          text="Run every account like a desk."
          className="mt-6 block max-w-3xl text-balance text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl"
          duration={700}
        />

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">
          {COLUMNS.map((col, i) => (
            <SlideIn key={col.title} from={i % 2 === 0 ? "left" : "right"} amount={40 + i * 20} className="h-full bg-black/70 backdrop-blur-sm">
              <motion.div
                className="group flex h-full flex-col gap-5 p-8"
                whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-fit"
                  whileHover={{ rotate: -6, scale: 1.12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <col.icon className="size-5 text-white" strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-xl font-semibold tracking-tight text-white text-pretty">{col.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{col.body}</p>
              </motion.div>
            </SlideIn>
          ))}
        </div>

        <Reveal delay={120} as="p" className="mt-10 text-sm uppercase tracking-[0.2em] text-zinc-500">
          Supported firms: Tradeify · MyFundedFutures · Lucid · Take Profit Trader
        </Reveal>
      </div>
    </section>
  )
}
