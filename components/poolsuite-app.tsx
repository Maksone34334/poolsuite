"use client";

import { useEffect, useState, useCallback } from "react";
import { NavigationBar } from "@/components/navigation-bar";
import { PlayerScreen } from "@/components/player-screen";
import { ThemesScreen } from "@/components/themes-screen";
import { AboutScreen } from "@/components/about-screen";
import { UploadScreen } from "@/components/upload-screen";
import { initLibrary, useLibraryStore } from "@/lib/store/library";
import {
  playChannel,
  usePlayerStore,
  selectActiveTrack,
  selectIsPlaying,
} from "@/lib/store/player";
import { applyTheme, getStoredTheme, defaultThemeName } from "@/lib/theme";

const screens = [
  { id: "Player", name: "Poolsuite FM" },
  { id: "MyMusic", name: "My Music" },
  { id: "Themes", name: "Themes" },
  { id: "About", name: "About" },
];

export function PoolsuiteApp() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentThemeName, setCurrentThemeName] = useState(defaultThemeName);
  const isLoading = useLibraryStore((s) => s.isLoading);
  const error = useLibraryStore((s) => s.error);
  const currentTrack = usePlayerStore(selectActiveTrack);
  const isPlaying = usePlayerStore(selectIsPlaying);

  // Initialize theme and library
  useEffect(() => {
    const storedTheme = getStoredTheme();
    applyTheme(storedTheme);
    setCurrentThemeName(storedTheme);

    initLibrary().then((channels) => {
      if (channels.length > 0 && !usePlayerStore.getState().queue) {
        playChannel(channels[0], false);
      }
    });
  }, []);

  const goToPrevious = useCallback(() => {
    setActiveIndex((i) => Math.max(0, i - 1));
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((i) => Math.min(screens.length - 1, i + 1));
  }, []);

  const goToPlayer = useCallback(() => {
    setActiveIndex(0);
  }, []);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <NavigationBar
        screens={screens}
        activeIndex={activeIndex}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />

      <div className="relative flex-1 overflow-hidden">
        {/* Slide container */}
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {/* Player */}
          <div className="flex h-full w-full flex-shrink-0 flex-col">
            <PlayerScreen isLoading={isLoading} error={error} />
          </div>

          {/* My Music */}
          <div className="flex h-full w-full flex-shrink-0 flex-col">
            <UploadScreen />
          </div>

          {/* Themes */}
          <div className="flex h-full w-full flex-shrink-0 flex-col">
            <ThemesScreen
              currentThemeName={currentThemeName}
              onThemeChange={setCurrentThemeName}
            />
          </div>

          {/* About */}
          <div className="flex h-full w-full flex-shrink-0 flex-col">
            <AboutScreen />
          </div>
        </div>
      </div>

      {/* Mini player bar (visible when not on Player tab) */}
      {activeIndex !== 0 && currentTrack && (
        <button
          onClick={goToPlayer}
          className="flex items-center gap-3 border-t bg-background px-4 py-3 text-left transition-colors hover:bg-muted"
        >
          <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
            <span className="truncate text-xs font-bold font-sans text-foreground">
              {currentTrack.title}
            </span>
            <span className="truncate text-xs font-sans text-muted-foreground">
              {currentTrack.artist}
            </span>
          </div>
          <div className="flex h-6 w-6 items-center justify-center">
            {isPlaying ? (
              <div className="flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-foreground"
                    style={{
                      height: `${8 + Math.random() * 8}px`,
                      animation: `pulse 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="h-2 w-2 rounded-full bg-foreground" />
            )}
          </div>
        </button>
      )}
    </div>
  );
}
