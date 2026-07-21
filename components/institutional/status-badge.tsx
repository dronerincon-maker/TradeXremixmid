import { cn } from "@/lib/utils"
import { STATUS_LABEL, type DeliverableStatus } from "@/lib/institutional-config"

export function StatusBadge({
  status,
  note,
  className,
}: {
  status: DeliverableStatus
  note?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.15em]",
        status === "live" && "border-white/30 bg-white/10 text-white",
        status === "building" && "border-white/15 bg-transparent text-zinc-300",
        status === "roadmap" && "border-dashed border-white/15 bg-transparent text-zinc-500",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          status === "live" && "bg-white",
          status === "building" && "bg-zinc-400",
          status === "roadmap" && "bg-zinc-600",
        )}
      />
      {STATUS_LABEL[status]}
      {note ? <span className="text-zinc-500 normal-case tracking-normal">· {note}</span> : null}
    </span>
  )
}
