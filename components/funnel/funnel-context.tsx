"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { trackOnce } from "@/lib/analytics"

type FunnelContextValue = {
  applyOpen: boolean
  openApply: () => void
  closeApply: () => void
  seatCap: number
  seatsRemaining: number
}

const FunnelContext = createContext<FunnelContextValue | null>(null)

export function FunnelProvider({
  children,
  seatCap,
  seatsRemaining,
}: {
  children: ReactNode
  seatCap: number
  seatsRemaining: number
}) {
  const [applyOpen, setApplyOpen] = useState(false)
  const openApply = useCallback(() => {
    setApplyOpen(true)
    trackOnce("application_start")
  }, [])
  const closeApply = useCallback(() => setApplyOpen(false), [])
  return (
    <FunnelContext.Provider value={{ applyOpen, openApply, closeApply, seatCap, seatsRemaining }}>
      {children}
    </FunnelContext.Provider>
  )
}

export function useFunnel() {
  const ctx = useContext(FunnelContext)
  if (!ctx) throw new Error("useFunnel must be used within FunnelProvider")
  return ctx
}
