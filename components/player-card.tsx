"use client";

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

  if (!currentTrack) {
    return (
      <RetroCard shadowSize="big" containerClassName="w-full">
        <div className="flex flex-col items-center gap-4 p-8">
          {apiStatus === "loading" && (
            <span
              className="text-sm font-sans font-bold animate-pulse"
              style={{ color: "var(--theme-primary)" }}
            >
              Loading channels...
            </span>
          )}
          {(apiStatus === "error" || apiStatus === "ok") && (
            <>
              <span
                className="text-sm font-sans text-center"
                style={{ color: "var(--theme-primary)" }}
              >
                {apiStatus === "error"
                  ? "Radio channels unavailable"
                  : "No track selected"}
              </span>
              <RetroCard onClick={onGoToUpload}>
                <div className="flex items-center gap-2 px-6 py-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-sm font-bold font-sans">
                    Upload Your Music
                  </span>
                </div>
              </RetroCard>
            </>
          )}
        </div>
      </RetroCard>
    );
  }

  const durationSec = currentTrack.durationMs / 1000;

  return (
    <RetroCard shadowSize="big" containerClassName="w-full">
      <div className="overflow-hidden rounded-sm">
        {/* Channel selector */}
        {queue && channels.length > 0 && (
          <div
            className="flex items-center gap-1 py-3"
            style={{ backgroundColor: "var(--theme-primary)" }}
          >
            <button
              onClick={playPreviousChannel}
              className="flex w-12 items-center justify-center"
              style={{ color: "var(--theme-secondary)" }}
              aria-label="Previous channel"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="flex flex-1 justify-center">
              <RetroCard inverted>
                <div className="px-4 py-1.5 text-center">
                  <span
                    className="text-sm"
                    style={{ color: "var(--theme-secondary)" }}
                  >
                    {"Channel: "}
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "var(--theme-secondary)" }}
                  >
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}

        {/* Channel header for uploaded music */}
        {queue && channels.length === 0 && (
          <div
            className="flex items-center justify-center py-3"
            style={{
              backgroundColor: "var(--theme-primary)",
              color: "var(--theme-secondary)",
            }}
          >
            <span className="text-sm font-bold">{queue.channel.name}</span>
          </div>
        )}

        {/* Waveform */}
        <Waveform
          waveformUrl={currentTrack.waveformUrl}
          progress={progress}
          duration={durationSec}
        />

        <Lines className="mt-2 px-1" />

        {/* Track info */}
        <div className="flex flex-col items-center gap-3 px-6 py-5">
          <div className="flex flex-col items-center gap-1">
            <span
              className="text-sm font-sans"
              style={{ color: "var(--theme-primary)" }}
            >
              {`${formatDuration(progress)}  /  ${formatDuration(durationSec)}`}
            </span>
            <span
              className="text-sm font-bold text-center text-balance line-clamp-2"
              style={{ color: "var(--theme-primary)" }}
            >
              {currentTrack.title}
            </span>
            <span
              className="text-sm text-center"
              style={{ color: "var(--theme-primary)" }}
            >
              {currentTrack.artist}
            </span>
          </div>

          {/* Playback controls -- inline SVG icons for reliability */}
          <div className="flex w-full">
            <RetroCard containerClassName="flex-1" onClick={playPrevious}>
              <div className="flex items-center justify-center py-4">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="19,20 9,12 19,4" />
                  <rect x="5" y="4" width="2" height="16" />
                </svg>
              </div>
            </RetroCard>
            <RetroCard
              containerClassName="flex-1 -mx-[3px] z-10"
              onClick={togglePlay}
            >
              <div className="flex items-center justify-center py-4">
                {isBuffering ? (
                  <span className="text-sm font-sans font-bold animate-pulse">
                    ...
                  </span>
                ) : isPlaying ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                  >
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                  >
                    <polygon points="6,4 20,12 6,20" />
                  </svg>
                )}
              </div>
            </RetroCard>
            <RetroCard containerClassName="flex-1" onClick={() => playNext()}>
              <div className="flex items-center justify-center py-4">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="5,4 15,12 5,20" />
                  <rect x="17" y="4" width="2" height="16" />
                </svg>
              </div>
            </RetroCard>
          </div>

          {/* Go to My Music button */}
          {onGoToUpload && (
            <RetroCard containerClassName="w-full" onClick={onGoToUpload}>
              <div className="flex items-center justify-center gap-2 py-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-xs font-bold font-sans">
                  Upload Your Music
                </span>
              </div>
            </RetroCard>
          )}
        </div>

        <div className="relative h-4 overflow-hidden">
          <NoiseOverlay density={0.18} />
        </div>
      </div>
    </RetroCard>
  );
}
