"use client";

import { cn } from "@/lib/utils";

interface LinesProps {
  className?: string;
}

export function Lines({ className }: LinesProps) {
  return (
    <div className={cn("flex flex-col gap-px", className)}>
      <div className="h-px w-full bg-[var(--theme-primary)]" />
      <div className="h-px w-full bg-[var(--theme-primary)]" />
      <div className="h-px w-full bg-[var(--theme-primary)]" />
    </div>
  );
}
