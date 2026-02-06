"use client"

import { RetroCard } from "@/components/retro-card"
import { Lines } from "@/components/lines"
import { Noise } from "@/components/noise"
import { PlayerCard } from "@/components/player-card"
import { VideoDisplay } from "@/components/video-display"

export function PlayerScreen() {
  return (
    <div className="relative flex flex-1 flex-col gap-2 overflow-y-auto p-2"
      style={{ backgroundColor: "var(--theme-secondary)" }}
    >
      <Noise className="absolute inset-0" density={0.18} />
      <RetroCard
        shadowSize="big"
        containerClassName="relative z-10 min-h-[200px]"
        className="flex flex-col"
      >
        <Lines className="my-1" />
        <VideoDisplay />
      </RetroCard>
      <div className="relative z-10">
        <PlayerCard />
      </div>
    </div>
  )
}
