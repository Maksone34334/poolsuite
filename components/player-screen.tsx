"use client";

import { RetroCard } from "@/components/retro-card";
import { Lines } from "@/components/lines";
import { Noise } from "@/components/noise";
import { PlayerCard } from "@/components/player-card";

export function PlayerScreen() {
  return (
    <div className="relative flex flex-1 flex-col gap-2 bg-secondary p-2">
      <Noise className="absolute inset-0" density={0.18} />
      <RetroCard shadowSize="big" containerClassName="relative z-10 flex-1" className="flex flex-col flex-1">
        <Lines className="my-1" />
        <div className="flex flex-1 items-center justify-center bg-primary p-4">
          <p className="text-center text-lg text-secondary font-bold">Poolsuite FM</p>
        </div>
      </RetroCard>
      <div className="relative z-10">
        <PlayerCard />
      </div>
    </div>
  );
}
