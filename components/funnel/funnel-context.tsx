"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

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
      {children}
    </FunnelContext.Provider>
  )
}

export function useFunnel() {
  const ctx = useContext(FunnelContext)
  if (!ctx) throw new Error("useFunnel must be used within FunnelProvider")
  return ctx
}
