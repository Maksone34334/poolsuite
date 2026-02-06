"use client"

import { usePlayerStore } from "@/lib/player-store"

interface PlayerBarProps {
  onPress: () => void
}

export function PlayerBar({ onPress }: PlayerBarProps) {
  const currentTrack = usePlayerStore((s) => s.currentTrack)

  return (
    <button
      onClick={onPress}
      className="absolute inset-x-0 bottom-0 z-20 flex h-[50px] items-center gap-4 border-t px-4"
      style={{
        backgroundColor: "var(--theme-secondary)",
        borderColor: "var(--theme-primary)",
        color: "var(--theme-primary)",
      }}
    >
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <span className="truncate text-sm font-bold">
          {currentTrack?.title || "No track selected"}
        </span>
        <span className="truncate text-xs">
          {currentTrack?.artist || ""}
        </span>
      </div>
    </button>
  )
}
