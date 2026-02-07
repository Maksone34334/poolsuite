import { cn } from "@/lib/utils";

interface LinesProps {
  className?: string;
}

export function Lines({ className }: LinesProps) {
  return (
    <div className={cn("flex flex-col gap-[2px]", className)}>
      <div className="h-px w-full" style={{ backgroundColor: "var(--theme-primary)" }} />
      <div className="h-px w-full" style={{ backgroundColor: "var(--theme-primary)" }} />
      <div className="h-px w-full" style={{ backgroundColor: "var(--theme-primary)" }} />
    </div>
  );
}
