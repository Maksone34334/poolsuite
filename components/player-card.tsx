"use client";

import {
  ChevronLeft,
  ChevronRight,
  SkipBack,
  Pause,
  Play,
  SkipForward,
} from "lucide-react";
import { RetroCard } from "@/components/retro-card";
import { Lines } from "@/components/lines";
import { Waveform } from "@/components/waveform";
import { NoiseOverlay } from "@/components/noise-overlay";
import { useLibraryStore, Channel } from "@/lib/store/library";
import {
  usePlayerStore,
  selectQueue,
  selectActiveTrack,
  selectIsPlaying,
  selectProgress,
  selectIsBuffering,
  playChannel,
  playNext,
  playPrevious,
  togglePlay,
  formatDuration,
} from "@/lib/store/player";

export function PlayerCard() {
  const channels = useLibraryStore((s) => s.channels);
  const queue = usePlayerStore(selectQueue);
  const currentTrack = usePlayerStore(selectActiveTrack);
  const isPlaying = usePlayerStore(selectIsPlaying);
  const isBuffering = usePlayerStore(selectIsBuffering);
  const progress = usePlayerStore(selectProgress);

  const playPreviousChannel = () => {
    const activeChannelIndex = channels.findIndex(
      (c) => c.id === queue?.channel.id
    );
    const previousChannel = channels[activeChannelIndex - 1];
    playChannel(previousChannel || channels[channels.length - 1]);
  };

  const playNextChannel = () => {
    const activeChannelIndex = channels.findIndex(
      (c) => c.id === queue?.channel.id
    );
    const nextChannel = channels[activeChannelIndex + 1];
    playChannel(nextChannel || channels[0]);
  };

  return (
    <RetroCard shadowSize="big" containerClassName="w-full">
      <div className="overflow-hidden rounded-[var(--radius)]">
        {/* Channel selector */}
        {queue && (
          <div className="flex items-center gap-1 bg-foreground py-3">
            <button
              onClick={playPreviousChannel}
              className="flex w-12 items-center justify-center text-primary-foreground"
              aria-label="Previous channel"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>

            <div className="flex flex-1 justify-center">
              <RetroCard inverted>
                <div className="px-4 py-1.5 text-center">
                  <span className="text-sm text-primary-foreground">
                    {"Channel: "}
                  </span>
                  <span className="text-sm font-bold text-primary-foreground">
                    {queue.channel?.name}
                  </span>
                </div>
              </RetroCard>
            </div>

            <button
              onClick={playNextChannel}
              className="flex w-12 items-center justify-center text-primary-foreground"
              aria-label="Next channel"
            >
              <ChevronRight className="h-3 w-3" />
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

        <Lines className="mt-2 px-1" />

        {/* Track info & controls */}
        {currentTrack && (
          <div className="flex flex-col items-center gap-3 px-6 py-5">
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-sans text-foreground">
                {`${formatDuration(progress)}  /  ${formatDuration(currentTrack.durationMs / 1000)}`}
              </span>
              <span className="text-sm font-bold text-foreground text-center text-balance line-clamp-1">
                {currentTrack.title}
              </span>
              <span className="text-sm text-foreground text-center">
                {currentTrack.artist}
              </span>
            </div>

            {/* Playback controls */}
            <div className="flex w-full">
              <RetroCard
                containerClassName="flex-1"
                onClick={playPrevious}
              >
                <div className="flex items-center justify-center py-5">
                  <SkipBack className="h-3 w-3 fill-foreground" />
                </div>
              </RetroCard>
              <RetroCard
                containerClassName="flex-1 -mx-[3px] z-10"
                onClick={togglePlay}
              >
                <div className="flex items-center justify-center py-5 rounded-none">
                  {isBuffering ? (
                    <span className="text-xs font-sans animate-pulse">...</span>
                  ) : isPlaying ? (
                    <Pause className="h-3 w-3 fill-foreground" />
                  ) : (
                    <Play className="h-3 w-3 fill-foreground" />
                  )}
                </div>
              </RetroCard>
              <RetroCard
                containerClassName="flex-1"
                onClick={() => playNext()}
              >
                <div className="flex items-center justify-center py-5">
                  <SkipForward className="h-3 w-3 fill-foreground" />
                </div>
              </RetroCard>
            </div>
          </div>
        )}

        {/* Noise strip at bottom */}
        <div className="relative h-4 overflow-hidden">
          <NoiseOverlay density={0.18} />
        </div>
      </div>
    </RetroCard>
  );
}
