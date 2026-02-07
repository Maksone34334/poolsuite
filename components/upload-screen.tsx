"use client";

import { useCallback, useRef, useState } from "react";
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

/* Inline SVG icons */
function IconUpload({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconMusic({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function IconPlay({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="6,4 20,12 6,20" />
    </svg>
  );
}

function IconPause({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function IconTrash({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
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

  const removeTrack = useCallback((id: string) => {
    setUploadedTracks((prev) => {
      const track = prev.find((t) => t.id === id);
      if (track) URL.revokeObjectURL(track.url);
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const makeChannel = useCallback(
    (tracks: Track[]): Channel => ({
      id: "my-music",
      url: "",
      name: "My Music",
      slug: "my-music",
      totalTracks: tracks.length,
      tracks,
      order: 999,
    }),
    []
  );

  const playAll = useCallback(() => {
    if (uploadedTracks.length === 0) return;
    playChannel(makeChannel(uploadedTracks), true);
  }, [uploadedTracks, makeChannel]);

  const playTrackAt = useCallback(
    (index: number) => {
      if (uploadedTracks.length === 0) return;
      const reordered = [
        ...uploadedTracks.slice(index),
        ...uploadedTracks.slice(0, index),
      ];
      playChannel(makeChannel(reordered), true);
    },
    [uploadedTracks, makeChannel]
  );

  const handleTrackClick = useCallback(
    (track: Track, index: number) => {
      if (isMyMusicQueue && activeTrack?.id === track.id) {
        togglePlay();
      } else {
        playTrackAt(index);
      }
    },
    [isMyMusicQueue, activeTrack, playTrackAt]
  );

  return (
    <div
      className="relative flex-1 overflow-y-auto"
      style={{ backgroundColor: "var(--theme-secondary)" }}
    >
      <NoiseOverlay density={0.05} inverted />
      <div className="relative z-10 flex flex-col gap-2 p-2">
        {/* Drop zone */}
        <RetroCard shadowSize="big" containerClassName="w-full">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            className="flex flex-col items-center gap-4 rounded-sm p-8"
            style={{
              backgroundColor: isDragOver
                ? "var(--theme-primary)"
                : undefined,
              color: isDragOver ? "var(--theme-secondary)" : undefined,
            }}
          >
            <IconUpload size={32} />
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
              <span className="block px-8 py-3 text-sm font-bold font-sans">
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
            <div className="flex flex-col rounded-sm">
              {/* Header */}
              <div
                className="flex items-center justify-between p-3"
                style={{
                  backgroundColor: "var(--theme-primary)",
                  color: "var(--theme-secondary)",
                }}
              >
                <span className="text-sm font-bold font-sans">
                  {`My Music (${uploadedTracks.length})`}
                </span>
                <RetroCard inverted onClick={playAll}>
                  <div className="flex items-center gap-2 px-4 py-1.5">
                    <IconPlay size={12} />
                    <span className="text-xs font-bold font-sans">
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
                      className="flex items-center gap-3 px-4 py-3 text-left transition-opacity last:border-b-0 hover:opacity-70"
                      style={{
                        backgroundColor: isActive
                          ? "var(--theme-primary)"
                          : undefined,
                        color: isActive
                          ? "var(--theme-secondary)"
                          : "var(--theme-primary)",
                        borderBottom: "1px solid",
                        borderColor: isActive
                          ? "transparent"
                          : "var(--theme-primary)",
                      }}
                    >
                      <span
                        className="w-5 text-right text-xs font-sans"
                        style={{ opacity: isActive ? 0.6 : 0.4 }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {isTrackPlaying ? (
                        <IconPause size={12} />
                      ) : isActive ? (
                        <IconPlay size={12} />
                      ) : (
                        <IconMusic size={12} />
                      )}
                      <span className="flex-1 truncate text-xs font-sans font-bold">
                        {track.title}
                      </span>
                      <span
                        className="flex h-6 w-6 items-center justify-center opacity-40 hover:opacity-100"
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
                        <IconTrash size={12} />
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
