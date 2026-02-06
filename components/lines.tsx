"use client";

import { cn } from "@/lib/utils";

interface LinesProps {
  count?: number;
  className?: string;
}

export function Lines({ count = 4, className }: LinesProps) {
  return (
    <div className={cn("flex w-full flex-col gap-[1px]", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-px w-full bg-primary" />
      ))}
    </div>
  );
}
