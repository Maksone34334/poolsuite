"use client"

import { useEffect, useState } from "react"
import { ScreenSlider } from "@/components/screen-slider"
import { PlayerScreen } from "@/components/player-screen"
import { ThemesScreen } from "@/components/themes-screen"
import { AboutScreen } from "@/components/about-screen"
import { usePlayerStore } from "@/lib/player-store"
import type { Channel } from "@/lib/player-store"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const setChannels = usePlayerStore((s) => s.setChannels)

  useEffect(() => {
    fetch("/api/channels")
      .then((r) => r.json())
      .then((channels: Channel[]) => {
        if (channels.length > 0) {
          setChannels(channels)
          const state = usePlayerStore.getState()
          if (!state.currentChannel) {
            usePlayerStore.setState({
              currentChannel: channels[0],
              currentTrack: channels[0].tracks[0],
              currentTrackIndex: 0,
            })
          }
        }
        setIsLoaded(true)
      })
      .catch(() => setIsLoaded(true))
  }, [setChannels])

  if (!isLoaded) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[var(--color-secondary)]">
        <p className="animate-pulse text-lg font-bold text-[var(--color-primary)]">
          Loading Poolsuite FM...
        </p>
      </div>
    )
  }

  return (
    <ScreenSlider
      screens={[
        { id: "Player", name: "Poolsuite FM", Component: PlayerScreen },
        { id: "Themes", name: "Themes", Component: ThemesScreen },
        { id: "About", name: "About", Component: AboutScreen },
      ]}
    />
  )
}
