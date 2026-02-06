import { cn } from "@/lib/utils";

interface LinesProps {
  className?: string;
}

export function Lines({ className }: LinesProps) {
  return (
    <div className={cn("flex flex-col gap-[2px]", className)}>
      <div className="h-px w-full bg-foreground" />
      <div className="h-px w-full bg-foreground" />
      <div className="h-px w-full bg-foreground" />
    </div>
  );
}
