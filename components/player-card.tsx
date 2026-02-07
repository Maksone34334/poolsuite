"use client";

import {
  ChevronLeft,
  ChevronRight,
  SkipBack,
  Pause,
  Play,
  SkipForward,
  Upload,
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

interface PlayerCardProps {
  onGoToUpload?: () => void;
  apiStatus?: "loading" | "ok" | "error";
}

export function PlayerCard({ onGoToUpload, apiStatus }: PlayerCardProps) {
  const channels = useLibraryStore((s) => s.channels);
  const queue = usePlayerStore(selectQueue);
  const currentTrack = usePlayerStore(selectActiveTrack);
  const isPlaying = usePlayerStore(selectIsPlaying);
  const isBuffering = usePlayerStore(selectIsBuffering);
  const progress = usePlayerStore(selectProgress);

  const playPreviousChannel = () => {
    if (channels.length === 0) return;
    const activeChannelIndex = channels.findIndex(
      (c) => c.id === queue?.channel.id
    );
    const previousChannel = channels[activeChannelIndex - 1];
    playChannel(previousChannel || channels[channels.length - 1]);
  };

  const playNextChannel = () => {
    if (channels.length === 0) return;
    const activeChannelIndex = channels.findIndex(
      (c) => c.id === queue?.channel.id
    );
    const nextChannel = channels[activeChannelIndex + 1];
    playChannel(nextChannel || channels[0]);
  };

  // No track loaded yet - show empty state
  if (!currentTrack) {
    return (
      <RetroCard shadowSize="big" containerClassName="w-full">
        <div className="flex flex-col items-center gap-4 p-8">
          {apiStatus === "loading" && (
            <span className="text-sm font-sans font-bold animate-pulse" style={{ color: "var(--theme-primary)" }}>
              Loading channels...
            </span>
          )}
          {apiStatus === "error" && (
            <>
              <span className="text-sm font-sans text-center" style={{ color: "var(--theme-primary)" }}>
                Could not load radio channels.
              </span>
              <RetroCard onClick={onGoToUpload}>
                <div className="flex items-center gap-2 px-4 py-2">
                  <Upload className="h-3 w-3" />
                  <span className="text-xs font-bold font-sans">Upload Your Music</span>
                </div>
              </RetroCard>
            </>
          )}
          {apiStatus === "ok" && (
            <span className="text-sm font-sans" style={{ color: "var(--theme-primary)" }}>
              Select a channel to start playing
            </span>
          )}
        </div>
      </RetroCard>
    );
  }

  const durationSec = currentTrack.durationMs / 1000;

  return (
    <RetroCard shadowSize="big" containerClassName="w-full">
      <div className="overflow-hidden rounded-sm">
        {/* Channel selector bar */}
        {queue && channels.length > 0 && (
          <div className="flex items-center gap-1 py-3" style={{ backgroundColor: "var(--theme-primary)" }}>
            <button
              onClick={playPreviousChannel}
              className="flex w-12 items-center justify-center"
              style={{ color: "var(--theme-secondary)" }}
              aria-label="Previous channel"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>

            <div className="flex flex-1 justify-center">
              <RetroCard inverted>
                <div className="px-4 py-1.5 text-center">
                  <span className="text-sm" style={{ color: "var(--theme-secondary)" }}>
                    {"Channel: "}
                  </span>
                  <span className="text-sm font-bold" style={{ color: "var(--theme-secondary)" }}>
                    {queue.channel.name}
                  </span>
                </div>
              </RetroCard>
            </div>

            <button
              onClick={playNextChannel}
              className="flex w-12 items-center justify-center"
              style={{ color: "var(--theme-secondary)" }}
              aria-label="Next channel"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Channel name for uploaded music (no channel switcher) */}
        {queue && channels.length === 0 && (
          <div className="flex items-center justify-center py-3" style={{ backgroundColor: "var(--theme-primary)" }}>
            <span className="text-sm font-bold" style={{ color: "var(--theme-secondary)" }}>
              {queue.channel.name}
            </span>
          </div>
        )}

        {/* Waveform */}
        <Waveform
          waveformUrl={currentTrack.waveformUrl}
          progress={progress}
          duration={durationSec}
        />

        <Lines className="mt-2 px-1" />

        {/* Track info & controls */}
        <div className="flex flex-col items-center gap-3 px-6 py-5">
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-sans" style={{ color: "var(--theme-primary)" }}>
              {`${formatDuration(progress)}  /  ${formatDuration(durationSec)}`}
            </span>
            <span className="text-sm font-bold text-center text-balance line-clamp-1" style={{ color: "var(--theme-primary)" }}>
              {currentTrack.title}
            </span>
            <span className="text-sm text-center" style={{ color: "var(--theme-primary)" }}>
              {currentTrack.artist}
            </span>
          </div>

          {/* Playback controls */}
          <div className="flex w-full">
            <RetroCard containerClassName="flex-1" onClick={playPrevious}>
              <div className="flex items-center justify-center py-5">
                <SkipBack className="h-3 w-3" style={{ fill: "var(--theme-primary)" }} />
              </div>
            </RetroCard>
            <RetroCard containerClassName="flex-1 -mx-[3px] z-10" onClick={togglePlay}>
              <div className="flex items-center justify-center py-5">
                {isBuffering ? (
                  <span className="text-xs font-sans animate-pulse">...</span>
                ) : isPlaying ? (
                  <Pause className="h-3 w-3" style={{ fill: "var(--theme-primary)" }} />
                ) : (
                  <Play className="h-3 w-3" style={{ fill: "var(--theme-primary)" }} />
                )}
              </div>
            </RetroCard>
            <RetroCard containerClassName="flex-1" onClick={() => playNext()}>
              <div className="flex items-center justify-center py-5">
                <SkipForward className="h-3 w-3" style={{ fill: "var(--theme-primary)" }} />
              </div>
            </RetroCard>
          </div>
        </div>

        {/* Noise strip at bottom */}
        <div className="relative h-4 overflow-hidden">
          <NoiseOverlay density={0.18} />
        </div>
      </div>
    </RetroCard>
  );
}
