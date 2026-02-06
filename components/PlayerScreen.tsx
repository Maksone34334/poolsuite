"use client";

import React from "react";
import { RetroCard } from "./RetroCard";
import { Lines } from "./Lines";
import { NoiseOverlay } from "./NoiseOverlay";
import { PlayerCard } from "./PlayerCard";
import { PlayerVideo } from "./PlayerVideo";

export function PlayerScreen() {
  return (
    <div className="relative flex flex-1 flex-col gap-2 p-2 pb-2 bg-[var(--theme-secondary)]">
      <NoiseOverlay density={0.18} />
      <RetroCard shadowSize="big" className="flex-1">
        <div className="flex h-full flex-col">
          <Lines className="my-1" />
          <PlayerVideo />
        </div>
      </RetroCard>
      <PlayerCard />
    </div>
  );
}
