"use client"

import { DecodeText, Parallax } from "./motion"
import { TxParticleX } from "./tx-particle-x"

export function GuaranteeSection() {
  return (
    <section className="relative flex min-h-[80svh] w-full items-center justify-center overflow-hidden py-32">
      <TxParticleX className="absolute inset-0 opacity-35" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(0,0,0,0.7), rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.4))",
        }}
      />
      <Parallax amount={30} className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <DecodeText
          as="p"
          text="THE GUARANTEE"
          className="block text-xs font-medium uppercase tracking-[0.28em] text-zinc-600"
          duration={500}
        />
        <h2 className="mt-10 text-balance text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl md:text-5xl">
          A six-month guarantee on our work.
          <br className="hidden sm:block" />{" "}
          <span className="text-zinc-400">Never on profit — nobody honest promises that.</span>
        </h2>
      </Parallax>
    </section>
  )
}
