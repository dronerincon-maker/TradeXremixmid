"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { MotionConfig } from "framer-motion"

/** Founding charter: real hard cap. Update `claimed` from your source of truth. */
export const TOTAL_SEATS = 50
export const CLAIMED_SEATS = 37

type FunnelContextValue = {
  applyOpen: boolean
  openApply: () => void
  closeApply: () => void
}

const FunnelContext = createContext<FunnelContextValue | null>(null)

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [applyOpen, setApplyOpen] = useState(false)
  const openApply = useCallback(() => setApplyOpen(true), [])
  const closeApply = useCallback(() => setApplyOpen(false), [])
  return (
    <FunnelContext.Provider value={{ applyOpen, openApply, closeApply }}>
      {/* reducedMotion="user" makes every framer-motion transform/opacity fall back
          to instant when the OS requests reduced motion — no per-component guards needed. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </FunnelContext.Provider>
  )
}

export function useFunnel() {
  const ctx = useContext(FunnelContext)
  if (!ctx) throw new Error("useFunnel must be used within FunnelProvider")
  return ctx
}
