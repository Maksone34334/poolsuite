"use client";

import { useEffect, useState, useCallback } from "react";
import { NavigationBar } from "@/components/navigation-bar";
import { PlayerCard } from "@/components/player-card";
import { PlayerVideo } from "@/components/player-video";
import { ThemesScreen } from "@/components/themes-screen";
import { AboutScreen } from "@/components/about-screen";
import { UploadScreen } from "@/components/upload-screen";
import { NoiseOverlay } from "@/components/noise-overlay";
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
  const [apiStatus, setApiStatus] = useState<"loading" | "ok" | "error">("loading");
  const currentTrack = usePlayerStore(selectActiveTrack);
  const isPlaying = usePlayerStore(selectIsPlaying);

  useEffect(() => {
    const storedTheme = getStoredTheme();
    applyTheme(storedTheme);
    setCurrentThemeName(storedTheme);

    initLibrary()
      .then((channels) => {
        if (channels.length > 0) {
          setApiStatus("ok");
          if (!usePlayerStore.getState().queue) {
            playChannel(channels[0], false);
          }
        } else {
          setApiStatus("error");
        }
      })
      .catch(() => {
        setApiStatus("error");
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

  const goToUpload = useCallback(() => {
    setActiveIndex(1);
  }, []);

  return (
    <div className="flex h-dvh flex-col overflow-hidden" style={{ backgroundColor: "var(--theme-secondary)", color: "var(--theme-primary)" }}>
      <NavigationBar
        screens={screens}
        activeIndex={activeIndex}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />

      <div className="relative flex-1 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {/* Player */}
          <div className="flex h-full w-full flex-shrink-0 flex-col overflow-y-auto">
            <div className="relative flex flex-1 flex-col gap-2 p-2">
              <NoiseOverlay density={0.18} />
              <div className="relative z-10 flex flex-1 flex-col gap-2">
                <PlayerVideo />
                <PlayerCard onGoToUpload={goToUpload} apiStatus={apiStatus} />
              </div>
            </div>
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

      {/* Mini player bar */}
      {activeIndex !== 0 && currentTrack && (
        <button
          onClick={goToPlayer}
          className="flex items-center gap-3 border-t px-4 py-3 text-left"
          style={{
            backgroundColor: "var(--theme-secondary)",
            borderColor: "var(--theme-primary)",
            color: "var(--theme-primary)",
          }}
        >
          <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
            <span className="truncate text-xs font-bold font-sans">
              {currentTrack.title}
            </span>
            <span className="truncate text-xs font-sans opacity-60">
              {currentTrack.artist}
            </span>
          </div>
          <div className="flex h-6 w-6 items-center justify-center">
            {isPlaying ? (
              <div className="flex gap-0.5 items-end">
                <div className="w-0.5 h-3 animate-pulse" style={{ backgroundColor: "var(--theme-primary)" }} />
                <div className="w-0.5 h-2 animate-pulse" style={{ backgroundColor: "var(--theme-primary)", animationDelay: "0.15s" }} />
                <div className="w-0.5 h-4 animate-pulse" style={{ backgroundColor: "var(--theme-primary)", animationDelay: "0.3s" }} />
              </div>
            ) : (
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--theme-primary)" }} />
            )}
          </div>
        </button>
      )}
    </div>
  );
}
