"use client";

import { RetroCard } from "@/components/retro-card";
import { Lines } from "@/components/lines";
import { NoiseOverlay } from "@/components/noise-overlay";

export function PlayerVideo() {
  return (
    <RetroCard shadowSize="big" containerClassName="w-full flex-1">
      <div className="relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-[var(--radius)]">
        <Lines className="my-1 px-1" />

        {/* Retro video placeholder with animated gradient */}
        <div className="relative flex-1 bg-foreground">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 w-2 bg-primary-foreground"
                    style={{
                      opacity: 0.2 + (i / 8) * 0.8,
                      animation: `pulse 2s ease-in-out ${i * 0.15}s infinite`,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs font-sans text-primary-foreground/70 tracking-wider uppercase">
                Poolsuite FM
              </span>
            </div>
          </div>
          <NoiseOverlay density={0.08} inverted />
        </div>
      </div>
    </RetroCard>
  );
}
