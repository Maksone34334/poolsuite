"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, Music, Trash2, Play, Pause } from "lucide-react";
import { RetroCard } from "@/components/retro-card";
import { NoiseOverlay } from "@/components/noise-overlay";
import { Lines } from "@/components/lines";
import {
  usePlayerStore,
  playChannel,
  togglePlay,
  selectQueue,
  selectActiveTrack,
  selectIsPlaying,
} from "@/lib/store/player";
import type { Channel, Track } from "@/lib/store/library";

let uploadId = 0;

function createTrackFromFile(file: File): Track {
  uploadId++;
  const url = URL.createObjectURL(file);
  const name = file.name.replace(/\.[^/.]+$/, "");
  return {
    id: `upload-${uploadId}-${Date.now()}`,
    url,
    title: name,
    artist: "My Music",
    durationMs: 0,
    dateAdded: new Date().toISOString(),
    waveformUrl: "",
    soundcloudUrl: "",
  };
}

export function UploadScreen() {
  const [uploadedTracks, setUploadedTracks] = useState<Track[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queue = usePlayerStore(selectQueue);
  const activeTrack = usePlayerStore(selectActiveTrack);
  const isPlaying = usePlayerStore(selectIsPlaying);
  const isMyMusicQueue = queue?.channel.id === "my-music";

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const audioFiles = Array.from(files).filter((f) =>
      f.type.startsWith("audio/")
    );
    const newTracks = audioFiles.map(createTrackFromFile);
    setUploadedTracks((prev) => [...prev, ...newTracks]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const removeTrack = useCallback((id: string) => {
    setUploadedTracks((prev) => {
      const track = prev.find((t) => t.id === id);
      if (track) URL.revokeObjectURL(track.url);
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const playAll = useCallback(() => {
    if (uploadedTracks.length === 0) return;
    const channel: Channel = {
      id: "my-music",
      url: "",
      name: "My Music",
      slug: "my-music",
      totalTracks: uploadedTracks.length,
      tracks: uploadedTracks,
      order: 999,
    };
    playChannel(channel, true);
  }, [uploadedTracks]);

  const playTrackAt = useCallback(
    (index: number) => {
      if (uploadedTracks.length === 0) return;
      // Reorder tracks so the clicked one is first, rest follow in order
      const reordered = [
        ...uploadedTracks.slice(index),
        ...uploadedTracks.slice(0, index),
      ];
      const channel: Channel = {
        id: "my-music",
        url: "",
        name: "My Music",
        slug: "my-music",
        totalTracks: reordered.length,
        tracks: reordered,
        order: 999,
      };
      playChannel(channel, true);
    },
    [uploadedTracks]
  );

  const handleTrackClick = useCallback(
    (track: Track, index: number) => {
      // If this track is already playing, toggle play/pause
      if (isMyMusicQueue && activeTrack?.id === track.id) {
        togglePlay();
      } else {
        playTrackAt(index);
      }
    },
    [isMyMusicQueue, activeTrack, playTrackAt]
  );

  return (
    <div className="relative flex-1 overflow-y-auto bg-background">
      <NoiseOverlay density={0.05} inverted />
      <div className="relative z-10 flex flex-col gap-2 p-2">
        {/* Drop zone */}
        <RetroCard shadowSize="big" containerClassName="w-full">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="flex flex-col items-center gap-3 rounded-[var(--radius)] p-6"
            style={{
              backgroundColor: isDragOver
                ? "var(--theme-primary)"
                : undefined,
              color: isDragOver ? "var(--theme-secondary)" : undefined,
            }}
          >
            <Upload className="h-8 w-8" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-bold font-sans">
                Upload Your Music
              </span>
              <span className="text-xs font-sans text-center opacity-70">
                Drag & drop audio files here, or click below
              </span>
            </div>
            <RetroCard
              onClick={() => fileInputRef.current?.click()}
              inverted={isDragOver}
            >
              <span className="block px-6 py-2 text-xs font-bold font-sans">
                Choose Files
              </span>
            </RetroCard>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
        </RetroCard>

        {/* Track list */}
        {uploadedTracks.length > 0 && (
          <RetroCard shadowSize="big" containerClassName="w-full">
            <div className="flex flex-col rounded-[var(--radius)]">
              {/* Header */}
              <div className="flex items-center justify-between bg-foreground p-3">
                <span className="text-sm font-bold font-sans text-primary-foreground">
                  {`My Music (${uploadedTracks.length})`}
                </span>
                <RetroCard inverted onClick={playAll}>
                  <div className="flex items-center gap-1.5 px-3 py-1">
                    <Play className="h-3 w-3 fill-primary-foreground" />
                    <span className="text-xs font-bold font-sans text-primary-foreground">
                      {isMyMusicQueue && isPlaying ? "Playing" : "Play All"}
                    </span>
                  </div>
                </RetroCard>
              </div>

              <Lines className="px-1" />

              {/* Tracks */}
              <div className="flex flex-col">
                {uploadedTracks.map((track, i) => {
                  const isActive =
                    isMyMusicQueue && activeTrack?.id === track.id;
                  const isTrackPlaying = isActive && isPlaying;
                  return (
                    <button
                      key={track.id}
                      onClick={() => handleTrackClick(track, i)}
                      className="flex items-center gap-3 border-b border-foreground/10 px-4 py-3 text-left transition-colors last:border-b-0 hover:opacity-70"
                      style={
                        isActive
                          ? {
                              backgroundColor: "var(--theme-primary)",
                              color: "var(--theme-secondary)",
                            }
                          : undefined
                      }
                    >
                      <span
                        className="w-5 text-right text-xs font-sans"
                        style={{
                          color: isActive
                            ? "var(--theme-secondary)"
                            : undefined,
                          opacity: isActive ? 0.6 : 0.4,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {isTrackPlaying ? (
                        <Pause className="h-3 w-3 flex-shrink-0 fill-current" />
                      ) : isActive ? (
                        <Play className="h-3 w-3 flex-shrink-0 fill-current" />
                      ) : (
                        <Music className="h-3 w-3 flex-shrink-0" />
                      )}
                      <span className="flex-1 truncate text-xs font-sans font-bold">
                        {track.title}
                      </span>
                      <span
                        className="flex h-6 w-6 items-center justify-center"
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTrack(track.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.stopPropagation();
                            removeTrack(track.id);
                          }
                        }}
                        aria-label={`Remove ${track.title}`}
                      >
                        <Trash2 className="h-3 w-3 opacity-40 hover:opacity-100" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </RetroCard>
        )}
      </div>
    </div>
  );
}
