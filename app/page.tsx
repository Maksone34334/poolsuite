"use client";

import { useEffect, useState } from "react";
import { ScreenSlider } from "@/components/screen-slider";
import { PlayerScreen } from "@/components/player-screen";
import { ThemesScreen } from "@/components/themes-screen";
import { AboutScreen } from "@/components/about-screen";
import { usePlayerStore, type Channel } from "@/lib/player-store";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const setChannels = usePlayerStore((s) => s.setChannels);
  const playChannel = usePlayerStore((s) => s.playChannel);

  useEffect(() => {
    fetch("/api/channels")
      .then((r) => r.json())
      .then((channels: Channel[]) => {
        if (channels.length > 0) {
          setChannels(channels);
          // Don't auto-play, just set the first channel up
          const state = usePlayerStore.getState();
          if (!state.currentChannel) {
            // Set channel without playing
            usePlayerStore.setState({
              currentChannel: channels[0],
              currentTrack: channels[0].tracks[0],
              currentTrackIndex: 0,
            });
          }
        }
        setIsLoaded(true);
      })
      .catch(() => setIsLoaded(true));
  }, [setChannels, playChannel]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-secondary">
        <p className="animate-pulse text-lg font-bold text-primary">
          Loading Poolsuite FM...
        </p>
      </div>
    );
  }

  return (
    <ScreenSlider
      screens={[
        { id: "Player", name: "Poolsuite FM", Component: PlayerScreen },
        { id: "Themes", name: "Themes", Component: ThemesScreen },
        { id: "About", name: "About", Component: AboutScreen },
      ]}
    />
  );
}
