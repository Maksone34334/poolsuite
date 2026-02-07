"use client";

import { RetroCard } from "@/components/retro-card";
import { Lines } from "@/components/lines";
import { NoiseOverlay } from "@/components/noise-overlay";

export function PlayerVideo() {
  return (
    <RetroCard shadowSize="big" containerClassName="w-full flex-1">
      <div className="relative flex h-full min-h-[180px] flex-col overflow-hidden rounded-sm">
        <Lines className="my-1 px-1" />

        <div className="relative flex-1" style={{ backgroundColor: "var(--theme-primary)" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1 items-end">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2"
                    style={{
                      backgroundColor: "var(--theme-secondary)",
                      height: `${16 + i * 6}px`,
                      opacity: 0.2 + (i / 8) * 0.8,
                    }}
                  />
                ))}
              </div>
              <span
                className="text-xs font-sans tracking-wider uppercase"
                style={{ color: "var(--theme-secondary)", opacity: 0.7 }}
              >
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
