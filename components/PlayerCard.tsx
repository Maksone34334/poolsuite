"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  SkipBack,
  SkipForward,
  Play,
  Pause,
} from "lucide-react";
import { RetroCard } from "./RetroCard";
import { Lines } from "./Lines";
import { NoiseOverlay } from "./NoiseOverlay";
import { WaveformDisplay } from "./WaveformDisplay";
import { useThemeStore } from "@/theme";
import { selectChannels, useLibraryStore } from "@/store/library";
import {
  playChannel,
  playNext,
  playPrevious,
  selectActiveTrack,
  selectIsPlaying,
  selectProgress,
  selectQueue,
  togglePlay,
  usePlayerStore,
} from "@/store/player";
import { formatDuration } from "@/utils/dateTime";

export function PlayerCard() {
  const theme = useThemeStore((s) => s.theme);
  const channels = useLibraryStore(selectChannels);
  const queue = usePlayerStore(selectQueue);
  const currentTrack = usePlayerStore(selectActiveTrack);
  const isPlaying = usePlayerStore(selectIsPlaying);
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
    <RetroCard shadowSize="big">
      {/* Channel selector */}
      {queue && (
        <div
          className="flex items-center gap-1 py-4"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <button
            type="button"
            className="flex w-16 items-center justify-center cursor-pointer"
            onClick={playPreviousChannel}
          >
            <ChevronLeft
              size={12}
              style={{ color: theme.colors.secondary }}
            />
          </button>

          <div className="flex flex-1 items-center justify-center">
            <RetroCard inverted>
              <div className="px-4 py-2 text-center">
                <span
                  className="font-sans text-lg"
                  style={{ color: theme.colors.secondary }}
                >
                  {"Channel: "}
                </span>
                <span
                  className="font-sans text-sm font-bold"
                  style={{ color: theme.colors.secondary }}
                >
                  {queue.channel?.name}
                </span>
              </div>
            </RetroCard>
          </div>

          <button
            type="button"
            className="flex w-16 items-center justify-center cursor-pointer"
            onClick={playNextChannel}
          >
            <ChevronRight
              size={12}
              style={{ color: theme.colors.secondary }}
            />
          </button>
        </div>
      )}

      {/* Waveform */}
      {currentTrack && (
        <WaveformDisplay
          waveformUrl={currentTrack.waveformUrl}
          progress={progress}
          duration={currentTrack.durationMs / 1000}
        />
      )}

      <Lines className="mt-2" />

      {/* Track info and controls */}
      {currentTrack && (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-6">
          <div className="flex flex-col items-center gap-1">
            <p
              className="font-sans text-lg"
              style={{ color: theme.colors.primary }}
            >
              {`${formatDuration(progress)}  /  ${formatDuration(currentTrack.durationMs / 1000)}`}
            </p>
            <p
              className="font-sans text-sm font-bold text-center truncate max-w-full"
              style={{ color: theme.colors.primary }}
            >
              {currentTrack.title}
            </p>
            <p
              className="font-sans text-lg text-center"
              style={{ color: theme.colors.primary }}
            >
              {currentTrack.artist}
            </p>
          </div>

          {/* Play controls */}
          <div className="flex w-full">
            <div className="flex-1">
              <RetroCard onClick={playPrevious}>
                <div
                  className="flex items-center justify-center py-6"
                  style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                >
                  <SkipBack size={12} fill={theme.colors.primary} style={{ color: theme.colors.primary }} />
                </div>
              </RetroCard>
            </div>
            <div className="flex-1 -mx-[5px] relative z-10">
              <RetroCard onClick={togglePlay}>
                <div className="flex items-center justify-center py-6">
                  {isPlaying ? (
                    <Pause size={12} fill={theme.colors.primary} style={{ color: theme.colors.primary }} />
                  ) : (
                    <Play size={12} fill={theme.colors.primary} style={{ color: theme.colors.primary }} />
                  )}
                </div>
              </RetroCard>
            </div>
            <div className="flex-1">
              <RetroCard onClick={() => playNext()}>
                <div
                  className="flex items-center justify-center py-6"
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                >
                  <SkipForward size={12} fill={theme.colors.primary} style={{ color: theme.colors.primary }} />
                </div>
              </RetroCard>
            </div>
          </div>
        </div>
      )}

      {/* Bottom noise */}
      <div className="relative h-4 overflow-hidden">
        <NoiseOverlay density={0.18} />
      </div>
    </RetroCard>
  );
}
