"use client"

import { usePlayerStore } from "@/lib/player-store"
import { formatDuration } from "@/lib/utils"
import { RetroCard } from "@/components/retro-card"
import { Lines } from "@/components/lines"
import { Noise } from "@/components/noise"
import { Waveform } from "@/components/waveform"
import {
  ChevronLeft,
  ChevronRight,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Loader2,
} from "lucide-react"

export function PlayerCard() {
  const currentChannel = usePlayerStore((s) => s.currentChannel)
  const currentTrack = usePlayerStore((s) => s.currentTrack)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const isLoading = usePlayerStore((s) => s.isLoading)
  const progress = usePlayerStore((s) => s.progress)
  const togglePlay = usePlayerStore((s) => s.togglePlay)
  const playNext = usePlayerStore((s) => s.playNext)
  const playPrevious = usePlayerStore((s) => s.playPrevious)
  const nextChannel = usePlayerStore((s) => s.nextChannel)
  const previousChannel = usePlayerStore((s) => s.previousChannel)

  return (
    <RetroCard shadowSize="big">
      {/* Channel selector */}
      {currentChannel && (
        <div
          className="flex items-center py-4"
          style={{ backgroundColor: "var(--theme-primary)" }}
        >
          <button
            onClick={previousChannel}
            className="flex w-16 items-center justify-center"
            style={{ color: "var(--theme-secondary)" }}
            aria-label="Previous channel"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex flex-1 justify-center">
            <RetroCard inverted className="px-4 py-2">
              <p className="text-center text-sm font-bold">
                <span className="font-normal" style={{ fontSize: "0.875rem" }}>
                  {"Channel: "}
                </span>
                {currentChannel.name}
              </p>
            </RetroCard>
          </div>
          <button
            onClick={nextChannel}
            className="flex w-16 items-center justify-center"
            style={{ color: "var(--theme-secondary)" }}
            aria-label="Next channel"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Waveform */}
      {currentTrack && (
        <Waveform
          waveformUrl={currentTrack.waveformUrl}
          progress={progress}
          duration={currentTrack.durationMs / 1000}
        />
      )}

      <Lines className="mt-2" />

      {/* Track info and controls */}
      {currentTrack && (
        <div className="flex flex-col items-center gap-3 px-6 py-6">
          <div className="flex flex-col items-center gap-1">
            <p className="text-lg tabular-nums">
              {formatDuration(progress)}
              {"  /  "}
              {formatDuration(currentTrack.durationMs / 1000)}
            </p>
            <p className="max-w-full truncate text-center text-sm font-bold leading-tight">
              {currentTrack.title}
            </p>
            <p className="text-center text-lg">{currentTrack.artist}</p>
          </div>

          {/* Playback controls */}
          <div className="flex w-full">
            <RetroCard
              containerClassName="flex-1"
              className="flex items-center justify-center rounded-r-none py-6"
              onClick={playPrevious}
            >
              <SkipBack className="h-4 w-4 fill-current" />
            </RetroCard>
            <RetroCard
              containerClassName="flex-1 -mx-[3px]"
              className="flex items-center justify-center rounded-none py-6"
              onClick={togglePlay}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current" />
              )}
            </RetroCard>
            <RetroCard
              containerClassName="flex-1"
              className="flex items-center justify-center rounded-l-none py-6"
              onClick={() => playNext()}
            >
              <SkipForward className="h-4 w-4 fill-current" />
            </RetroCard>
          </div>
        </div>
      )}

      {/* Bottom noise strip */}
      <div className="relative h-4 w-full overflow-hidden">
        <Noise className="absolute inset-0" density={0.18} />
      </div>
    </RetroCard>
  )
}
