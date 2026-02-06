"use client";

import { ScreenSlider } from "@/components/ScreenSlider";
import { PlayerScreen } from "@/components/PlayerScreen";
import { ThemesScreen } from "@/components/ThemesScreen";
import { AboutScreen } from "@/components/AboutScreen";
import { useEffect, useState } from "react";
import { initLibrary } from "@/store/library";
import { playChannel, usePlayerStore } from "@/store/player";

const screens = [
  { id: "Player", name: "Poolsuite FM", Component: PlayerScreen },
  { id: "Themes", name: "Themes", Component: ThemesScreen },
  { id: "About", name: "About", Component: AboutScreen },
];

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initLibrary()
      .then((channels) => {
        if (!usePlayerStore.getState().queue) {
          playChannel(channels[0], false);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--theme-secondary)]">
        <div className="flex flex-col items-center gap-4">
          <p className="font-sans text-lg font-bold text-[var(--theme-primary)] animate-pulse">
            Loading Poolsuite FM...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto h-screen max-w-md">
      <ScreenSlider screens={screens} />
    </main>
  );
}
