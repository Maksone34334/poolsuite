"use client";

import { NoiseOverlay } from "@/components/noise-overlay";
import { PlayerVideo } from "@/components/player-video";
import { PlayerCard } from "@/components/player-card";

interface PlayerScreenProps {
  isLoading: boolean;
  error: string | null;
}

export function PlayerScreen({ isLoading, error }: PlayerScreenProps) {
  if (isLoading) {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center gap-3 bg-background p-2">
        <NoiseOverlay density={0.18} />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <span className="text-sm font-sans font-bold text-foreground animate-pulse">
            Loading channels...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center gap-3 bg-background p-2">
        <NoiseOverlay density={0.18} />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <span className="text-sm font-sans text-foreground">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col gap-2 bg-background p-2">
      <NoiseOverlay density={0.18} />
      <div className="relative z-10 flex flex-1 flex-col gap-2">
        <PlayerVideo />
        <PlayerCard />
      </div>
    </div>
  );
}
