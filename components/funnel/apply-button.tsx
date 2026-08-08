"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useFunnel } from "./funnel-context"

export function ApplyButton({
  children = "Apply",
  variant = "solid",
  className,
}: {
  children?: React.ReactNode
  variant?: "solid" | "ghost"
  className?: string
}) {
  const { openApply } = useFunnel()
  return (
    <motion.button
      type="button"
      onClick={openApply}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold tracking-tight transition-colors duration-200",
        variant === "solid"
          ? "bg-white text-black hover:bg-zinc-200"
          : "border border-white/15 bg-transparent text-white hover:border-white/40 hover:bg-white/5",
        className,
      )}
    >
      {children}
    </motion.button>
  )
}
